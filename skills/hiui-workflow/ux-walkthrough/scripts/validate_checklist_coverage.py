#!/usr/bin/env python3
"""
校验 report.json 是否满足 checklist 覆盖门禁（17 条 UX 检查项须全部判定）。

用法：
  python3 validate_checklist_coverage.py --report-json report.json --json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

CHECKLIST_HEADER_RE = re.compile(r"^### (UX-\d+\.\d+)\s", re.MULTILINE)
URL_SCREENSHOT_NO_NA_IDS = frozenset({"UX-1.4", "UX-1.5", "UX-1.6"})
PENDING_TITLE_MARKER = "待交互验证"
MIN_NOTE_LEN = 8
STYLE_DIMENSION_GATES = {
    "信息层级": frozenset({"UX-1.2", "UX-2.5", "UX-3.1"}),
    "间距与对齐": frozenset({"UX-1.2", "UX-3.1"}),
    "组件状态一致性": frozenset({"UX-2.5", "UX-3.1"}),
    "密度与版面稳定性": frozenset({"UX-1.2", "UX-3.1", "UX-3.5"}),
}
HIUI_SECTION_GATES = {
    "全局视觉基线": frozenset({"UX-2.5", "UX-3.1"}),
    "跨页面共享结构": frozenset({"UX-1.2", "UX-2.5", "UX-3.1"}),
    "页型规范": frozenset({"UX-1.1", "UX-1.2", "UX-2.5"}),
    "组件语义": frozenset({"UX-2.5", "UX-3.1"}),
    "数据可视化专项": frozenset({"UX-1.2", "UX-3.1"}),
}


def _skill_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_checklist_ids(checklist_path: Path | None = None) -> list[str]:
    path = checklist_path or (_skill_root() / "references" / "ux-checklist.md")
    text = path.read_text(encoding="utf-8")
    ids = CHECKLIST_HEADER_RE.findall(text)

    def sort_key(item_id: str) -> tuple[int, int]:
        major, minor = item_id.replace("UX-", "").split(".")
        return int(major), int(minor)

    unique = sorted(set(ids), key=sort_key)
    if not unique:
        raise ValueError(f"未能从 {path} 解析 checklist ID")
    return unique


def _text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _normalize_status(raw: object) -> tuple[str | None, str, str]:
    """Return (kind, note_or_reason, error)."""
    text = _text(raw)
    if not text:
        return None, "", "值为空"

    lowered = text.lower()
    if lowered == "issue":
        return "issue", "", ""
    if lowered.startswith("pass:"):
        note = text.split(":", 1)[1].strip()
        if len(note) < MIN_NOTE_LEN:
            return None, "", f"pass 备注须 ≥{MIN_NOTE_LEN} 字（pass: …）"
        return "pass", note, ""
    if lowered == "pass":
        return None, "", f"禁止裸 pass；须写 pass: <验证证据，≥{MIN_NOTE_LEN} 字>"
    if lowered.startswith("pending:"):
        reason = text.split(":", 1)[1].strip()
        if len(reason) < MIN_NOTE_LEN:
            return None, "", f"pending 原因须 ≥{MIN_NOTE_LEN} 字（pending: …）"
        return "pending", reason, ""
    if lowered.startswith("n/a:") or lowered.startswith("na:"):
        reason = text.split(":", 1)[1].strip()
        if len(reason) < MIN_NOTE_LEN:
            return None, "", f"n/a 原因须 ≥{MIN_NOTE_LEN} 字（n/a: …）"
        return "n/a", reason, ""
    return None, "", "无效状态；允许 issue / pass:… / pending:… / n/a:…"


def _pending_issue_count(issues: list) -> int:
    count = 0
    for issue in issues:
        if not isinstance(issue, dict):
            continue
        title = _text(issue.get("title", ""))
        if PENDING_TITLE_MARKER in title:
            count += 1
    return count


def _append_style_consistency_errors(report: dict, status_by_id: dict[str, str], errors: list[str]) -> None:
    style_review = report.get("style_review")
    if not isinstance(style_review, dict):
        return
    framework = _text(style_review.get("framework")).lower()
    issues = report.get("issues", [])
    style_issue_titles = set()
    style_issue_indexes = set()
    if isinstance(issues, list):
        for issue in issues:
            if not isinstance(issue, dict) or _text(issue.get("category")) != "样式问题":
                continue
            title = _text(issue.get("title"))
            if title:
                style_issue_titles.add(title)
            index_text = _text(issue.get("index"))
            if index_text:
                style_issue_indexes.add(index_text)

    def require_formal_style_issue(path: str, item: dict) -> None:
        if _text(item.get("status")).lower() != "issue":
            return
        linked_index = _text(item.get("linked_issue_index"))
        linked_title = _text(item.get("linked_issue_title"))
        if not linked_index and not linked_title:
            errors.append(f"{path} 已标 issue，必须填写 linked_issue_index 或 linked_issue_title 并落入正式 issues[]")
            return
        if linked_index and linked_index not in style_issue_indexes:
            errors.append(f"{path}.linked_issue_index={linked_index} 未指向 category=样式问题 的正式 issue")
        if linked_title and linked_title not in style_issue_titles:
            errors.append(f"{path}.linked_issue_title 未指向 category=样式问题 的正式 issue")

    dimensions = style_review.get("dimensions")
    if isinstance(dimensions, list):
        for index, item in enumerate(dimensions):
            if not isinstance(item, dict):
                continue
            require_formal_style_issue(f"style_review.dimensions[{index}]", item)
            name = _text(item.get("name"))
            status = _text(item.get("status")).lower()
            if status != "issue" or name not in STYLE_DIMENSION_GATES:
                continue
            related = STYLE_DIMENSION_GATES[name]
            if not any(status_by_id.get(item_id) == "issue" for item_id in related):
                errors.append(
                    f"style_review.dimensions「{name}」已标 issue，但 {' / '.join(sorted(related))} 中没有任何一项标 issue；"
                    "样式问题不得全部写成 pass"
                )

    if framework != "hiui-design":
        return

    hiui_sections = style_review.get("hiui_sections")
    if isinstance(hiui_sections, list):
        for index, item in enumerate(hiui_sections):
            if not isinstance(item, dict):
                continue
            require_formal_style_issue(f"style_review.hiui_sections[{index}]", item)
            name = _text(item.get("name"))
            status = _text(item.get("status")).lower()
            if status != "issue" or name not in HIUI_SECTION_GATES:
                continue
            related = HIUI_SECTION_GATES[name]
            if not any(status_by_id.get(item_id) == "issue" for item_id in related):
                errors.append(
                    f"style_review.hiui_sections「{name}」已标 issue，但 {' / '.join(sorted(related))} 中没有任何一项标 issue；"
                    "HiUI 样式结论不得与 checklist 全部 pass 冲突"
                )


def validate_report(report: dict, *, checklist_path: Path | None = None) -> dict:
    source = _text(report.get("source", "")).lower()
    issues = report.get("issues", [])
    errors: list[str] = []

    if not isinstance(issues, list):
        errors.append("issues 必须是数组")
        issues = []
    for issue_index, issue in enumerate(issues):
        if not isinstance(issue, dict):
            continue
        severity = _text(issue.get("severity")).upper()
        category = _text(issue.get("category"))
        if severity and severity not in {"P0", "P1", "P2", "P3"}:
            errors.append(f"issues[{issue_index}].severity 必须是 P0 / P1 / P2 / P3")
        if severity == "P3" and category != "样式问题":
            errors.append("P3 仅允许用于 category=样式问题 的规范偏差类正式 issue")

    try:
        required_ids = load_checklist_ids(checklist_path)
    except (OSError, ValueError) as exc:
        return {
            "checklist_ids": [],
            "coverage_count": 0,
            "errors": [f"无法加载 checklist：{exc}"],
            "ok": False,
            "required_count": 0,
            "source": source,
        }

    coverage = report.get("checklist_coverage")
    if not isinstance(coverage, dict):
        errors.append("缺少 checklist_coverage 对象；须为全部 checklist ID 填写判定")
        return {
            "checklist_ids": required_ids,
            "coverage_count": 0,
            "errors": errors,
            "ok": False,
            "required_count": len(required_ids),
            "source": source,
        }

    status_by_id: dict[str, str] = {}
    issue_marked = 0
    pending_marked = 0
    pass_with_note = 0

    for key, raw_status in coverage.items():
        key_text = _text(key)
        if key_text.startswith("_"):
            continue
        if not key_text.startswith("UX-"):
            errors.append(f"checklist_coverage 含未知键「{key_text}」")
            continue
        kind, detail, err = _normalize_status(raw_status)
        if kind is None:
            errors.append(f"{key_text}：{err}")
            continue
        status_by_id[key_text] = kind
        if kind == "issue":
            issue_marked += 1
        elif kind == "pending":
            pending_marked += 1
        elif kind == "pass":
            pass_with_note += 1
        if source in {"url", "screenshot"} and kind == "n/a" and key_text in URL_SCREENSHOT_NO_NA_IDS:
            errors.append(
                f"{key_text} 在 {source} 模式下不可标 n/a（须 pass / issue / pending）"
            )

    missing = [item_id for item_id in required_ids if item_id not in status_by_id]
    if missing:
        preview = "、".join(missing[:5])
        suffix = f" 等共 {len(missing)} 条" if len(missing) > 5 else ""
        errors.append(f"checklist_coverage 缺少条目：{preview}{suffix}")

    extra = sorted(set(status_by_id) - set(required_ids))
    if extra:
        errors.append(f"checklist_coverage 含多余 ID：{'、'.join(extra)}")

    if issue_marked > len(issues):
        errors.append(
            f"标为 issue 的 checklist 有 {issue_marked} 条，但 issues 仅 {len(issues)} 条；"
            "请合并问题或修正 coverage"
        )

    pending_issues = _pending_issue_count(issues)
    if pending_marked > pending_issues:
        errors.append(
            f"标为 pending 的 checklist 有 {pending_marked} 条，"
            f"但标题含「{PENDING_TITLE_MARKER}」的 issue 仅 {pending_issues} 条"
        )

    if issues and issue_marked + pending_marked == 0:
        errors.append(
            "issues 非空，但 checklist_coverage 中没有任何 issue 或 pending；"
            "请为对应 checklist 条目标记 issue / pending"
        )

    _append_style_consistency_errors(report, status_by_id, errors)

    return {
        "checklist_ids": required_ids,
        "coverage_count": len(status_by_id),
        "errors": errors,
        "issue_marked_count": issue_marked,
        "ok": not errors,
        "pass_with_note_count": pass_with_note,
        "pending_marked_count": pending_marked,
        "required_count": len(required_ids),
        "source": source,
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="校验 ux-walkthrough report.json checklist 覆盖门禁")
    parser.add_argument("--report-json", required=True)
    parser.add_argument("--checklist-md", help="可选：自定义 ux-checklist.md 路径（测试用）")
    parser.add_argument("--json", action="store_true")
    return parser


def main() -> int:
    args = _build_parser().parse_args()
    path = Path(args.report_json).expanduser()
    checklist_path = Path(args.checklist_md).expanduser() if args.checklist_md else None

    try:
        report = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        result = {"errors": [f"无法读取 report.json：{exc}"], "ok": False}
    else:
        if not isinstance(report, dict):
            result = {"errors": ["report.json 根节点必须是对象"], "ok": False}
        else:
            result = validate_report(report, checklist_path=checklist_path)

    result["report_json"] = str(path.resolve())
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        if result["ok"]:
            print("OK: checklist coverage gate passed")
        else:
            for err in result.get("errors", []):
                print(err)
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
