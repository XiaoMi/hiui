#!/usr/bin/env python3
"""
UX Walkthrough - 统一前置检查脚本

用途：
- 把 detect_input_mode.py -> scan-pages.py -> check_evidence_gate.py 串成一个统一前置检查入口
- 优先给外层返回单一结构化结果，减少外层自己拼阶段逻辑
- 保留底层脚本，便于单独调试；主流程优先调用本脚本

用法：
- python3 precheck_walkthrough.py <输入> --json
- python3 precheck_walkthrough.py --repo-path /path/to/repo --json
- python3 precheck_walkthrough.py --url https://example.com --current-url https://example.com --page-title 标题 --json
- python3 precheck_walkthrough.py --image-path a.png --image-path b.png --json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
DETECT_SCRIPT = SCRIPT_DIR / "detect_input_mode.py"
SCAN_SCRIPT = SCRIPT_DIR / "scan-pages.py"
GATE_SCRIPT = SCRIPT_DIR / "check_evidence_gate.py"
PROBE_SCRIPT = SCRIPT_DIR / "probe_dev_server.py"
PYTHON_BIN = sys.executable or "python3"


def _parse_bool(raw: str) -> bool:
    value = raw.strip().lower()
    if value in {"1", "true", "yes", "y"}:
        return True
    if value in {"0", "false", "no", "n"}:
        return False
    raise argparse.ArgumentTypeError(f"无法识别布尔值: {raw}")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="统一执行 ux-walkthrough 的前置检查")
    parser.add_argument("input", nargs="?", default="")
    parser.add_argument("--repo-path", default="")
    parser.add_argument("--url", default="")
    parser.add_argument("--image-path", action="append", default=[])
    parser.add_argument("--project", default="")

    parser.add_argument("--current-url", default="")
    parser.add_argument("--page-title", default="")
    parser.add_argument("--page-reachable", type=_parse_bool, default=True)
    parser.add_argument("--login-required", type=_parse_bool, default=False)
    parser.add_argument("--has-screenshot-evidence", type=_parse_bool, default=False)

    parser.add_argument("--minimum-images", type=int, default=1)
    parser.add_argument("--evidence-complete", default="auto")

    parser.add_argument("--scan-succeeded", default="auto")
    parser.add_argument("--manual-evidence", type=_parse_bool, default=False)
    parser.add_argument("--minimum-pages", type=int, default=1)
    parser.add_argument("--minimum-router-files", type=int, default=0)

    parser.add_argument("--detail", default="")
    parser.add_argument("--json", action="store_true")
    return parser


def _run_json_command(command: list[str]) -> tuple[dict, subprocess.CompletedProcess[str]]:
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    stdout = (completed.stdout or "").strip()
    if not stdout:
        return {}, completed
    try:
        data = json.loads(stdout)
    except json.JSONDecodeError:
        return {}, completed
    return data if isinstance(data, dict) else {}, completed


def _normalize_input_value(args: argparse.Namespace) -> tuple[str, str]:
    if args.repo_path.strip():
        return "repo", args.repo_path.strip()
    if args.url.strip():
        return "url", args.url.strip()
    image_paths = [value.strip() for value in args.image_path if value.strip()]
    if image_paths:
        return "image", image_paths[0]
    if args.current_url.strip():
        return "url", args.current_url.strip()
    return "input", args.input.strip()


def _run_detect(args: argparse.Namespace) -> dict:
    input_kind, value = _normalize_input_value(args)
    command = [PYTHON_BIN, str(DETECT_SCRIPT), "--json"]

    if input_kind == "repo":
        command.extend(["--repo-path", value])
    elif input_kind == "url":
        command.extend(["--url", value])
    elif input_kind == "image":
        command.extend(["--image-path", value])
    elif value:
        command.append(value)

    result, completed = _run_json_command(command)
    if result:
        return result

    return {
        "message": "输入识别脚本没有返回可解析的 JSON，当前无法继续前置检查。",
        "mode": "unknown",
        "next_action": "request_input_clarification",
        "ok": False,
        "script_exit_code": completed.returncode,
        "should_continue": False,
        "should_report_completion": False,
        "status": "needs_input",
        "stderr": (completed.stderr or "").strip(),
        "stdout": (completed.stdout or "").strip(),
    }


def _run_scan(project_path: str) -> dict:
    with tempfile.NamedTemporaryFile(prefix="uxw-scan-", suffix=".json", delete=False) as handle:
        output_path = Path(handle.name)

    command = [PYTHON_BIN, str(SCAN_SCRIPT), project_path, "--output", str(output_path)]
    completed = subprocess.run(command, capture_output=True, text=True, check=False)

    scan_json: dict = {}
    if output_path.is_file():
        try:
            scan_json = json.loads(output_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            scan_json = {}

    summary = scan_json.get("summary", {}) if isinstance(scan_json, dict) else {}
    return {
        "attempted": True,
        "exit_code": completed.returncode,
        "output_path": str(output_path),
        "stderr": (completed.stderr or "").strip(),
        "stdout": (completed.stdout or "").strip(),
        "succeeded": completed.returncode == 0 and bool(scan_json),
        "summary": summary if isinstance(summary, dict) else {},
    }


def _run_runtime_probe(project_path: str) -> dict:
    command = [PYTHON_BIN, str(PROBE_SCRIPT), project_path, "--json"]
    result, completed = _run_json_command(command)
    if result:
        return result

    return {
        "attempted": True,
        "exit_code": completed.returncode,
        "fallback_reason": "probe_script_failed",
        "message": "dev server 探测脚本没有返回可解析 JSON，默认收窄 code 走查。",
        "next_action": "fallback_code_walkthrough",
        "ok": False,
        "runtime_available": False,
        "reachable_urls": [],
        "stderr": (completed.stderr or "").strip(),
        "stdout": (completed.stdout or "").strip(),
    }


def _apply_code_runtime_probe(result: dict, project_path: str) -> None:
    probe_result = _run_runtime_probe(project_path)
    result["runtime_probe"] = probe_result

    gate_ok = bool(result.get("ok"))
    gate_continue = str(result.get("next_action", "")).strip() == "continue_walkthrough"
    if not gate_ok or not gate_continue:
        return

    runtime_action = str(probe_result.get("next_action", "")).strip()
    runtime_message = str(probe_result.get("message", "")).strip()
    if runtime_action:
        result["next_action"] = runtime_action
    if runtime_message:
        result["message"] = runtime_message
    result["precheck_stage"] = "runtime_probe"


def _run_gate(args: argparse.Namespace, source: str, scan: dict | None = None) -> dict:
    command = [PYTHON_BIN, str(GATE_SCRIPT), "--source", source, "--json"]

    if args.project.strip():
        command.extend(["--project", args.project.strip()])
    if args.detail.strip():
        command.extend(["--detail", args.detail.strip()])

    if source == "url":
        current_url = args.current_url.strip() or args.url.strip()
        if current_url:
            command.extend(["--current-url", current_url])
        if args.page_title.strip():
            command.extend(["--page-title", args.page_title.strip()])
        command.extend(["--page-reachable", "true" if args.page_reachable else "false"])
        command.extend(["--login-required", "true" if args.login_required else "false"])
        command.extend(["--has-screenshot-evidence", "true" if args.has_screenshot_evidence else "false"])

    elif source == "screenshot":
        for path in [value.strip() for value in args.image_path if value.strip()]:
            command.extend(["--image-path", path])
        command.extend(["--minimum-images", str(args.minimum_images)])
        command.extend(["--evidence-complete", args.evidence_complete.strip() or "auto"])

    elif source == "code":
        scan_info = scan or {}
        if args.manual_evidence:
            command.extend(["--manual-evidence", "true"])
        else:
            command.extend(["--manual-evidence", "false"])
        command.extend(["--minimum-pages", str(args.minimum_pages)])
        command.extend(["--minimum-router-files", str(args.minimum_router_files)])
        command.extend(["--scan-succeeded", "true" if scan_info.get("succeeded") else ("false" if scan_info.get("attempted") else args.scan_succeeded.strip() or "auto")])
        output_path = str(scan_info.get("output_path", "")).strip()
        if output_path:
            command.extend(["--scan-json", output_path])
        if scan_info.get("attempted") and not scan_info.get("succeeded") and not args.detail.strip():
            stderr = str(scan_info.get("stderr", "")).strip()
            stdout = str(scan_info.get("stdout", "")).strip()
            detail = stderr or stdout or "scan-pages.py 未成功产出可用结果。"
            command.extend(["--detail", detail[:200]])

    result, completed = _run_json_command(command)
    if result:
        return result

    return {
        "message": "证据门禁脚本没有返回可解析的 JSON，当前无法继续前置检查。",
        "next_action": "request_more_evidence",
        "ok": False,
        "script_exit_code": completed.returncode,
        "should_continue": False,
        "should_report_completion": False,
        "source": source,
        "status": "needs_input",
        "stderr": (completed.stderr or "").strip(),
        "stdout": (completed.stdout or "").strip(),
    }


def _base_result(args: argparse.Namespace, detect_result: dict) -> dict:
    return {
        "input": {
            "input": args.input.strip(),
            "repo_path": args.repo_path.strip(),
            "url": args.url.strip(),
            "image_paths": [value.strip() for value in args.image_path if value.strip()],
            "project": args.project.strip(),
        },
        "message": "",
        "mode": str(detect_result.get("mode", "")).strip(),
        "next_action": "",
        "ok": bool(detect_result.get("ok", False)),
        "precheck_stage": "detect",
        "should_continue": bool(detect_result.get("should_continue", False)),
        "should_report_completion": bool(detect_result.get("should_report_completion", False)),
        "source": str(detect_result.get("mode", "")).strip(),
        "status": str(detect_result.get("status", "")).strip(),
    }


def build_result(args: argparse.Namespace) -> dict:
    detect_result = _run_detect(args)
    result = _base_result(args, detect_result)
    result["detect"] = detect_result

    if not detect_result:
        result.update(
            {
                "message": "输入识别阶段未返回有效结果，当前无法继续。",
                "next_action": "request_input_clarification",
                "ok": False,
                "status": "needs_input",
            }
        )
        return result

    detect_status = str(detect_result.get("status", "")).strip()
    mode = str(detect_result.get("mode", "")).strip()

    if detect_status != "continue":
        result.update(
            {
                "message": str(detect_result.get("message", "")).strip(),
                "next_action": str(detect_result.get("next_action", "")).strip(),
                "ok": bool(detect_result.get("ok", False)),
                "precheck_stage": "detect",
                "should_continue": bool(detect_result.get("should_continue", False)),
                "should_report_completion": bool(detect_result.get("should_report_completion", False)),
                "source": mode if mode in {"code", "url", "screenshot"} else "",
                "status": detect_status or "needs_input",
            }
        )
        if detect_result.get("failure_preset"):
            result["failure_preset"] = detect_result["failure_preset"]
        if detect_result.get("failure_stage"):
            result["failure_stage"] = detect_result["failure_stage"]
        if detect_result.get("failure_reason"):
            result["failure_reason"] = detect_result["failure_reason"]
        if detect_result.get("failure_detail"):
            result["failure_detail"] = detect_result["failure_detail"]
        return result

    scan_result: dict | None = None
    if mode == "code":
        project_path = str(detect_result.get("path", "")).strip() or args.repo_path.strip() or args.input.strip()
        scan_result = _run_scan(project_path)
        result["scan"] = scan_result

    gate_result = _run_gate(args, mode, scan_result)
    result["gate"] = gate_result
    result.update(
        {
            "message": str(gate_result.get("message", "")).strip(),
            "next_action": str(gate_result.get("next_action", "")).strip(),
            "ok": bool(gate_result.get("ok", False)),
            "precheck_stage": "gate",
            "should_continue": bool(gate_result.get("should_continue", False)),
            "should_report_completion": bool(gate_result.get("should_report_completion", False)),
            "source": str(gate_result.get("source", mode)).strip(),
            "status": str(gate_result.get("status", "")).strip() or "needs_input",
        }
    )
    if gate_result.get("failure_preset"):
        result["failure_preset"] = gate_result["failure_preset"]
    if gate_result.get("failure_stage"):
        result["failure_stage"] = gate_result["failure_stage"]
    if gate_result.get("failure_reason"):
        result["failure_reason"] = gate_result["failure_reason"]
    if gate_result.get("failure_detail"):
        result["failure_detail"] = gate_result["failure_detail"]

    if mode == "code" and bool(result.get("ok")) and str(result.get("next_action", "")).strip() == "continue_walkthrough":
        project_path = str(detect_result.get("path", "")).strip() or args.repo_path.strip() or args.input.strip()
        if project_path:
            _apply_code_runtime_probe(result, project_path)

    return result


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
