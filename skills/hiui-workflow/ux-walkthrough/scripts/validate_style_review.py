#!/usr/bin/env python3
"""Validate that style walkthrough follows the stable executable flow."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


REQUIRED_SOURCES = {"url", "screenshot"}
ALLOWED_STATUSES = {"pass", "issue", "pending", "n/a"}
ALLOWED_TRIGGERS = {
    "source_default",
    "user_requested",
    "code_style_evidence",
    "main_flow_visual_risk",
    "user_marked_area",
}
DETAIL_REQUIRED_TRIGGERS = {"user_requested", "main_flow_visual_risk", "user_marked_area"}
ALLOWED_DETAIL_REASONS = {
    "structure_issue",
    "user_requested",
    "main_flow_visual_risk",
    "user_marked_area",
    "manual_detail_check",
}
MIN_NOTE_LENGTH = 8
STRUCTURE_SCAN_ITEMS = [
    "页头到首屏内容有没有接住",
    "主白底外边距稳不稳",
    "多列有没有收口",
    "有没有大块无效空白",
]
STYLE_DIMENSIONS = [
    "信息层级",
    "间距与对齐",
    "文字可读性",
    "色彩语义",
    "组件状态一致性",
    "密度与版面稳定性",
]
HIUI_REQUIRED_SECTIONS = [
    "全局视觉基线",
    "跨页面共享结构",
    "页型规范",
    "组件语义",
]
REQUIRED_INVENTORY_TYPES = [
    "page_header_actions",
    "table_row_actions",
    "danger_actions",
    "form_actions",
    "modal_or_drawer_actions",
    "data_visualization",
]
HIUI_COMPONENT_CHECKS = [
    {
        "id": "HIUI-ACTION-PRIMARY-RIGHTMOST",
        "name": "页头主按钮位于动作组最右端",
        "inventory_type": "page_header_actions",
    },
    {
        "id": "HIUI-ACTION-GROUP-RIGHT-ALIGNED",
        "name": "页头动作组靠右对齐",
        "inventory_type": "page_header_actions",
    },
    {
        "id": "HIUI-TABLE-ROW-ACTION-LINK-BLUE",
        "name": "表格行内操作使用蓝色 link 文本",
        "inventory_type": "table_row_actions",
    },
    {
        "id": "HIUI-TABLE-ROW-ACTION-FIXED-RIGHT",
        "name": "表格操作列固定在右侧",
        "inventory_type": "table_row_actions",
    },
    {
        "id": "HIUI-DANGER-ACTION-CONFIRM",
        "name": "危险操作具备二次确认或撤销路径",
        "inventory_type": "danger_actions",
    },
    {
        "id": "HIUI-FORM-FOOTER-ACTIONS",
        "name": "表单底部操作主次清晰并靠右",
        "inventory_type": "form_actions",
    },
    {
        "id": "HIUI-MODAL-DRAWER-ACTION-SEMANTICS",
        "name": "弹窗抽屉操作区符合主次与风险语义",
        "inventory_type": "modal_or_drawer_actions",
    },
    {
        "id": "HIUI-DATA-VIS-THEME-SEMANTICS",
        "name": "统计图表使用 HiUI 主题与状态语义",
        "inventory_type": "data_visualization",
    },
]


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


def _style_issue_refs(report: dict) -> tuple[set[str], set[str]]:
    titles: set[str] = set()
    indexes: set[str] = set()
    issues = report.get("issues", [])
    if not isinstance(issues, list):
        return titles, indexes
    for issue in issues:
        if not isinstance(issue, dict) or _text(issue.get("category")) != "样式问题":
            continue
        title = _text(issue.get("title"))
        if title:
            titles.add(title)
        index = _text(issue.get("index"))
        if index:
            indexes.add(index)
    return titles, indexes


def _normalize_items(raw: Any, *, field: str, errors: list[str]) -> dict[str, dict]:
    items: dict[str, dict] = {}
    if isinstance(raw, list):
        iterable = raw
    elif isinstance(raw, dict):
        iterable = []
        for name, value in raw.items():
            if isinstance(value, dict):
                item = dict(value)
                item.setdefault("name", name)
            else:
                item = {"name": name, "status": value}
            iterable.append(item)
    else:
        errors.append(f"style_review.{field} 必须是数组或对象")
        return items

    for index, item in enumerate(iterable):
        if not isinstance(item, dict):
            errors.append(f"style_review.{field}[{index}] 必须是对象")
            continue
        name = _text(item.get("name")) or _text(item.get("dimension"))
        if not name:
            errors.append(f"style_review.{field}[{index}].name 必填")
            continue
        items[name] = item
    return items


def _normalize_inventory(raw: Any, *, errors: list[str]) -> dict[str, dict]:
    items: dict[str, dict] = {}
    if not isinstance(raw, dict):
        errors.append("element_inventory 必须是对象；样式走查必须先盘点页面元素")
        return items

    source = _text(raw.get("source"))
    evidence = _text(raw.get("evidence") or raw.get("evidence_note"))
    if len(source) < 2:
        errors.append("element_inventory.source 必填，用于说明元素盘点依据")
    if len(evidence) < MIN_NOTE_LENGTH:
        errors.append(f"element_inventory.evidence 必须至少填写 {MIN_NOTE_LENGTH} 个字符")

    raw_items = raw.get("items")
    if isinstance(raw_items, list):
        iterable = raw_items
    elif isinstance(raw_items, dict):
        iterable = []
        for name, value in raw_items.items():
            item = dict(value) if isinstance(value, dict) else {"present": value}
            item.setdefault("type", name)
            iterable.append(item)
    else:
        errors.append("element_inventory.items 必须是数组或对象")
        return items

    for index, item in enumerate(iterable):
        if not isinstance(item, dict):
            errors.append(f"element_inventory.items[{index}] 必须是对象")
            continue
        item_type = _text(item.get("type") or item.get("name"))
        if not item_type:
            errors.append(f"element_inventory.items[{index}].type 必填")
            continue
        if "present" not in item or not isinstance(item.get("present"), bool):
            errors.append(f"element_inventory.items.{item_type}.present 必须是布尔值")
        _require_note(item, path=f"element_inventory.items.{item_type}", errors=errors)
        items[item_type] = item

    for required_type in REQUIRED_INVENTORY_TYPES:
        if required_type not in items:
            errors.append(f"element_inventory.items 缺少 {required_type}；必须显式 present=true/false")
    return items


def _require_note(item: dict, *, path: str, errors: list[str]) -> None:
    note = _text(item.get("note") or item.get("summary"))
    evidence = _text(item.get("evidence") or item.get("evidence_note"))
    if len(note) < MIN_NOTE_LENGTH:
        errors.append(f"{path}.note 必须至少填写 {MIN_NOTE_LENGTH} 个字符")
    if len(evidence) < MIN_NOTE_LENGTH:
        errors.append(f"{path}.evidence 必须至少填写 {MIN_NOTE_LENGTH} 个字符")


def _require_status(item: dict, *, path: str, errors: list[str]) -> str:
    status = _text(item.get("status")).lower()
    if status not in ALLOWED_STATUSES:
        errors.append(f"{path}.status 必须是 pass / issue / pending / n/a 之一")
    return status


def _require_style_issue_link(
    item: dict,
    *,
    path: str,
    style_issue_titles: set[str],
    style_issue_indexes: set[str],
    errors: list[str],
) -> None:
    if _text(item.get("status")).lower() != "issue":
        return
    linked_index = _text(item.get("linked_issue_index"))
    linked_title = _text(item.get("linked_issue_title"))
    if not linked_index and not linked_title:
        errors.append(f"{path} 已标 issue，必须填写 linked_issue_index 或 linked_issue_title 并指向正式样式 issue")
        return
    if linked_index and linked_index not in style_issue_indexes:
        errors.append(f"{path}.linked_issue_index={linked_index} 未指向 category=样式问题 的正式 issue")
    if linked_title and linked_title not in style_issue_titles:
        errors.append(f"{path}.linked_issue_title 未指向 category=样式问题 的正式 issue")


def _normalize_component_checks(raw: Any, *, errors: list[str]) -> dict[str, dict]:
    checks: dict[str, dict] = {}
    if raw is None:
        errors.append("framework=hiui-design 时，必须填写 style_review.hiui_component_checks")
        return checks
    if isinstance(raw, list):
        iterable = raw
    elif isinstance(raw, dict):
        iterable = []
        for check_id, value in raw.items():
            item = dict(value) if isinstance(value, dict) else {"status": value}
            item.setdefault("id", check_id)
            iterable.append(item)
    else:
        errors.append("style_review.hiui_component_checks 必须是数组或对象")
        return checks

    for index, item in enumerate(iterable):
        if not isinstance(item, dict):
            errors.append(f"style_review.hiui_component_checks[{index}] 必须是对象")
            continue
        check_id = _text(item.get("id") or item.get("name"))
        if not check_id:
            errors.append(f"style_review.hiui_component_checks[{index}].id 必填")
            continue
        checks[check_id] = item
    return checks


def _style_review_required(report: dict, source: str) -> bool:
    options = report.get("walkthrough_options", {})
    explicit_required = isinstance(options, dict) and options.get("style_review_required") is True
    return source in REQUIRED_SOURCES or explicit_required


def _validate_trigger(style_review: dict, source: str, errors: list[str]) -> str:
    trigger = _text(style_review.get("trigger"))
    if not trigger:
        errors.append("style_review.trigger 必填，用于声明样式走查触发原因")
        return ""
    if trigger not in ALLOWED_TRIGGERS:
        allowed = " / ".join(sorted(ALLOWED_TRIGGERS))
        errors.append(f"style_review.trigger 必须是 {allowed} 之一")
    if source in REQUIRED_SOURCES and trigger == "code_style_evidence":
        errors.append("url / screenshot 模式的默认样式走查 trigger 不能填 code_style_evidence")
    return trigger


def _validate_detail_reason(style_review: dict, errors: list[str], *, required: bool) -> None:
    reason = _text(style_review.get("detail_check_reason"))
    if not required:
        return
    if not reason:
        errors.append("需要六维样式详查时，style_review.detail_check_reason 必填")
        return
    if reason not in ALLOWED_DETAIL_REASONS:
        allowed = " / ".join(sorted(ALLOWED_DETAIL_REASONS))
        errors.append(f"style_review.detail_check_reason 必须是 {allowed} 之一")


def _validate_structure_scan(style_review: dict, report: dict, errors: list[str]) -> bool:
    raw = style_review.get("structure_scan")
    if raw is None:
        errors.append("缺少 style_review.structure_scan；样式走查必须先完成结构四问快扫")
        return False

    items = _normalize_items(raw, field="structure_scan", errors=errors)
    style_issue_titles, style_issue_indexes = _style_issue_refs(report)
    has_issue = False
    for name in STRUCTURE_SCAN_ITEMS:
        item = items.get(name)
        if not isinstance(item, dict):
            errors.append(f"style_review.structure_scan 缺少「{name}」")
            continue
        path = f"style_review.structure_scan.{name}"
        status = _require_status(item, path=path, errors=errors)
        _require_note(item, path=path, errors=errors)
        if status == "issue":
            has_issue = True
            _require_style_issue_link(
                item,
                path=path,
                style_issue_titles=style_issue_titles,
                style_issue_indexes=style_issue_indexes,
                errors=errors,
            )
    return has_issue


def _validate_dimensions(style_review: dict, report: dict, errors: list[str], *, required: bool) -> bool:
    raw = style_review.get("dimensions")
    if raw is None:
        if required:
            errors.append("结构快扫命中 issue 后，style_review.dimensions 必须填写六个观察维度")
        return False

    items = _normalize_items(raw, field="dimensions", errors=errors)
    style_issue_titles, style_issue_indexes = _style_issue_refs(report)
    has_issue = False
    required_names = STYLE_DIMENSIONS if required else list(items)
    for name in required_names:
        item = items.get(name)
        if not isinstance(item, dict):
            errors.append(f"style_review.dimensions 缺少「{name}」")
            continue
        path = f"style_review.dimensions.{name}"
        status = _require_status(item, path=path, errors=errors)
        _require_note(item, path=path, errors=errors)
        if status == "issue":
            has_issue = True
            _require_style_issue_link(
                item,
                path=path,
                style_issue_titles=style_issue_titles,
                style_issue_indexes=style_issue_indexes,
                errors=errors,
            )
    return has_issue


def _validate_hiui_sections(style_review: dict, report: dict, errors: list[str], *, required: bool) -> None:
    raw = style_review.get("hiui_sections")
    if raw is None:
        if required:
            errors.append("framework=hiui-design 时，必须填写 style_review.hiui_sections")
        return

    items = _normalize_items(raw, field="hiui_sections", errors=errors)
    style_issue_titles, style_issue_indexes = _style_issue_refs(report)
    required_names = list(HIUI_REQUIRED_SECTIONS)
    if style_review.get("has_data_visualization") is True:
        required_names.append("数据可视化专项")
    elif not required:
        required_names = list(items)

    for name in required_names:
        item = items.get(name)
        if not isinstance(item, dict):
            errors.append(f"style_review.hiui_sections 缺少「{name}」")
            continue
        path = f"style_review.hiui_sections.{name}"
        _require_status(item, path=path, errors=errors)
        _require_note(item, path=path, errors=errors)
        severity = _text(item.get("severity")).upper()
        if severity and severity not in {"P0", "P1", "P2", "P3"}:
            errors.append(f"{path}.severity 必须是 P0 / P1 / P2 / P3")
        _require_style_issue_link(
            item,
            path=path,
            style_issue_titles=style_issue_titles,
            style_issue_indexes=style_issue_indexes,
            errors=errors,
        )


def _validate_hiui_component_checks(
    style_review: dict,
    report: dict,
    errors: list[str],
    *,
    required: bool,
    source: str,
) -> int:
    if not required:
        return 0

    inventory = _normalize_inventory(report.get("element_inventory"), errors=errors)
    checks = _normalize_component_checks(style_review.get("hiui_component_checks"), errors=errors)
    style_issue_titles, style_issue_indexes = _style_issue_refs(report)
    required_ids = {spec["id"] for spec in HIUI_COMPONENT_CHECKS}

    for spec in HIUI_COMPONENT_CHECKS:
        check_id = spec["id"]
        item = checks.get(check_id)
        if not isinstance(item, dict):
            errors.append(f"style_review.hiui_component_checks 缺少 {check_id}：{spec['name']}")
            continue

        path = f"style_review.hiui_component_checks.{check_id}"
        status = _require_status(item, path=path, errors=errors)
        _require_note(item, path=path, errors=errors)

        inventory_type = spec["inventory_type"]
        inventory_item = inventory.get(inventory_type, {})
        present = inventory_item.get("present") is True
        if present and status == "n/a":
            errors.append(f"{path}.status 不能是 n/a；element_inventory 已声明 {inventory_type}.present=true")
        if present and source in REQUIRED_SOURCES and status == "pending":
            errors.append(f"{path}.status 不能是 pending；url/screenshot 模式下可见元素必须判定 pass 或 issue")

        if status == "issue":
            _require_style_issue_link(
                item,
                path=path,
                style_issue_titles=style_issue_titles,
                style_issue_indexes=style_issue_indexes,
                errors=errors,
            )

    extra_ids = set(checks) - required_ids
    for check_id in sorted(extra_ids):
        item = checks[check_id]
        path = f"style_review.hiui_component_checks.{check_id}"
        status = _require_status(item, path=path, errors=errors)
        _require_note(item, path=path, errors=errors)
        if status == "issue":
            _require_style_issue_link(
                item,
                path=path,
                style_issue_titles=style_issue_titles,
                style_issue_indexes=style_issue_indexes,
                errors=errors,
            )

    return len(required_ids)


def validate_report(report: dict) -> dict:
    source = _text(report.get("source")).lower()
    errors: list[str] = []
    style_review = report.get("style_review")
    required = _style_review_required(report, source)

    if style_review is None:
        if required:
            errors.append("url / screenshot 模式必须填写 style_review 并完成结构四问快扫")
        return {"errors": errors, "ok": not errors, "required": required, "source": source}
    if not isinstance(style_review, dict):
        return {"errors": ["style_review 必须是对象"], "ok": False, "required": required, "source": source}

    trigger = _validate_trigger(style_review, source, errors)
    structure_has_issue = _validate_structure_scan(style_review, report, errors)
    dimensions_required = (
        structure_has_issue
        or style_review.get("detail_check_required") is True
        or trigger in DETAIL_REQUIRED_TRIGGERS
    )
    if dimensions_required and style_review.get("detail_check_required") is not True:
        errors.append("进入六维样式详查时，style_review.detail_check_required 必须显式填写 true")
    _validate_detail_reason(style_review, errors, required=dimensions_required)
    dimensions_has_issue = _validate_dimensions(style_review, report, errors, required=dimensions_required)

    framework = _text(style_review.get("framework")).lower()
    hiui_required = framework == "hiui-design"
    _validate_hiui_sections(style_review, report, errors, required=hiui_required)
    hiui_component_check_count = _validate_hiui_component_checks(
        style_review,
        report,
        errors,
        required=hiui_required,
        source=source,
    )

    return {
        "errors": errors,
        "ok": not errors,
        "required": required,
        "source": source,
        "structure_scan_required_count": len(STRUCTURE_SCAN_ITEMS),
        "hiui_component_check_required_count": hiui_component_check_count,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="校验 ux-walkthrough 样式走查是否按稳定流程执行")
    parser.add_argument("--report-json", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    try:
        report = _load_report(Path(args.report_json).expanduser().resolve())
        result = validate_report(report)
    except ValueError as exc:
        result = {"errors": [str(exc)], "ok": False, "required": True}

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("OK: style review gate passed" if result["ok"] else "ERROR: style review gate failed")
        for error in result["errors"]:
            print(f"- {error}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
