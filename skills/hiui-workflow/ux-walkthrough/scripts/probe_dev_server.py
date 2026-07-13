#!/usr/bin/env python3
"""
UX Walkthrough - 本地 dev server 探测脚本

用途：
- 在 code 前置通过后，探测本地是否已有 dev server 在跑
- 给出建议启动命令与 next_action，供 Agent 决定走 URL 还是收窄 code 走查
- 默认只做端口/URL 探测，不在本脚本内长时间挂起启动 dev

用法：
- python3 probe_dev_server.py <项目路径> --json
- python3 probe_dev_server.py <项目路径> --url http://localhost:3000 --json
"""

from __future__ import annotations

import argparse
import json
import re
import socket
import sys
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen

DEFAULT_PORTS = (3000, 5173, 8080, 4200, 8000, 8888, 9527, 9000, 5174, 3001)
DEV_SCRIPT_KEYS = ("dev", "start", "serve", "preview")
PACKAGE_MANAGERS = (
    ("pnpm-lock.yaml", "pnpm"),
    ("yarn.lock", "yarn"),
    ("package-lock.json", "npm"),
    ("bun.lockb", "bun"),
    ("bun.lock", "bun"),
)


def _read_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return data if isinstance(data, dict) else {}


def _detect_package_manager(project_path: Path) -> str:
    for lock_name, manager in PACKAGE_MANAGERS:
        if (project_path / lock_name).is_file():
            return manager
    return "npm"


def _find_package_json(project_path: Path) -> tuple[Path | None, dict]:
    root_pkg = project_path / "package.json"
    if root_pkg.is_file():
        return root_pkg, _read_json(root_pkg)

    candidates: list[tuple[int, Path, dict]] = []
    for path in project_path.rglob("package.json"):
        rel_parts = path.relative_to(project_path).parts
        if any(part in {"node_modules", ".git", "dist", "build", ".next"} for part in rel_parts):
            continue
        pkg = _read_json(path)
        scripts = pkg.get("scripts", {})
        if isinstance(scripts, dict) and any(key in scripts for key in DEV_SCRIPT_KEYS):
            depth = len(rel_parts)
            candidates.append((depth, path, pkg))

    if not candidates:
        return None, {}

    candidates.sort(key=lambda item: item[0])
    _, best_path, best_pkg = candidates[0]
    return best_path, best_pkg


def _pick_dev_script(scripts: dict) -> tuple[str, str]:
    if not isinstance(scripts, dict):
        return "", ""
    for key in DEV_SCRIPT_KEYS:
        value = str(scripts.get(key, "")).strip()
        if value:
            return key, value
    return "", ""


def _build_dev_command(manager: str, script_name: str) -> str:
    if not script_name:
        return ""
    if manager == "npm":
        return f"npm run {script_name}"
    return f"{manager} {script_name}"


def _guess_ports_from_config(project_path: Path, pkg_path: Path | None, pkg: dict) -> list[int]:
    ports: list[int] = []
    search_roots = [project_path]
    if pkg_path is not None:
        search_roots.insert(0, pkg_path.parent)

    patterns = (
        r"port\s*[:=]\s*(\d{2,5})",
        r"--port\s+(\d{2,5})",
        r"PORT\s*=\s*(\d{2,5})",
    )
    config_names = (
        "vite.config.ts",
        "vite.config.js",
        "vite.config.mjs",
        "next.config.js",
        "next.config.mjs",
        "next.config.ts",
        "webpack.config.js",
        "nuxt.config.ts",
        "nuxt.config.js",
        ".env",
        ".env.local",
        ".env.development",
    )

    for root in search_roots:
        for name in config_names:
            path = root / name
            if not path.is_file():
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for pattern in patterns:
                for match in re.finditer(pattern, text, flags=re.IGNORECASE):
                    ports.append(int(match.group(1)))

    scripts = pkg.get("scripts", {}) if isinstance(pkg.get("scripts"), dict) else {}
    for value in scripts.values():
        text = str(value)
        for match in re.finditer(r"--port\s+(\d{2,5})", text):
            ports.append(int(match.group(1)))

    deduped: list[int] = []
    for port in ports:
        if 1 <= port <= 65535 and port not in deduped:
            deduped.append(port)
    return deduped


