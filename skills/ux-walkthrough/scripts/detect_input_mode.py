#!/usr/bin/env python3
"""
UX Walkthrough - 输入识别与代码仓库门禁判断脚本

用途：
- 在正式走查前，先做一次确定性输入识别
- 对代码仓库额外判断其是否属于可执行页面走查的页面项目
- 输出结构化 JSON，供外层决定是继续、补充输入，还是明确失败原因并等待补充

用法：
- python3 detect_input_mode.py <输入> --json
- python3 detect_input_mode.py --repo-path /path/to/repo --json
- python3 detect_input_mode.py --url https://example.com --json
- python3 detect_input_mode.py --image-path /path/to/image.png --json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse


FRONTEND_DEPENDENCIES = {
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "vue",
    "vue-router",
    "next",
    "nuxt",
    "@nuxt/ui",
    "@angular/core",
    "svelte",
    "@sveltejs/kit",
    "preact",
    "solid-js",
    "vite",
    "@vitejs/plugin-react",
    "@vitejs/plugin-vue",
    "@vitejs/plugin-vue-jsx",
    "webpack",
    "parcel",
    "astro",
    "umi",
    "@umijs/max",
    "taro",
    "uni-app",
    "@dcloudio/uni-app",
}
PAGE_FILE_EXTENSIONS = {
    ".html",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".styl",
    ".stylus",
    ".jsx",
    ".tsx",
    ".vue",
    ".svelte",
}
PAGE_DIRECTORY_HINTS = {
    "pages",
    "views",
    "routes",
    "scenes",
    "screens",
    "app",
}
PAGE_FILE_HINTS = {
    "app.tsx",
    "app.jsx",
    "app.vue",
    "app.svelte",
    "index.html",
}
SERVICE_FILE_HINTS = {
    "server.js",
    "server.ts",
    "app.js",
    "app.ts",
    "main.js",
    "main.ts",
}
SKIP_DIRECTORIES = {
    ".git",
    ".local-context",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".output",
    "coverage",
    ".turbo",
}


def _is_skipped_repo_path(rel_text: str) -> bool:
    parts = Path(rel_text).parts
    return len(parts) >= 2 and parts[0] == "scripts" and parts[1] == "dev"
ROUTER_SIGNAL_EXTENSIONS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".vue",
    ".svelte",
}
IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".bmp",
    ".svg",
}


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="识别 ux-walkthrough 输入模式并判断代码仓库是否为页面项目")
    parser.add_argument("input", nargs="?", default="")
    parser.add_argument("--repo-path", default="")
    parser.add_argument("--url", default="")
    parser.add_argument("--image-path", default="")
    parser.add_argument("--json", action="store_true")
    return parser


def _read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def _looks_like_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def _normalize_input(args: argparse.Namespace) -> tuple[str, str]:
    if args.repo_path.strip():
        return "repo", args.repo_path.strip()
    if args.url.strip():
        return "url", args.url.strip()
    if args.image_path.strip():
        return "image", args.image_path.strip()

    value = args.input.strip()
    if not value:
        return "unknown", ""
    if _looks_like_url(value):
        return "url", value

    path = Path(value).expanduser()
    if path.exists():
        if path.is_dir():
            return "repo", str(path)
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            return "image", str(path)

    lowered = value.lower()
    if lowered.endswith(tuple(IMAGE_EXTENSIONS)):
        return "image", value
    return "unknown", value


def _package_scripts(pkg: dict) -> dict[str, str]:
    scripts = pkg.get("scripts", {})
    if not isinstance(scripts, dict):
        return {}
    normalized: dict[str, str] = {}
    for key, value in scripts.items():
        if isinstance(value, str):
            normalized[str(key)] = value
    return normalized


def _package_dependencies(pkg: dict) -> set[str]:
    keys: set[str] = set()
    for field in ("dependencies", "devDependencies", "peerDependencies"):
        value = pkg.get(field, {})
        if isinstance(value, dict):
            keys.update(str(name) for name in value.keys())
    return keys


def _iter_repo_files(project_path: Path) -> tuple[list[str], list[str], list[str], list[str]]:
    page_files: list[str] = []
    style_files: list[str] = []
    router_files: list[str] = []
    service_files: list[str] = []

    for root, dirs, files in os.walk(project_path):
        dirs[:] = [name for name in dirs if name not in SKIP_DIRECTORIES and not name.startswith(".")]
        rel_root = Path(root).relative_to(project_path)
        if rel_root.parts == ("scripts",):
            dirs[:] = [name for name in dirs if name != "dev"]

        for name in files:
            rel_path = rel_root / name if str(rel_root) != "." else Path(name)
            rel_text = rel_path.as_posix()
            if _is_skipped_repo_path(rel_text):
                continue
            suffix = rel_path.suffix.lower()
            lowered_name = name.lower()

            if suffix in PAGE_FILE_EXTENSIONS:
                if suffix in {".css", ".scss", ".sass", ".less", ".styl", ".stylus"}:
                    style_files.append(rel_text)
                else:
                    page_files.append(rel_text)

            if suffix in ROUTER_SIGNAL_EXTENSIONS and re.search(r"(^|/)(router|routes?)(/|\.|$)", rel_text):
                router_files.append(rel_text)

            if lowered_name in SERVICE_FILE_HINTS or re.search(r"(^|/)(server|api)(/|\.|$)", rel_text):
                service_files.append(rel_text)

    return page_files, style_files, router_files, service_files


def _repo_kind(project_path: Path) -> dict:
    package_json_path = project_path / "package.json"
    pkg = _read_json(package_json_path) if package_json_path.is_file() else {}
    scripts = _package_scripts(pkg)
    deps = _package_dependencies(pkg)

    positive_signals: list[str] = []
    negative_signals: list[str] = []

    frontend_deps = sorted(dep for dep in deps if dep in FRONTEND_DEPENDENCIES)
    if frontend_deps:
        positive_signals.append(f"检测到前端依赖：{', '.join(frontend_deps[:5])}")

    script_values = " ".join(scripts.values()).lower()
    if any(keyword in script_values for keyword in ("vite", "next", "nuxt", "webpack", "react-scripts", "astro")):
        positive_signals.append("package.json 包含明显的前端构建或预览脚本")

    main_value = str(pkg.get("main", "")).strip().lower()
    if main_value.startswith("src/server") or main_value in {"server.js", "src/app.js", "src/server.ts"}:
        negative_signals.append(f"package.json 的 main 指向服务端入口：{pkg.get('main')}")

    if re.search(r"\bnode\s+src/server\.js\b", script_values):
        negative_signals.append("package.json 脚本以 node src/server.js 为主，呈现服务端项目特征")

    page_files, style_files, router_files, service_files = _iter_repo_files(project_path)

    page_like_files = [path for path in page_files if Path(path).name.lower() in PAGE_FILE_HINTS]
    if page_like_files:
        positive_signals.append(f"发现页面入口文件：{', '.join(page_like_files[:3])}")

    page_dirs = sorted(
        {
            part
            for path in page_files
            for part in Path(path).parts[:-1]
            if part.lower() in PAGE_DIRECTORY_HINTS
        }
    )
    if page_dirs:
        positive_signals.append(f"发现页面目录：{', '.join(page_dirs[:4])}")

    if router_files:
        positive_signals.append(f"发现路由相关文件：{', '.join(router_files[:3])}")

    if style_files:
        positive_signals.append(f"发现样式资源：{', '.join(style_files[:3])}")

    if service_files:
        negative_signals.append(f"发现明显服务端入口或目录：{', '.join(service_files[:3])}")

    if not page_files and not style_files and not router_files:
        negative_signals.append("仓库中未发现 html / jsx / tsx / vue / svelte / css 等页面资源")

    positive_score = len(positive_signals)
    negative_score = len(negative_signals)

    repo_kind = "unknown_project"
    confidence = "low"
    if positive_score >= 2 and positive_score >= negative_score:
        repo_kind = "page_project"
        confidence = "high" if positive_score >= 3 else "medium"
    elif negative_score >= 2 and positive_score == 0:
        repo_kind = "service_project"
        confidence = "high"
    elif negative_score > positive_score:
        repo_kind = "service_project"
        confidence = "medium"

    return {
        "confidence": confidence,
        "frontend_dependencies": frontend_deps[:10],
        "has_package_json": package_json_path.is_file(),
        "kind": repo_kind,
        "negative_signals": negative_signals,
        "page_file_count": len(page_files),
        "page_file_samples": page_files[:8],
        "positive_signals": positive_signals,
        "router_file_count": len(router_files),
        "router_file_samples": router_files[:8],
        "service_file_count": len(service_files),
        "service_file_samples": service_files[:8],
        "style_file_count": len(style_files),
        "style_file_samples": style_files[:8],
    }


def _result_for_repo(project_path: Path) -> dict:
    if not project_path.exists():
        return {
            "message": f"未找到仓库目录：{project_path}",
            "mode": "code",
            "next_action": "request_valid_repo_path",
            "ok": False,
            "path": str(project_path),
            "reason": "repo_not_found",
            "should_continue": False,
            "should_report_completion": False,
            "status": "needs_input",
        }

    if not project_path.is_dir():
        return {
            "message": f"输入不是有效目录：{project_path}",
            "mode": "code",
            "next_action": "request_valid_repo_path",
            "ok": False,
            "path": str(project_path),
            "reason": "repo_not_directory",
            "should_continue": False,
            "should_report_completion": False,
            "status": "needs_input",
        }

    repo = _repo_kind(project_path)
    result = {
        "message": "",
        "mode": "code",
        "next_action": "",
        "ok": True,
        "path": str(project_path.resolve()),
        "repo": repo,
        "should_continue": False,
        "should_report_completion": False,
        "status": "needs_input",
    }

    if repo["kind"] == "page_project":
        result.update(
            {
                "message": "已识别为代码走查输入，且仓库具备页面项目特征，可继续正式代码走查。",
                "next_action": "run_scan_pages",
                "should_continue": True,
                "status": "continue",
            }
        )
        return result

    if repo["kind"] == "service_project":
        failure_detail = "仓库可正常读取，但未发现前端页面资源或页面入口文件，当前输入不是可执行页面走查的页面项目。"
        result.update(
            {
                "failure_detail": failure_detail,
                "failure_preset": "code_not_page_project",
                "failure_reason": "not_page_project",
                "failure_stage": "evidence_ready",
                "message": "已识别为代码仓库输入，但仓库更像服务端或非页面项目，请说明失败原因，并提示用户补充真正的页面输入。",
                "next_action": "explain_failure",
                "should_report_completion": True,
                "status": "failed",
            }
        )
        return result

    result.update(
        {
            "message": "已识别为代码仓库输入，但当前仓库是否属于页面项目仍不够明确，建议继续补充上下文后再决定是否正式走查。",
            "next_input_hint": "可补充页面入口文件、页面运行方式、实际页面 URL 或页面截图。",
            "next_action": "request_project_context",
        }
    )
    return result


def _result_for_url(value: str) -> dict:
    return {
        "message": "已识别为 URL 走查输入，可继续执行 URL 模式的前置检查。",
        "mode": "url",
        "next_action": "run_evidence_gate",
        "ok": True,
        "path": value,
        "should_continue": True,
        "should_report_completion": False,
        "status": "continue",
    }


def _result_for_image(value: str) -> dict:
    path = Path(value).expanduser()
    exists = path.is_file()
    return {
        "exists": exists,
        "message": "已识别为截图走查输入，可继续执行截图模式的证据门禁判断。"
        if exists
        else "输入看起来像截图路径，但当前文件不存在，请确认路径后重试。",
        "mode": "screenshot",
        "next_action": "run_evidence_gate" if exists else "request_valid_screenshot_path",
        "ok": exists,
        "path": str(path),
        "should_continue": exists,
        "should_report_completion": False,
        "status": "continue" if exists else "needs_input",
    }


def _result_for_unknown(value: str) -> dict:
    return {
        "message": "当前输入还无法稳定识别为代码仓库、页面 URL 或截图，请先补充一种明确输入。",
        "mode": "unknown",
        "next_action": "request_input_clarification",
        "ok": False,
        "raw_input": value,
        "should_continue": False,
        "should_report_completion": False,
        "status": "needs_clarification",
    }


def build_result(args: argparse.Namespace) -> dict:
    input_kind, value = _normalize_input(args)

    if input_kind == "repo":
        return _result_for_repo(Path(value).expanduser())
    if input_kind == "url":
        return _result_for_url(value)
    if input_kind == "image":
        return _result_for_image(value)
    return _result_for_unknown(value)


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0 if result.get("ok", False) or result.get("status") in {"failed", "needs_input", "needs_clarification"} else 1


if __name__ == "__main__":
    sys.exit(main())
