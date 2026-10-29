#!/usr/bin/env python3
"""
UX Walkthrough - 统一终态收口脚本

用途：
- 基于 classify_closeout.py 统一判断 success / failed / canceled / needs_input
- 对已达到收口条件的结果直接返回 completed，避免再执行额外的数据上报逻辑
- 保留 --dry-run / --flush-only 等旧参数作为兼容空操作，便于历史调用方式继续工作
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
CLASSIFY_SCRIPT = SCRIPT_DIR / "classify_closeout.py"
PYTHON_BIN = sys.executable or "python3"


def _parse_bool(raw: str) -> bool:
    value = raw.strip().lower()
    if value in {"1", "true", "yes", "y"}:
        return True
    if value in {"0", "false", "no", "n"}:
        return False
    raise argparse.ArgumentTypeError(f"无法识别布尔值: {raw}")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="统一执行 ux-walkthrough 的终态收口")

    parser.add_argument("--source", default="", choices=["", "code", "url", "screenshot"])
    parser.add_argument("--project", default="")
    parser.add_argument("--precheck-json", default="")
    parser.add_argument("--report-json", default="")
    parser.add_argument("--detect-json", default="")
    parser.add_argument("--gate-json", default="")
    parser.add_argument("--precheck-started", type=_parse_bool, default=False)
    parser.add_argument("--formal-walkthrough-started", type=_parse_bool, default=False)
    parser.add_argument("--user-canceled", type=_parse_bool, default=False)
    parser.add_argument("--report-generated", type=_parse_bool, default=False)
    parser.add_argument("--docx-generated", type=_parse_bool, default=False)
    parser.add_argument("--docx-name", default="")
    parser.add_argument("--docx-path", default="")
    parser.add_argument("--docx-failed", type=_parse_bool, default=False)
    parser.add_argument("--failure-detail", default="")

    parser.add_argument("--skill-name", default="")
    parser.add_argument("--version", default="")
    parser.add_argument("--run-id", default="")
    parser.add_argument("--user-email", default="")
    parser.add_argument("--install-id", default="")
    parser.add_argument("--report-mode", default="")
    parser.add_argument("--os", default="")
    parser.add_argument("--ide-tool", default="")
    parser.add_argument("--service-url", default="")
    parser.add_argument("--service-token", default="")
    parser.add_argument("--timeout-seconds", type=float, default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--flush-only", action="store_true")
    parser.add_argument("--json", action="store_true")
    return parser


def _load_json_source(raw: str) -> dict:
    value = raw.strip()
    if not value:
        return {}

    if value.startswith("{") or value.startswith("["):
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            return {}
        return data if isinstance(data, dict) else {}

    path = Path(value).expanduser()
    try:
        is_file = path.is_file()
    except OSError:
        is_file = False

    if is_file:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}
        return data if isinstance(data, dict) else {}

    try:
        data = json.loads(value)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def _append_str_arg(command: list[str], flag: str, value: str) -> None:
    if value.strip():
        command.extend([flag, value.strip()])


def _append_bool_arg(command: list[str], flag: str, value: bool) -> None:
    command.extend([flag, "true" if value else "false"])


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


def _synthesize_failure_payload(precheck_result: dict) -> dict:
    if str(precheck_result.get("status", "")).strip() != "failed":
        return {}

    source = str(precheck_result.get("source", "")).strip() or str(precheck_result.get("mode", "")).strip()
    failure_preset = str(precheck_result.get("failure_preset", "")).strip()
    failure_reason = str(precheck_result.get("failure_reason", "")).strip()
    failure_stage = str(precheck_result.get("failure_stage", "")).strip()
    message = str(precheck_result.get("message", "")).strip()

    if not (failure_preset or failure_reason or failure_stage or message):
        return {}

    return {
        "status": "failed",
        "source": source,
        "failure_preset": failure_preset,
        "failure_reason": failure_reason,
        "failure_stage": failure_stage,
        "message": message,
        "should_finalize_usage": True,
    }


def _derive_detect_gate_payloads(args: argparse.Namespace, precheck_result: dict) -> tuple[dict, dict]:
    detect_payload = _load_json_source(args.detect_json)
    gate_payload = _load_json_source(args.gate_json)

    if detect_payload or gate_payload:
        return detect_payload, gate_payload

    if not precheck_result:
        return {}, {}

    nested_detect = precheck_result.get("detect")
    nested_gate = precheck_result.get("gate")
    if isinstance(nested_detect, dict):
        detect_payload = nested_detect
    if isinstance(nested_gate, dict):
        gate_payload = nested_gate

    if detect_payload or gate_payload:
        return detect_payload, gate_payload

    synthesized_failure = _synthesize_failure_payload(precheck_result)
    if synthesized_failure:
        return {}, synthesized_failure

    status = str(precheck_result.get("status", "")).strip()
    if status:
        return {}, {
            "status": status,
            "source": str(precheck_result.get("source", "")).strip() or str(precheck_result.get("mode", "")).strip(),
            "message": str(precheck_result.get("message", "")).strip(),
        }

    return {}, {}


def _build_classify_command(args: argparse.Namespace, precheck_result: dict) -> list[str]:
    command = [PYTHON_BIN, str(CLASSIFY_SCRIPT), "--json"]
    detect_payload, gate_payload = _derive_detect_gate_payloads(args, precheck_result)

    _append_str_arg(command, "--source", args.source)
    _append_str_arg(command, "--project", args.project)
    _append_str_arg(command, "--report-json", args.report_json)
    _append_str_arg(command, "--docx-name", args.docx_name)
    _append_str_arg(command, "--docx-path", args.docx_path)
    _append_str_arg(command, "--failure-detail", args.failure_detail)

    if detect_payload:
        command.extend(["--detect-json", json.dumps(detect_payload, ensure_ascii=False)])
    if gate_payload:
        command.extend(["--gate-json", json.dumps(gate_payload, ensure_ascii=False)])

    _append_bool_arg(command, "--precheck-started", args.precheck_started or bool(precheck_result))
    _append_bool_arg(command, "--formal-walkthrough-started", args.formal_walkthrough_started)
    _append_bool_arg(command, "--user-canceled", args.user_canceled)
    _append_bool_arg(command, "--report-generated", args.report_generated)
    _append_bool_arg(command, "--docx-generated", args.docx_generated)
    _append_bool_arg(command, "--docx-failed", args.docx_failed)
    return command


def _flush_only_result() -> dict:
    return {
        "closeout_completed": True,
        "compat_mode": True,
        "message": "当前版本不再需要执行补传或补跑收口。",
        "next_action": "",
        "ok": True,
        "precheck": None,
        "requires_network_authorization": False,
        "stage": "closeout",
        "status": "completed",
    }


def _completed_message(outcome: str) -> str:
    if outcome == "failed":
        return "当前任务已按失败路径完成统一收口。"
    if outcome == "canceled":
        return "当前任务已按取消路径完成统一收口。"
    return "完整交付已完成，统一收口已完成。"


def build_result(args: argparse.Namespace) -> dict:
    precheck_result = _load_json_source(args.precheck_json)

    if args.flush_only:
        result = _flush_only_result()
        result["precheck"] = precheck_result if precheck_result else None
        return result

    command = _build_classify_command(args, precheck_result)
    classification, completed = _run_json_command(command)

    if not classification:
        return {
            "closeout_completed": False,
            "message": "classify_closeout.py 没有返回可解析的 JSON，当前无法确认统一收口状态。",
            "next_action": "",
            "ok": False,
            "precheck": precheck_result if precheck_result else None,
            "requires_network_authorization": False,
            "stage": "classification",
            "status": "invalid_result",
            "stderr": (completed.stderr or "").strip(),
            "stdout": (completed.stdout or "").strip(),
        }

    result = {
        "classification": classification,
        "closeout_completed": False,
        "message": str(classification.get("message", "")).strip(),
        "next_action": str(classification.get("next_action", "")).strip(),
        "ok": bool(classification.get("ok", False)),
        "precheck": precheck_result if precheck_result else None,
        "requires_network_authorization": False,
        "stage": "classification",
        "status": str(classification.get("status", "")).strip() or "needs_input",
    }

    should_closeout = bool(classification.get("should_closeout", classification.get("should_finalize_usage", False)))
    if not should_closeout:
        return result

    outcome = str(classification.get("status", "")).strip()
    if outcome not in {"success", "failed", "canceled"}:
        result.update(
            {
                "message": "统一收口判定已就绪，但返回了无法识别的终态。",
                "next_action": "",
                "ok": False,
                "stage": "closeout",
                "status": "invalid_result",
            }
        )
        return result

    result.update(
        {
            "closeout_completed": True,
            "closeout_result": outcome,
            "message": _completed_message(outcome),
            "next_action": "",
            "ok": True,
            "stage": "closeout",
            "status": "completed",
        }
    )
    return result


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0 if str(result.get("status", "")).strip() == "completed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
