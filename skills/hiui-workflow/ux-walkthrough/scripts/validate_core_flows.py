#!/usr/bin/env python3
"""Validate that a walkthrough report records executed core flows."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ALLOWED_EXECUTION_STATUSES = {
    "completed",
    "stopped_before_submit",
    "blocked_high_risk",
}
ALLOWED_BUSINESS_SOURCES = {"prd", "inferred", "mixed", "unknown"}
ALLOWED_SIDE_EFFECT_LEVELS = {"none", "low", "recoverable", "high", "unknown"}
NON_COMPLETED_ALLOWED_SIDE_EFFECT_LEVELS = {"high", "unknown"}
MIN_NOTE_LENGTH = 8
ACTION_FLOW_TYPES = {
    "header_actions": "页头主动作",
    "row_actions": "行内动作",
}


def _text(value: Any) -> str:
    return str(value or "").strip()


def _load_report(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"未找到 report.json：{path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"report.json 不是合法 JSON：{exc}") from exc

    if not isinstance(value, dict):
        raise ValueError("report.json 根节点必须是对象")
    return value


def _require_text(mapping: dict, key: str, label: str, errors: list[str]) -> str:
    value = _text(mapping.get(key))
    if len(value) < MIN_NOTE_LENGTH:
        errors.append(f"{label}.{key} 必须至少填写 {MIN_NOTE_LENGTH} 个字符")
    return value


def _validate_business_context(report: dict, errors: list[str]) -> None:
    context = report.get("business_context")
    if not isinstance(context, dict):
        errors.append("缺少 business_context；正式报告必须先记录业务理解")
        return

    source = _text(context.get("source"))
    if source not in ALLOWED_BUSINESS_SOURCES:
        allowed = ", ".join(sorted(ALLOWED_BUSINESS_SOURCES))
        errors.append(f"business_context.source 必须是 {allowed} 之一")

    _require_text(context, "product_goal", "business_context", errors)
    primary_users = context.get("primary_users")
    if not isinstance(primary_users, list) or not primary_users:
        errors.append("business_context.primary_users 必须至少包含一类主要用户")
    core_tasks = context.get("core_tasks")
    if not isinstance(core_tasks, list) or not core_tasks:
        errors.append("business_context.core_tasks 必须至少包含一项核心任务")
    if "assumptions" not in context:
        errors.append("business_context.assumptions 必须填写；无假设时使用空数组")
    if "missing_information" not in context:
        errors.append("business_context.missing_information 必须填写；无缺失信息时使用空数组")


def _validate_execution(flow: dict, index: int, errors: list[str]) -> None:
    prefix = f"core_flows[{index}]"
    execution = flow.get("execution")
    if not isinstance(execution, dict):
        errors.append(f"{prefix}.execution 缺失；必须记录实际执行状态")
        return

    execution_status = _text(execution.get("status"))
    if execution_status not in ALLOWED_EXECUTION_STATUSES:
        allowed = ", ".join(sorted(ALLOWED_EXECUTION_STATUSES))
        errors.append(f"{prefix}.execution.status 必须是 {allowed} 之一")
        return

    evidence = execution.get("evidence")
    if not isinstance(evidence, list) or not evidence:
        errors.append(f"{prefix}.execution.evidence 必须至少包含一条实际证据")
    else:
        for evidence_index, item in enumerate(evidence):
            if not isinstance(item, dict):
                errors.append(f"{prefix}.execution.evidence[{evidence_index}] 必须是对象")
                continue
            _require_text(item, "type", f"{prefix}.execution.evidence[{evidence_index}]", errors)
            _require_text(item, "note", f"{prefix}.execution.evidence[{evidence_index}]", errors)

    if execution_status == "completed":
        executed_steps = execution.get("executed_steps")
        steps = flow.get("steps")
        if not isinstance(executed_steps, list) or not isinstance(steps, list):
            errors.append(f"{prefix} 完成流程必须同时记录 steps 和 executed_steps")
        else:
            if len(executed_steps) != len(steps):
                errors.append(f"{prefix}.execution.executed_steps 必须与 steps 数量一致")
            for step_index, step in enumerate(executed_steps):
                if not isinstance(step, dict):
                    errors.append(f"{prefix}.execution.executed_steps[{step_index}] 必须是对象")
                    continue
                step_text = _require_text(step, "step", f"{prefix}.execution.executed_steps[{step_index}]", errors)
                expected_text = _text(steps[step_index]) if step_index < len(steps) else ""
                if step_text and expected_text and step_text != expected_text:
                    errors.append(
                        f"{prefix}.execution.executed_steps[{step_index}].step 必须与 steps[{step_index}] 完全一致"
                    )
                _require_text(step, "result", f"{prefix}.execution.executed_steps[{step_index}]", errors)
        _require_text(execution, "verification", f"{prefix}.execution", errors)
    else:
        _require_text(execution, "stopped_at", f"{prefix}.execution", errors)
        _require_text(execution, "stop_reason", f"{prefix}.execution", errors)
        side_effect_level = _text(execution.get("side_effect_level")).lower()
        if side_effect_level not in ALLOWED_SIDE_EFFECT_LEVELS:
            allowed = ", ".join(sorted(ALLOWED_SIDE_EFFECT_LEVELS))
            errors.append(f"{prefix}.execution.side_effect_level 必须是 {allowed} 之一")
        elif side_effect_level not in NON_COMPLETED_ALLOWED_SIDE_EFFECT_LEVELS:
            errors.append(
                f"{prefix}.execution.side_effect_level={side_effect_level} 不允许停在提交前；"
                "无副作用、低风险或可回收动作必须完成提交与结果验证"
            )
        if execution_status == "blocked_high_risk" and execution.get("user_confirmation_required") is not True:
            errors.append(f"{prefix}.execution.user_confirmation_required 必须为 true")


def _has_actions(value: Any) -> bool:
    if isinstance(value, list):
        return len(value) > 0
    if isinstance(value, dict):
        return bool(value)
    return False


def _validate_action_inventory(report: dict, flows: list[Any], errors: list[str]) -> None:
    inventory = report.get("action_inventory")
    if inventory is None:
        errors.append("action_inventory 必须填写；无页头或行内动作时使用空数组")
        return
    if not isinstance(inventory, dict):
        errors.append("action_inventory 必须是对象")
        return

    covered_types = {
        _text(flow.get("type"))
        for flow in flows
        if isinstance(flow, dict) and _text(flow.get("type"))
    }
    for field, required_type in ACTION_FLOW_TYPES.items():
        if _has_actions(inventory.get(field)) and required_type not in covered_types:
            errors.append(
                f"action_inventory.{field} 存在动作时，core_flows 必须包含 type={required_type} 的执行流程"
            )


def validate_report(report: dict) -> dict:
    errors: list[str] = []
    _validate_business_context(report, errors)

    flows = report.get("core_flows")
    if not isinstance(flows, list) or not flows:
        errors.append("core_flows 必须至少包含一条核心流程")
        flows = []
    elif len(flows) > 3:
        errors.append("core_flows 最多允许三条核心流程")

    for index, flow in enumerate(flows):
        if not isinstance(flow, dict):
            errors.append(f"core_flows[{index}] 必须是对象")
            continue
        _require_text(flow, "name", f"core_flows[{index}]", errors)
        _require_text(flow, "goal", f"core_flows[{index}]", errors)
        steps = flow.get("steps")
        if not isinstance(steps, list) or not steps:
            errors.append(f"core_flows[{index}].steps 必须至少包含一个步骤")
        _validate_execution(flow, index, errors)

    _validate_action_inventory(report, flows, errors)

    return {
        "core_flow_count": len(flows),
        "errors": errors,
        "ok": not errors,
        "required": True,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="校验 UX 走查报告的核心流程执行门禁")
    parser.add_argument("--report-json", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    try:
        report = _load_report(Path(args.report_json).expanduser().resolve())
        result = validate_report(report)
    except ValueError as exc:
        result = {"core_flow_count": 0, "errors": [str(exc)], "ok": False, "required": True}

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("OK: core-flow gate passed" if result["ok"] else "ERROR: core-flow gate failed")
        for error in result["errors"]:
            print(f"- {error}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