def _probe_url(url: str, timeout: float) -> bool:
    request = Request(url, method="GET", headers={"User-Agent": "ux-walkthrough-probe/1.0"})
    try:
        with urlopen(request, timeout=timeout) as response:
            return 200 <= int(getattr(response, "status", 200)) < 500
    except (URLError, TimeoutError, ValueError, OSError):
        return False


def _probe_port(host: str, port: int, timeout: float) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def _discover_reachable_urls(project_path: Path, ports: list[int], timeout: float) -> list[str]:
    reachable: list[str] = []
    hosts = ("127.0.0.1", "localhost")
    schemes = ("http",)

    for port in ports:
        for host in hosts:
            for scheme in schemes:
                url = f"{scheme}://{host}:{port}/"
                if _probe_url(url, timeout):
                    if url not in reachable:
                        reachable.append(url)
                    break
            else:
                continue
            break

    return reachable


def build_probe_result(project_path: str, verify_url: str = "", timeout: float = 1.5) -> dict:
    root = Path(project_path).expanduser().resolve()
    result: dict = {
        "ok": False,
        "project_path": str(root),
        "runtime_available": False,
        "reachable_urls": [],
        "suggested_dev_command": "",
        "dev_script_name": "",
        "dev_script_command": "",
        "package_json": "",
        "package_manager": "",
        "probe_ports": [],
        "next_action": "fallback_code_walkthrough",
        "message": "",
        "fallback_reason": "",
    }

    if not root.is_dir():
        result["message"] = "项目路径不存在或不可读，无法探测本地 dev server。"
        result["fallback_reason"] = "project_path_unreadable"
        return result

    pkg_path, pkg = _find_package_json(root)
    manager = _detect_package_manager(root if pkg_path is None else pkg_path.parent)
    script_name, script_command = _pick_dev_script(pkg.get("scripts", {}) if pkg else {})
    suggested_dev_command = _build_dev_command(manager, script_name)

    result["package_manager"] = manager
    result["dev_script_name"] = script_name
    result["dev_script_command"] = script_command
    result["suggested_dev_command"] = suggested_dev_command
    result["package_json"] = str(pkg_path) if pkg_path else ""

    ports = _guess_ports_from_config(root, pkg_path, pkg)
    for port in DEFAULT_PORTS:
        if port not in ports:
            ports.append(port)
    result["probe_ports"] = ports

    if verify_url.strip():
        if _probe_url(verify_url.strip(), timeout):
            result["runtime_available"] = True
            result["reachable_urls"] = [verify_url.strip()]
            result["next_action"] = "try_url_walkthrough"
            result["ok"] = True
            result["message"] = "指定 URL 已可达，建议切换为 URL 走查并采集标注图。"
            return result

        result["fallback_reason"] = "verify_url_unreachable"
        result["message"] = "指定 URL 暂不可达，请尝试启动 dev server；若仍失败则收窄 code 走查。"
        if suggested_dev_command:
            result["next_action"] = "start_dev_server_then_url_walkthrough"
        return result

    reachable_urls = _discover_reachable_urls(root, ports, timeout)
    if reachable_urls:
        result["runtime_available"] = True
        result["reachable_urls"] = reachable_urls
        result["next_action"] = "try_url_walkthrough"
        result["ok"] = True
        result["message"] = "检测到本地 dev server 已在运行，建议对可达 URL 执行 URL 前置检查与浏览器走查。"
        return result

    if suggested_dev_command:
        result["next_action"] = "start_dev_server_then_url_walkthrough"
        result["ok"] = True
        result["message"] = (
            "未检测到运行中的 dev server。"
            f"建议先执行 `{suggested_dev_command}`，启动成功后再对本地 URL 做 URL 走查；"
            "若启动失败，则收窄 code 走查范围。"
        )
        return result

    result["fallback_reason"] = "no_dev_script"
    result["message"] = "未找到可用的 dev/start 脚本，也未探测到本地服务，建议收窄 code 走查并注明未启动项目。"
    result["next_action"] = "fallback_code_walkthrough"
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="探测本地 dev server 是否可用")
    parser.add_argument("project_path", nargs="?", default=".")
    parser.add_argument("--url", default="", help="可选：验证 Agent 已拿到的本地 URL")
    parser.add_argument("--timeout", type=float, default=1.5)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    result = build_probe_result(args.project_path, verify_url=args.url, timeout=args.timeout)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
