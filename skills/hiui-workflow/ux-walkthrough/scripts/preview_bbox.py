#!/usr/bin/env python3
"""
生成 bbox 预览图，供标注前/后像素级复核（200% 局部放大）。

用法：
  python3 preview_bbox.py --input page.png --bbox 957,116,43,11 --padding 8 \\
    --output /tmp/preview-issue-1.png --json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw

from bbox_utils import apply_padding, parse_box


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="生成 bbox 定位预览图")
    parser.add_argument("--input", required=True)
    parser.add_argument("--bbox", required=True, help="x,y,w,h")
    parser.add_argument("--padding", type=int, default=8)
    parser.add_argument("--scale", type=int, default=3, help="局部放大倍数")
    parser.add_argument("--output", required=True)
    parser.add_argument("--draw-on-full", action="store_true", help="同时输出整页缩略预览")
    parser.add_argument("--json", action="store_true")
    return parser


def build_preview(args: argparse.Namespace) -> dict:
    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser()
    if not input_path.is_file():
        return {"ok": False, "message": f"未找到图片：{input_path}", "reason": "input_not_found"}

    image = Image.open(input_path).convert("RGB")
    width, height = image.size
    x, y, w, h = parse_box(args.bbox)
    px, py, pw, ph = apply_padding(x, y, w, h, args.padding, width, height)

    # 局部放大预览
    margin = max(24, args.padding * 2)
    crop_left = max(0, px - margin)
    crop_top = max(0, py - margin)
    crop_right = min(width, px + pw + margin)
    crop_bottom = min(height, py + ph + margin)
    crop = image.crop((crop_left, crop_top, crop_right, crop_bottom)).copy()
    draw = ImageDraw.Draw(crop)
    rel_box = (px - crop_left, py - crop_top, px - crop_left + pw, py - crop_top + ph)
    draw.rectangle(rel_box, outline=(220, 38, 38), width=3)

    scaled = crop.resize(
        (crop.width * args.scale, crop.height * args.scale),
        Image.Resampling.NEAREST,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    scaled.save(output_path)

    result = {
        "bbox_padded": [px, py, pw, ph],
        "bbox_raw": [x, y, w, h],
        "input_path": str(input_path),
        "message": "preview generated",
        "ok": True,
        "output_path": str(output_path.resolve()),
        "scale": args.scale,
    }

    if args.draw_on_full:
        full = image.copy()
        full_draw = ImageDraw.Draw(full)
        full_draw.rectangle((px, py, px + pw, py + ph), outline=(220, 38, 38), width=3)
        full_out = output_path.with_name(output_path.stem + "-full" + output_path.suffix)
        full.save(full_out)
        result["full_preview_path"] = str(full_out.resolve())

    return result


def main() -> int:
    args = _build_parser().parse_args()
    result = build_preview(args)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result.get("message", result))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
