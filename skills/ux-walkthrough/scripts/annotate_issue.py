#!/usr/bin/env python3
"""
一键：定位 bbox → 预览复核 → 生成标注图（禁止手估坐标）。

示例：
  python3 annotate_issue.py \\
    --input page.png \\
    --output output/annotations/issue-1-annotated.png \\
    --find-text "1,2897" \\
    --region 680,55,340,75 \\
    --occurrence last \\
    --label "金额千分位错误" \\
    --preview-dir output/annotations/previews \\
    --json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PYTHON = sys.executable or "python3"


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="定位 + 预览 + 标注 一键流程")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--label", required=True)
    parser.add_argument("--bbox", default="")
    parser.add_argument("--find-text", default="")
    parser.add_argument("--find-color", default="")
    parser.add_argument("--region", default="")
    parser.add_argument("--occurrence", default="")
    parser.add_argument("--padding", type=int, default=8)
    parser.add_argument("--preview-dir", default="")
    parser.add_argument("--skip-preview", action="store_true")
    parser.add_argument("--json", action="store_true")
    return parser


def _run_json(script: str, argv: list[str]) -> dict:
    cmd = [PYTHON, str(SCRIPT_DIR / script), *argv, "--json"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        detail = proc.stdout.strip() or proc.stderr.strip() or f"{script} failed"
        try:
            payload = json.loads(proc.stdout)
        except json.JSONDecodeError:
            payload = {"message": detail, "ok": False}
        payload.setdefault("ok", False)
        return payload
    return json.loads(proc.stdout)


def build_result(args: argparse.Namespace) -> dict:
    locate_argv = ["--input", args.input, "--padding", str(args.padding)]
    if args.bbox:
        locate_argv.extend(["--bbox", args.bbox])
    elif args.find_text:
        locate_argv.extend(["--find-text", args.find_text, "--verify"])
        if args.region:
            locate_argv.extend(["--region", args.region])
        if args.occurrence:
            locate_argv.extend(["--occurrence", args.occurrence])
    elif args.find_color:
        locate_argv.extend(["--find-color", args.find_color, "--region", args.region])
    else:
        return {
            "ok": False,
            "message": "必须提供 --bbox、--find-text 或 --find-color",
            "reason": "missing_target",
        }

    located = _run_json("locate_in_screenshot.py", locate_argv)
    if not located.get("ok"):
        return located

    bbox = located["bbox"]
    bbox_text = ",".join(str(v) for v in bbox)
    preview_path = ""
    if not args.skip_preview and args.preview_dir:
        preview_dir = Path(args.preview_dir).expanduser()
        preview_dir.mkdir(parents=True, exist_ok=True)
        stem = Path(args.output).stem
        preview_path = str(preview_dir / f"{stem}-preview.png")
        preview = _run_json(
            "preview_bbox.py",
            ["--input", args.input, "--bbox", bbox_text, "--padding", "0", "--output", preview_path],
        )
        if not preview.get("ok"):
            return preview

    annotate = _run_json(
        "annotate.py",
        [
            "--input",
            args.input,
            "--output",
            args.output,
            "--box",
            bbox_text,
            "--label",
            args.label,
        ],
    )
    if not annotate.get("ok"):
        return annotate

    return {
        "annotate": annotate,
        "bbox": bbox,
        "bbox_raw": located.get("bbox_raw"),
        "locate": located,
        "match_text": located.get("match_text"),
        "message": "Annotated issue generated",
        "method": located.get("method"),
        "ok": True,
        "output_path": str(Path(args.output).expanduser().resolve()),
        "preview_path": preview_path,
        "status": "generated",
    }


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result.get("message", result))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
