#!/usr/bin/env python3
"""
UX Walkthrough - 阶段 B 统一准备入口

用途：
- 接收阶段 A 的 precheck 结果
- 自动判断当前阶段 B 应按 url / code / screenshot 哪种口径继续
- 串行调用 build_business_context.py，产出可直接用于走查的业务理解卡

用法示例：
  python3 prepare_walkthrough_context.py --precheck-json-file precheck.json --json
  python3 prepare_walkthrough_context.py --precheck-json '{"ok":true,...}' --prd-path prd.md --json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
BUILD_CONTEXT_SCRIPT = SCRIPT_DIR / "build_business_context.py"
PYTHON_BIN = sys.executable or "python3"
RUNTIME_URL_ACTIONS = {"try_url_walkthrough", "start_dev_server_then_url_walkthrough"}
CODE_ACTIONS = {"continue_walkthrough", "fallback_code_walkthrough"}


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="根据 precheck 结果准备阶段 B 的业务理解上下文")
    parser.add_argument("--precheck-json", default="")
    parser.add_argument("--precheck-json-file", default="")
    parser.add_argument("--prd-path", action="append", default=[])
    parser.add_argument("--signal-file", action="append", default=[])
    parser.add_argument("--signal", action="append", default=[])
    parser.add_argument("--page-title", action="append", default=[])
    parser.add_argument("--route", action="append", default=[])
    parser.add_argument("--current-url", default="")
    parser.add_argument("--project-path", default="")
    parser.add_argument("--json", action="store_true")
    return parser


def _text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _load_precheck(args: argparse.Namespace) -> dict:
    if _text(args.precheck_json):
        try:
            data = json.loads(args.precheck_json)
        except json.JSONDecodeError as exc:
            raise ValueError(f"--precheck-json 不是合法 JSON：{exc}") from exc
        if not isinstance(data, dict):
            raise ValueError("--precheck-json 根节点必须是对象")
        return data

    if _text(args.precheck_json_file):
        path = Path(_text(args.precheck_json_file)).expanduser().resolve()
        if not path.is_file():
            raise ValueError(f"precheck JSON 文件不存在：{path}")
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError(f"precheck JSON 文件不是合法 JSON：{exc}") from exc
        if not isinstance(data, dict):
            raise ValueError("precheck JSON 文件根节点必须是对象")
        return data

    raise ValueError("必须提供 --precheck-json 或 --precheck-json-file")


def _derive_walkthrough_source(precheck: dict) -> str:
    mode = _text(precheck.get("mode", "")).lower()
    source = _text(precheck.get("source", "")).lower()
    action = _text(precheck.get("next_action", "")).lower()
    if action in RUNTIME_URL_ACTIONS:
        return "url"
    if mode == "code" and action in CODE_ACTIONS:
        return "code"
    if source in {"code", "url", "screenshot"}:
        return source
    if mode in {"code", "url", "screenshot"}:
        return mode
    return ""


def _derive_project_path(precheck: dict, args: argparse.Namespace) -> str:
    if _text(args.project_path):
        return _text(args.project_path)
    detect = precheck.get("detect", {}) if isinstance(precheck.get("detect"), dict) else {}
    detected_path = _text(detect.get("path", ""))
    if detected_path:
        return detected_path
    input_info = precheck.get("input", {}) if isinstance(precheck.get("input"), dict) else {}
    return _text(input_info.get("repo_path", "")) or _text(input_info.get("input", ""))


def _derive_current_url(precheck: dict, args: argparse.Namespace) -> str:
    if _text(args.current_url):
        return _text(args.current_url)
    runtime_probe = precheck.get("runtime_probe", {}) if isinstance(precheck.get("runtime_probe"), dict) else {}
    reachable_urls = runtime_probe.get("reachable_urls", [])
    if isinstance(reachable_urls, list):
        for url in reachable_urls:
            if _text(url):
                return _text(url)
    input_info = precheck.get("input", {}) if isinstance(precheck.get("input"), dict) else {}
    return _text(input_info.get("url", ""))


def _build_context_command(precheck: dict, args: argparse.Namespace) -> list[str]:
    command = [PYTHON_BIN, str(BUILD_CONTEXT_SCRIPT), "--json"]

    for path in args.prd_path:
        path_text = _text(path)
        if path_text:
            command.extend(["--prd-path", path_text])
    for path in args.signal_file:
        path_text = _text(path)
        if path_text:
            command.extend(["--signal-file", path_text])
    for signal in args.signal:
        signal_text = _text(signal)
        if signal_text:
            command.extend(["--signal", signal_text])
    for title in args.page_title:
        title_text = _text(title)
        if title_text:
            command.extend(["--page-title", title_text])
    for route in args.route:
        route_text = _text(route)
        if route_text:
            command.extend(["--route", route_text])

    walkthrough_source = _derive_walkthrough_source(precheck)
    if walkthrough_source == "code":
        project_path = _derive_project_path(precheck, args)
        if project_path:
            command.extend(["--project-path", project_path])
    else:
        current_url = _derive_current_url(precheck, args)
        if current_url:
            command.extend(["--route", current_url])

    return command


def _run_context_builder(command: list[str]) -> tuple[dict, subprocess.CompletedProcess[str]]:
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    stdout = (completed.stdout or "").strip()
    if not stdout:
        return {}, completed
    try:
        data = json.loads(stdout)
    except json.JSONDecodeError:
        return {}, completed
    return (data if isinstance(data, dict) else {}), completed


def _build_result(args: argparse.Namespace) -> dict:
    precheck = _load_precheck(args)
    walkthrough_source = _derive_walkthrough_source(precheck)
    if not bool(precheck.get("ok")) or not bool(precheck.get("should_continue")):
        return {
            "message": "阶段 A 尚未通过，当前不应进入阶段 B 的业务理解准备。",
            "next_action": _text(precheck.get("next_action", "")) or "return_to_precheck",
            "ok": False,
            "precheck": precheck,
            "status": "needs_input",
            "walkthrough_source": walkthrough_source,
        }

    command = _build_context_command(precheck, args)
    context_result, completed = _run_context_builder(command)
    if not context_result:
        return {
            "build_command": command,
            "message": "业务理解脚本没有返回可解析的 JSON，当前无法继续阶段 B。",
            "next_action": "request_business_context_clarification",
            "ok": False,
            "precheck": precheck,
            "status": "needs_input",
            "stderr": (completed.stderr or "").strip(),
            "stdout": (completed.stdout or "").strip(),
            "walkthrough_source": walkthrough_source,
        }

    status = _text(context_result.get("status", "")) or "needs_input"
    next_action = _text(context_result.get("next_action", ""))
    if walkthrough_source and next_action == "continue_walkthrough":
        next_action = f"run_{walkthrough_source}_walkthrough"
    elif walkthrough_source and next_action == "confirmed_issues_only":
        next_action = f"run_{walkthrough_source}_walkthrough_with_limited_business_claims"

    return {
        "build_command": command,
        "business_context_result": context_result,
        "message": _text(context_result.get("message", "")),
        "next_action": next_action,
        "ok": bool(context_result.get("ok", False)),
        "precheck": precheck,
        "status": status,
        "walkthrough_source": walkthrough_source,
    }


def main() -> int:
    args = _build_parser().parse_args()
    try:
        result = _build_result(args)
    except ValueError as exc:
        result = {
            "message": str(exc),
            "next_action": "request_business_context_clarification",
            "ok": False,
            "status": "needs_input",
            "walkthrough_source": "",
        }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result.get("message", ""))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
