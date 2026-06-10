#!/usr/bin/env python3
"""
UX Walkthrough - 证据门禁判断脚本

用途：
- 在模式已经确认后，先做一次结构化证据门禁判断
- 优先覆盖 URL 登录页、URL 页面不可达、截图不足、代码扫描失败四类高频失败出口
- 输出结构化 JSON，供外层决定继续走查、等待补充，还是直接说明当前无法形成完整交付

用法：
- python3 check_evidence_gate.py --source url --login-required true --current-url https://example.com --json
- python3 check_evidence_gate.py --source url --page-reachable false --current-url https://example.com --json
- python3 check_evidence_gate.py --source screenshot --image-path a.png --image-path b.png --json
- python3 check_evidence_gate.py --source code --scan-json /tmp/pages.json --json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def _parse_bool(raw: str) -> bool:
    value = raw.strip().lower()
    if value in {"1", "true", "yes", "y"}:
        return True
    if value in {"0", "false", "no", "n"}:
        return False
    raise argparse.ArgumentTypeError(f"无法识别布尔值: {raw}")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="判断 ux-walkthrough 的证据门禁是否通过")
    parser.add_argument("--source", required=True, choices=["code", "url", "screenshot"])
    parser.add_argument("--project", default="")
    parser.add_argument("--scan-json", default="")
    parser.add_argument("--scan-succeeded", default="auto")
    parser.add_argument("--manual-evidence", type=_parse_bool, default=False)
    parser.add_argument("--minimum-pages", type=int, default=1)
    parser.add_argument("--minimum-router-files", type=int, default=0)

    parser.add_argument("--current-url", default="")
    parser.add_argument("--page-title", default="")
    parser.add_argument("--page-reachable", type=_parse_bool, default=True)
    parser.add_argument("--login-required", type=_parse_bool, default=False)
    parser.add_argument("--has-screenshot-evidence", type=_parse_bool, default=False)

    parser.add_argument("--image-path", action="append", default=[])
    parser.add_argument("--minimum-images", type=int, default=1)
    parser.add_argument("--evidence-complete", default="auto")
    parser.add_argument("--detail", default="")

    parser.add_argument("--json", action="store_true")
    return parser


def _project_display_name(project: str) -> str:
    value = project.strip()
    return f"项目“{value}”的" if value else "本次"


def _format_url_context(args: argparse.Namespace) -> str:
    parts: list[str] = []
    if args.current_url.strip():
        parts.append(f"当前 URL：{args.current_url.strip()}")
    if args.page_title.strip():
        parts.append(f"页面标题：{args.page_title.strip()}")
    return "；".join(parts)


def _explicit_or_fallback(explicit: str, fallback: str) -> str:
    value = explicit.strip()
    return value if value else fallback


def _failed_result(
    *,
    source: str,
    failure_preset: str,
    failure_stage: str,
    failure_reason: str,
    failure_detail: str,
    message: str,
) -> dict:
    return {
        "failure_detail": failure_detail,
        "failure_preset": failure_preset,
        "failure_reason": failure_reason,
        "failure_stage": failure_stage,
        "message": message,
        "next_action": "stop_walkthrough",
        "ok": True,
        "should_continue": False,
        "source": source,
        "status": "failed",
    }


def _needs_input_gate_result(
    *,
    source: str,
    message: str,
    next_action: str,
    extra: dict | None = None,
) -> dict:
    result = {
        "message": message,
        "next_action": next_action,
        "ok": False,
        "should_continue": False,
        "source": source,
        "status": "needs_input",
    }
    if extra:
        result.update(extra)
    return result


def _continue_result(*, source: str, message: str, extra: dict | None = None) -> dict:
    result = {
        "message": message,
        "next_action": "continue_walkthrough",
        "ok": True,
        "should_continue": True,
        "source": source,
        "status": "continue",
    }
    if extra:
        result.update(extra)
    return result


def _needs_input_result(*, source: str, message: str, extra: dict | None = None) -> dict:
    result = {
        "message": message,
        "next_action": "request_more_evidence",
        "ok": False,
        "should_continue": False,
        "source": source,
        "status": "needs_input",
    }
    if extra:
        result.update(extra)
    return result


def _handle_url(args: argparse.Namespace) -> dict:
    project_text = _project_display_name(args.project)
    url_context = _format_url_context(args)

    if not args.page_reachable:
        fallback_detail = f"{project_text}URL 走查在证据门禁阶段无法打开目标页面或进入真实业务页。"
        if url_context:
            fallback_detail = f"{fallback_detail}{url_context}。"
        return _failed_result(
            source="url",
            failure_preset="url_page_unreachable",
            failure_stage="evidence_ready",
            failure_reason="page_unreachable",
            failure_detail=_explicit_or_fallback(args.detail, fallback_detail),
            message="URL 证据门禁未通过：目标页面不可达，当前无法形成完整交付。",
        )

    if args.login_required:
        fallback_detail = f"{project_text}URL 走查在证据门禁阶段仍停留在登录或授权状态，未进入真实业务页。"
        if url_context:
            fallback_detail = f"{fallback_detail}{url_context}。"
        return _needs_input_gate_result(
            source="url",
            message="URL 证据门禁未通过：当前仍停留在登录或授权页，请先完成登录或补充登录后的页面证据。",
            next_action="request_user_login",
            extra={
                "detail": _explicit_or_fallback(args.detail, fallback_detail),
                "reason": "login_required",
            },
        )

    return _continue_result(
        source="url",
        message="URL 证据门禁已通过，可继续进入正式 URL 走查。",
        extra={
            "gate": {
                "current_url": args.current_url.strip(),
                "has_screenshot_evidence": args.has_screenshot_evidence,
                "page_title": args.page_title.strip(),
            }
        },
    )


def _resolve_evidence_complete(args: argparse.Namespace, existing_images: list[str]) -> bool:
    raw = args.evidence_complete.strip().lower()
    if raw == "auto":
        return len(existing_images) >= max(args.minimum_images, 1)
    return _parse_bool(raw)


def _handle_screenshot(args: argparse.Namespace) -> dict:
    raw_paths = [value.strip() for value in args.image_path if value.strip()]
    existing_images = [str(Path(value).expanduser()) for value in raw_paths if Path(value).expanduser().is_file()]

    if not raw_paths:
        return _needs_input_result(
            source="screenshot",
            message="截图模式证据门禁未开始：当前还没有提供任何截图路径，请先补充原始截图。",
            extra={"next_action": "request_screenshots"},
        )

    evidence_complete = _resolve_evidence_complete(args, existing_images)
    if not evidence_complete:
        project_text = _project_display_name(args.project)
        fallback_detail = (
            f"{project_text}截图走查现有截图数量或关键信息不足，"
            f"当前仅识别到 {len(existing_images)} 张有效截图，无法支撑完整结论。"
        )
        return _needs_input_gate_result(
            source="screenshot",
            message="截图证据门禁未通过：现有截图不足以支撑完整走查，请先补充更多截图或更完整的页面证据。",
            next_action="request_screenshots",
            extra={
                "detail": _explicit_or_fallback(args.detail, fallback_detail),
                "reason": "evidence_insufficient",
                "existing_image_count": len(existing_images),
            },
        )

    return _continue_result(
        source="screenshot",
        message="截图证据门禁已通过，可继续进入正式截图走查。",
        extra={
            "gate": {
                "existing_image_count": len(existing_images),
                "existing_image_paths": existing_images,
                "minimum_images": max(args.minimum_images, 1),
            }
        },
    )


def _load_scan_result(path_text: str) -> dict:
    path = Path(path_text).expanduser()
    if not path.is_file():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def _scan_gate_stats(scan_data: dict) -> dict:
    if not isinstance(scan_data, dict):
        return {"components": 0, "pages": 0, "router_files": 0, "styles": 0}

    summary = scan_data.get("summary", {})
    pages = scan_data.get("pages", [])
    routers = scan_data.get("router_files", [])
    styles = scan_data.get("style_files", [])
    components = scan_data.get("components", [])

    total_pages = int(summary.get("total_pages", len(pages) if isinstance(pages, list) else 0) or 0)
    total_styles = int(summary.get("total_styles", len(styles) if isinstance(styles, list) else 0) or 0)
    total_components = int(summary.get("total_components", len(components) if isinstance(components, list) else 0) or 0)

    return {
        "components": total_components,
        "pages": total_pages,
        "router_files": len(routers) if isinstance(routers, list) else 0,
        "styles": total_styles,
    }


def _resolve_scan_succeeded(args: argparse.Namespace, scan_data: dict) -> bool:
    raw = args.scan_succeeded.strip().lower()
    if raw == "auto":
        return bool(scan_data)
    return _parse_bool(raw)


def _handle_code(args: argparse.Namespace) -> dict:
    if args.manual_evidence:
        return _continue_result(
            source="code",
            message="代码证据门禁已通过：当前已提供可用的手动证据，可继续正式代码走查。",
            extra={
                "gate": {
                    "manual_evidence": True,
                    "scan_json": args.scan_json.strip(),
                }
            },
        )

    scan_data = _load_scan_result(args.scan_json.strip()) if args.scan_json.strip() else {}
    scan_succeeded = _resolve_scan_succeeded(args, scan_data)
    stats = _scan_gate_stats(scan_data)
    enough_pages = stats["pages"] >= max(args.minimum_pages, 0)
    enough_router_files = stats["router_files"] >= max(args.minimum_router_files, 0)

    if scan_succeeded and enough_pages and enough_router_files:
        return _continue_result(
            source="code",
            message="代码证据门禁已通过：扫描结果足以支撑正式代码走查。",
            extra={
                "gate": {
                    "manual_evidence": False,
                    "scan_json": args.scan_json.strip(),
                    "scan_stats": stats,
                }
            },
        )

    project_text = _project_display_name(args.project)
    if scan_succeeded and scan_data:
        fallback_detail = (
            f"{project_text}代码走查已拿到扫描结果，但当前仅识别到 {stats['pages']} 个页面、"
            f"{stats['router_files']} 个路由文件，仍不足以支撑正式走查，且未提供手动证据。"
        )
    else:
        fallback_detail = (
            f"{project_text}代码走查扫描脚本未成功产出可用结果，"
            f"且当前也没有可替代的手动证据，无法继续正式走查。"
        )

    return _needs_input_gate_result(
        source="code",
        message="代码证据门禁未通过：当前扫描结果不足或扫描失败，请先补充页面入口、关键页面位置或手动证据。",
        next_action="request_more_evidence",
        extra={
            "detail": _explicit_or_fallback(args.detail, fallback_detail),
            "reason": "scan_failed",
            "scan_stats": stats,
        },
    )


def build_result(args: argparse.Namespace) -> dict:
    if args.source == "url":
        return _handle_url(args)
    if args.source == "screenshot":
        return _handle_screenshot(args)
    return _handle_code(args)


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
