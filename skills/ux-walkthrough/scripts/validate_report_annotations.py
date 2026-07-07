#!/usr/bin/env python3
"""
校验 report.json 是否满足标注门禁（screenshot / url 模式每个问题须有标注图）。

用法：
  python3 validate_report_annotations.py --report-json report.json --json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

SOURCES_REQUIRE_ALL_ISSUES = {"url", "screenshot"}


def _text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _is_annotated_image(entry: object) -> bool:
    if isinstance(entry, dict):
        if entry.get("annotated") is True:
            return True
        path_text = _text(entry.get("path", ""))
    else:
        path_text = _text(entry)

    if not path_text:
        return False

    normalized = path_text.replace("\\", "/").lower()
    if "-annotated" in Path(path_text).name.lower():
        return True
    if "/annotations/" in normalized:
        return True
    return False


def _bbox_from_image_entry(entry: object) -> list[int] | None:
    if not isinstance(entry, dict):
        return None
    bbox = entry.get("bbox")
    if isinstance(bbox, dict):
        keys = ("x", "y", "w", "h")
        if all(key in bbox for key in keys):
            return [int(bbox[k]) for k in keys]
    if isinstance(bbox, list) and len(bbox) == 4:
        return [int(v) for v in bbox]
    return None


def validate_report(report: dict) -> dict:
    source = _text(report.get("source", "")).lower()
    issues = report.get("issues", [])
    errors: list[str] = []

    if not isinstance(issues, list) or not issues:
        return {
            "errors": ["issues 必须是非空数组"],
            "issue_count": 0,
            "ok": False,
            "source": source,
        }

    for index, issue in enumerate(issues):
        if not isinstance(issue, dict):
            errors.append(f"issues[{index}] 必须是对象")
            continue

        title = _text(issue.get("title", "")) or f"问题 {index + 1}"
        images = issue.get("images", [])
        if isinstance(images, (str, dict)):
            images = [images]
        if not isinstance(images, list):
            errors.append(f"issues[{index}]（{title}）的 images 必须是数组")
            continue

        if source in SOURCES_REQUIRE_ALL_ISSUES:
            if not images:
                errors.append(f"issues[{index}]（{title}）缺少标注图：screenshot/url 模式每个问题须配图")
                continue
            if not any(_is_annotated_image(item) for item in images):
                errors.append(
                    f"issues[{index}]（{title}）须使用标注版截图"
                    "（path 含 -annotated 或在 annotations/ 下，或 images[].annotated=true）"
                )
                continue
            if not any(_bbox_from_image_entry(item) for item in images if isinstance(item, dict)):
                errors.append(
                    f"issues[{index}]（{title}）须在 images[] 中记录 bbox（x,y,w,h），"
                    "请用 locate_in_screenshot.py / annotate_issue.py 生成，禁止手估坐标"
                )
        elif source == "code" and images:
            if not any(_is_annotated_image(item) for item in images):
                errors.append(f"issues[{index}]（{title}）若配图须为标注版")

    return {
        "errors": errors,
        "issue_count": len(issues),
        "ok": not errors,
        "required": source in SOURCES_REQUIRE_ALL_ISSUES,
        "source": source,
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="校验 ux-walkthrough report.json 标注门禁")
    parser.add_argument("--report-json", required=True)
    parser.add_argument("--json", action="store_true")
    return parser


def main() -> int:
    args = _build_parser().parse_args()
    path = Path(args.report_json).expanduser()
    try:
        report = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        result = {"errors": [f"无法读取 report.json：{exc}"], "ok": False}
    else:
        if not isinstance(report, dict):
            result = {"errors": ["report.json 根节点必须是对象"], "ok": False}
        else:
            result = validate_report(report)

    result["report_json"] = str(path.resolve())
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        if result["ok"]:
            print("OK: annotation gate passed")
        else:
            for err in result.get("errors", []):
                print(err)
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
