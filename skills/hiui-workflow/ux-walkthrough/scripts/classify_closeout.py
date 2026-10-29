#!/usr/bin/env python3
"""
UX Walkthrough - 统一收口判定脚本

用途：
- 在 detect / evidence gate / 正式交付之后，统一判断本次任务当前属于 success / failed / canceled / needs_input 哪一种状态
- 避免外层 agent 继续用自然语言自行判断何时进入最终收口
- 对固定失败出口、docx 失败、完整交付成功、用户中途取消四类场景给出统一收口建议

用法：
- python3 classify_closeout.py --source code --report-generated true --docx-generated true --docx-name demo.docx --docx-path /tmp/demo.docx --json
- python3 classify_closeout.py --detect-json /tmp/detect.json --json
- python3 classify_closeout.py --gate-json /tmp/gate.json --json
- python3 classify_closeout.py --source url --user-canceled true --precheck-started true --json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


VALID_SOURCES = {"code", "url", "screenshot"}
SOURCE_LABELS = {
    "code": "代码走查",
    "url": "URL 走查",
    "screenshot": "截图走查",
}


def _parse_bool(raw: str) -> bool:
    value = raw.strip().lower()
    if value in {"1", "true", "yes", "y"}:
        return True
    if value in {"0", "false", "no", "n"}:
        return False
    raise argparse.ArgumentTypeError(f"无法识别布尔值: {raw}")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="统一判断 ux-walkthrough 当前是否该进入最终收口")
    parser.add_argument("--source", default="", choices=["", "code", "url", "screenshot"])
    parser.add_argument("--project", default="")
    parser.add_argument("--detect-json", default="")
    parser.add_argument("--gate-json", default="")
    parser.add_argument("--precheck-started", type=_parse_bool, default=False)
    parser.add_argument("--report-json", default="")
    parser.add_argument("--formal-walkthrough-started", type=_parse_bool, default=False)
    parser.add_argument("--user-canceled", type=_parse_bool, default=False)
    parser.add_argument("--report-generated", type=_parse_bool, default=False)
    parser.add_argument("--docx-generated", type=_parse_bool, default=False)
    parser.add_argument("--docx-name", default="")
    parser.add_argument("--docx-path", default="")
    parser.add_argument("--docx-failed", type=_parse_bool, default=False)
    parser.add_argument("--failure-detail", default="")
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


def _project_display_name(project: str) -> str:
    value = project.strip()
    return f"项目“{value}”的" if value else "本次"


def _resolve_source(explicit: str, detect_result: dict, gate_result: dict) -> str:
    candidates = [
        explicit.strip(),
        str(gate_result.get("source", "")).strip(),
        str(detect_result.get("source", "")).strip(),
        str(detect_result.get("mode", "")).strip(),
        str(gate_result.get("mode", "")).strip(),
    ]

    for result in (gate_result, detect_result):
        closeout_args = result.get("closeout_action", {}).get("args", {})
        finalize_args = result.get("finalize_usage", {}).get("args", {})
        if isinstance(closeout_args, dict):
            candidates.append(str(closeout_args.get("source", "")).strip())
        if isinstance(finalize_args, dict):
            candidates.append(str(finalize_args.get("source", "")).strip())

    for candidate in candidates:
        if candidate in VALID_SOURCES:
            return candidate
    return ""


def _merge_finalize_args(
    base_args: dict | None,
    *,
    source: str = "",
    project: str = "",
    docx_generated: bool | None = None,
    docx_name: str = "",
    failure_detail: str = "",
) -> dict:
    args: dict = {}
    if isinstance(base_args, dict):
        args.update(base_args)

    if source and not str(args.get("source", "")).strip():
        args["source"] = source
    if project and not str(args.get("project", "")).strip():
        args["project"] = project
    if docx_generated is not None:
        args["docx_generated"] = bool(docx_generated)
    if docx_name.strip():
        args["docx_name"] = docx_name.strip()
    if failure_detail.strip():
        args["failure_detail"] = failure_detail.strip()[:200]
    return args


def _failed_from_script_result(source: str, project: str, script_result: dict, failure_detail: str) -> dict:
    finalize_block = script_result.get("finalize_usage", {})
    args = _merge_finalize_args(
        finalize_block.get("args", {}),
        source=source,
        project=project,
        failure_detail=failure_detail,
    )
    resolved_source = str(args.get("source", "")).strip() or source

    return {
        "closeout_ready": True,
        "closeout_reason": "fixed_failure_exit",
        "failure_detail": str(args.get("failure_detail", "")).strip(),
        "failure_preset": str(args.get("failure_preset", script_result.get("failure_preset", ""))).strip(),
        "failure_reason": str(script_result.get("failure_reason", "")).strip(),
        "failure_stage": str(script_result.get("failure_stage", "")).strip(),
        "closeout_action": {
            "args": args,
            "recommended": True,
        },
        "finalize_usage": {
            "args": args,
            "recommended": True,
        },
        "message": str(script_result.get("message", "")).strip() or "当前已命中固定失败出口，建议直接执行失败收口。",
        "next_action": "complete_closeout",
        "ok": True,
        "should_closeout": True,
        "should_continue": False,
        "should_finalize_usage": True,
        "source": resolved_source,
        "status": "failed",
    }


def _success_result(source: str, project: str, docx_name: str) -> dict:
    args = _merge_finalize_args(
        {"source": source, "status": "success"},
        project=project,
        docx_generated=True,
        docx_name=docx_name,
    )
    return {
        "closeout_ready": True,
        "closeout_reason": "completed_delivery",
        "closeout_action": {
            "args": args,
            "recommended": True,
        },
        "finalize_usage": {
            "args": args,
            "recommended": True,
        },
        "message": "完整报告与本地 docx 都已产出，可以进入成功收口。",
        "next_action": "complete_closeout",
        "ok": True,
        "should_closeout": True,
        "should_continue": False,
        "should_finalize_usage": True,
        "source": source,
        "status": "success",
    }


def _canceled_result(source: str, project: str) -> dict:
    args = _merge_finalize_args(
        {"source": source, "status": "canceled"},
        project=project,
        docx_generated=False,
    )
    return {
        "closeout_ready": True,
        "closeout_reason": "user_canceled_after_start",
        "closeout_action": {
            "args": args,
            "recommended": True,
        },
        "finalize_usage": {
            "args": args,
            "recommended": True,
        },
        "message": "本次任务已命中 skill 且开始前置检查后被用户明确取消，建议执行 canceled 收口。",
        "next_action": "complete_closeout",
        "ok": True,
        "should_closeout": True,
        "should_continue": False,
        "should_finalize_usage": True,
        "source": source,
        "status": "canceled",
    }


def _docx_failed_result(source: str, project: str, docx_name: str, failure_detail: str, report_generated: bool) -> dict:
    project_text = _project_display_name(project)
    source_text = SOURCE_LABELS.get(source, "体验走查")
    file_text = f"（目标文件：{docx_name.strip()}）" if docx_name.strip() else ""
    fallback_detail = (
        f"{project_text}{source_text}已完成报告正文，但本地 docx 生成失败{file_text}，未能完成最终交付。"
        if report_generated
        else f"{project_text}{source_text}在生成本地 docx 时失败{file_text}，未能完成最终交付。"
    )
    resolved_detail = failure_detail.strip() or fallback_detail
    args = _merge_finalize_args(
        {
            "source": source,
            "status": "failed",
            "failure_preset": "docx_generation_failed",
        },
        project=project,
        docx_generated=False,
        docx_name=docx_name,
        failure_detail=resolved_detail,
    )
    return {
        "closeout_ready": True,
        "closeout_reason": "docx_generation_failed",
        "failure_detail": resolved_detail[:200],
        "failure_preset": "docx_generation_failed",
        "failure_reason": "docx_failed",
        "failure_stage": "docx_generation",
        "closeout_action": {
            "args": args,
            "recommended": True,
        },
        "finalize_usage": {
            "args": args,
            "recommended": True,
        },
        "message": "完整交付未完成：本地 docx 生成失败，建议直接执行失败收口。",
        "next_action": "complete_closeout",
        "ok": True,
        "should_closeout": True,
        "should_continue": False,
        "should_finalize_usage": True,
        "source": source,
        "status": "failed",
    }


def _needs_input_result(
    *,
    source: str,
    message: str,
    should_continue: bool,
    needs_user_input: bool,
    pending_requirements: list[str] | None = None,
    closeout_reason: str,
) -> dict:
    return {
        "closeout_ready": False,
        "closeout_reason": closeout_reason,
        "message": message,
        "needs_user_input": needs_user_input,
        "next_action": "wait_for_more_input" if needs_user_input else "continue_walkthrough",
        "ok": not needs_user_input,
        "pending_requirements": pending_requirements or [],
        "should_closeout": False,
        "should_continue": should_continue,
        "should_finalize_usage": False,
        "source": source,
        "status": "needs_input",
    }


def _validate_delivery_report(report_path: Path) -> tuple[bool, str, str, list[str]]:
    try:
        report = json.loads(report_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        return False, "report_json_unreadable", "读取 report.json 失败", [str(exc)]

    gates = [
        (
            "core_flow_gate_incomplete",
            "核心流程执行门禁未通过",
            "validate_core_flows",
            "complete_core_flows",
        ),
        (
            "style_review_incomplete",
            "样式走查门禁未通过",
            "validate_style_review",
            "complete_style_review",
        ),
        (
            "checklist_coverage_incomplete",
            "checklist 覆盖门禁未通过",
            "validate_checklist_coverage",
            "complete_checklist_coverage",
        ),
        (
            "annotations_missing",
            "标注门禁未通过",
            "validate_report_annotations",
            "complete_issue_annotations",
        ),
    ]

    for reason, label, module_name, requirement in gates:
        try:
            module = __import__(module_name, fromlist=["validate_report"])
            gate_result = module.validate_report(report)
        except Exception as exc:  # pragma: no cover - defensive import/runtime guard
            return False, reason, f"{label}：校验器执行失败", [str(exc)]
        if not gate_result.get("ok"):
            errors = gate_result.get("errors", [])
            if not isinstance(errors, list):
                errors = [str(errors)]
            return False, reason, label, [requirement, *[str(error) for error in errors]]

    return True, "", "", []


def _validate_docx_artifact(raw_path: str) -> tuple[bool, str]:
    value = raw_path.strip()
    if not value:
        return False, "成功收口必须提供 --docx-path，不能只依赖 docx_name 文本"

    path = Path(value).expanduser()
    if path.suffix.lower() != ".docx":
        return False, f"docx_path 必须指向 .docx 文件：{path}"
    try:
        resolved = path.resolve()
        if not resolved.is_file():
            return False, f"docx_path 文件不存在：{resolved}"
        if resolved.stat().st_size <= 0:
            return False, f"docx_path 文件为空：{resolved}"
    except OSError as exc:
        return False, f"无法读取 docx_path：{exc}"
    return True, ""


def _missing_precheck_result(*, source: str, closeout_reason: str) -> dict:
    return _needs_input_result(
        source=source,
        message="当前缺少阶段 A 已开始的证据，暂不能直接进入最终收口；请补充 precheck 结果后再继续。",
        should_continue=False,
        needs_user_input=False,
        pending_requirements=["provide_precheck_result"],
        closeout_reason=closeout_reason,
    )


def _is_failed_script_result(result: dict) -> bool:
    return (
        isinstance(result, dict)
        and str(result.get("status", "")).strip() == "failed"
        and bool(result.get("should_finalize_usage"))
    )


def _is_waiting_script_result(result: dict) -> bool:
    return isinstance(result, dict) and str(result.get("status", "")).strip() in {"needs_input", "needs_clarification"}


def _is_continue_script_result(result: dict) -> bool:
    return isinstance(result, dict) and str(result.get("status", "")).strip() == "continue"


def build_result(args: argparse.Namespace) -> dict:
    detect_result = _load_json_source(args.detect_json)
    gate_result = _load_json_source(args.gate_json)
    source = _resolve_source(args.source, detect_result, gate_result)
    failure_detail = args.failure_detail.strip()

    precheck_started = args.precheck_started or bool(detect_result) or bool(gate_result)
    formal_started = args.formal_walkthrough_started

    if args.user_canceled and (precheck_started or formal_started):
        if not source:
            return _needs_input_result(
                source="",
                message="用户已明确取消，但当前还无法稳定判断 source，暂不执行 canceled 收口，请先补充本次输入模式。",
                should_continue=False,
                needs_user_input=False,
                pending_requirements=["resolve_source"],
                closeout_reason="missing_source_for_canceled_closeout",
            )
        return _canceled_result(source, args.project.strip())

    if args.report_generated and args.docx_generated:
        report_path = Path(args.report_json).expanduser() if args.report_json.strip() else None
        if report_path is None:
            return _needs_input_result(
                source=source,
                message="成功收口缺少 report.json，无法校验交付门禁是否全部通过。",
                should_continue=True,
                needs_user_input=False,
                pending_requirements=["provide_report_json", "validate_delivery_gates"],
                closeout_reason="missing_report_for_delivery_gates",
            )
        delivery_ok, delivery_reason, delivery_label, delivery_errors = _validate_delivery_report(report_path)
        if not delivery_ok:
            requirement = delivery_errors[0] if delivery_errors else "validate_delivery_gates"
            errors = delivery_errors[1:] if len(delivery_errors) > 1 else delivery_errors
            detail = "；".join(errors[:5])
            if len(errors) > 5:
                detail += f"；等共 {len(errors)} 项"
            return _needs_input_result(
                source=source,
                message=f"{delivery_label}：{detail or '请补齐交付门禁证据'}",
                should_continue=True,
                needs_user_input=False,
                pending_requirements=[requirement, "regenerate_docx"],
                closeout_reason=delivery_reason,
            )

    if _is_failed_script_result(gate_result):
        return _failed_from_script_result(source, args.project.strip(), gate_result, failure_detail)

    if _is_failed_script_result(detect_result):
        return _failed_from_script_result(source, args.project.strip(), detect_result, failure_detail)

    if args.report_generated and args.docx_generated:
        if not precheck_started:
            return _missing_precheck_result(
                source=source,
                closeout_reason="missing_precheck_for_success_closeout",
            )
        if not source:
            return _needs_input_result(
                source="",
                message="完整报告与 docx 已产出，但当前还无法稳定判断 source，请先补充本次是 code、url 还是 screenshot。",
                should_continue=False,
                needs_user_input=False,
                pending_requirements=["resolve_source"],
                closeout_reason="missing_source_for_success_closeout",
            )
        docx_ok, docx_error = _validate_docx_artifact(args.docx_path)
        if not docx_ok:
            return _needs_input_result(
                source=source,
                message=f"完整报告门禁已通过，但本地 docx 产物未验证通过：{docx_error}",
                should_continue=True,
                needs_user_input=False,
                pending_requirements=["provide_docx_path", "regenerate_docx"],
                closeout_reason="docx_artifact_unverified",
            )
        return _success_result(source, args.project.strip(), args.docx_name)

    if args.docx_failed:
        if not precheck_started:
            return _missing_precheck_result(
                source=source,
                closeout_reason="missing_precheck_for_docx_failure",
            )
        if not source:
            return _needs_input_result(
                source="",
                message="已经确认 docx 生成失败，但当前还无法稳定判断 source，请先补充本次是 code、url 还是 screenshot。",
                should_continue=False,
                needs_user_input=False,
                pending_requirements=["resolve_source"],
                closeout_reason="missing_source_for_docx_failure",
            )
        return _docx_failed_result(source, args.project.strip(), args.docx_name, failure_detail, args.report_generated)

    if _is_waiting_script_result(gate_result):
        return _needs_input_result(
            source=source,
            message=str(gate_result.get("message", "")).strip() or "当前证据还不够，暂时不能进入最终收口。",
            should_continue=False,
            needs_user_input=True,
            pending_requirements=["collect_more_evidence"],
            closeout_reason="waiting_for_evidence",
        )

    if _is_waiting_script_result(detect_result):
        return _needs_input_result(
            source=source,
            message=str(detect_result.get("message", "")).strip() or "当前输入仍不够明确，暂时不能进入最终收口。",
            should_continue=False,
            needs_user_input=True,
            pending_requirements=["clarify_input_mode"],
            closeout_reason="waiting_for_clear_input",
        )

    if args.report_generated and not args.docx_generated:
        return _needs_input_result(
            source=source,
            message="完整报告已输出，但本地 docx 还未生成成功，当前不能进入最终收口。",
            should_continue=True,
            needs_user_input=False,
            pending_requirements=["generate_docx"],
            closeout_reason="waiting_for_docx_generation",
        )

    if _is_continue_script_result(gate_result):
        return _needs_input_result(
            source=source,
            message="证据门禁已通过，但完整报告与 docx 还未全部产出，请继续正式走查后再收口。",
            should_continue=True,
            needs_user_input=False,
            pending_requirements=["judge_issues", "output_report", "generate_docx"],
            closeout_reason="continue_after_evidence_gate",
        )

    if _is_continue_script_result(detect_result):
        return _needs_input_result(
            source=source,
            message="输入模式已判定，但证据门禁还未完成，请继续前置检查后再收口。",
            should_continue=True,
            needs_user_input=False,
            pending_requirements=["run_evidence_gate"],
            closeout_reason="continue_after_mode_detection",
        )

    if formal_started:
        return _needs_input_result(
            source=source,
            message="正式走查已经开始，但完整报告与 docx 还未全部产出，暂时不能进入最终收口。",
            should_continue=True,
            needs_user_input=False,
            pending_requirements=["output_report", "generate_docx"],
            closeout_reason="formal_walkthrough_in_progress",
        )

    if precheck_started:
        return _needs_input_result(
            source=source,
            message="前置检查已经开始，但当前仍未达到可收口状态，请继续推进主流程。",
            should_continue=True,
            needs_user_input=False,
            pending_requirements=["continue_precheck"],
            closeout_reason="precheck_in_progress",
        )

    return _needs_input_result(
        source=source,
        message="当前还没有进入正式可收口阶段，请先完成输入识别与证据门禁。",
        should_continue=False,
        needs_user_input=False,
        pending_requirements=["start_precheck"],
        closeout_reason="closeout_not_started",
    )


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0 if result.get("closeout_ready") is True else 1


if __name__ == "__main__":
    raise SystemExit(main())
