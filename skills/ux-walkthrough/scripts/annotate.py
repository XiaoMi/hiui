#!/usr/bin/env python3
"""
UX Walkthrough - 在原截图上叠加问题标注（浅红高亮 + 说明条）。

示例：
python3 annotate.py \\
  --input raw.png \\
  --output output/annotations/issue-1-annotated.png \\
  --box 120,80,240,96 \\
  --label "主按钮不够突出" \\
  --json
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFont

HIGHLIGHT_FILL = (255, 82, 82, 48)
HIGHLIGHT_STROKE = (220, 38, 38, 220)
LABEL_FILL = (255, 235, 238, 232)
LABEL_TEXT = ImageColor.getrgb("#C62828")
LINE_COLOR = ImageColor.getrgb("#D32F2F")
FONT_SIZE = 22
FONT_CANDIDATES = [
    Path(os.environ.get("UXW_FONT_PATH", "")).expanduser() if os.environ.get("UXW_FONT_PATH") else None,
    Path(__file__).resolve().parents[1] / "assets" / "fonts" / "NotoSansCJKsc-Regular.otf",
    Path("/System/Library/Fonts/PingFang.ttc"),
    Path("/System/Library/Fonts/Hiragino Sans GB.ttc"),
    Path("/Library/Fonts/Arial Unicode.ttf"),
    Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
    Path("/usr/share/fonts/opentype/noto/NotoSansCJKSC-Regular.otf"),
    Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"),
    Path("/usr/share/fonts/truetype/noto/NotoSansCJKSC-Regular.otf"),
    Path("/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"),
    Path("/usr/share/fonts/truetype/arphic/uming.ttc"),
]


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="根据 bbox 与说明在原图上生成标注版截图")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--box", action="append", default=[], help="x,y,w,h，可重复")
    parser.add_argument("--label", action="append", default=[], help="与 --box 一一对应")
    parser.add_argument("--padding", type=int, default=0, help="在 box 四周扩展像素（已含 padding 的坐标请传 0）")
    parser.add_argument("--json", action="store_true")
    return parser


from bbox_utils import apply_padding, parse_box as _parse_box_xywh


def _parse_box(raw: str) -> tuple[int, int, int, int]:
    x, y, w, h = _parse_box_xywh(raw)
    return x, y, x + w, y + h


def _load_font() -> tuple[ImageFont.ImageFont, str]:
    for candidate in FONT_CANDIDATES:
        if not candidate or not candidate.is_file():
            continue
        try:
            return ImageFont.truetype(str(candidate), FONT_SIZE), str(candidate)
        except OSError:
            continue
    return ImageFont.load_default(), "PIL_default"


def _font_warnings(font_source: str) -> list[str]:
    if font_source != "PIL_default":
        return []
    return [
        "未找到可用中文字体，已退回 PIL 默认字体；可设置 UXW_FONT_PATH 指向 .ttf/.ttc。"
    ]


def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(value, high))


def _choose_label_origin(
    canvas_size: tuple[int, int],
    box: tuple[int, int, int, int],
    label_size: tuple[int, int],
) -> tuple[int, int]:
    width, height = canvas_size
    left, top, right, bottom = box
    label_width, label_height = label_size

    preferred_x = right + 20
    preferred_y = top - label_height - 18
    if preferred_x + label_width <= width and preferred_y >= 0:
        return preferred_x, preferred_y

    left_x = left - label_width - 20
    if left_x >= 0 and preferred_y >= 0:
        return left_x, preferred_y

    below_y = bottom + 18
    if below_y + label_height <= height:
        return _clamp(left, 0, max(width - label_width, 0)), below_y

    return _clamp(left, 0, max(width - label_width, 0)), _clamp(top, 0, max(height - label_height, 0))


def _draw_annotation(
    image: Image.Image,
    draw: ImageDraw.ImageDraw,
    font: ImageFont.ImageFont,
    box: tuple[int, int, int, int],
    label: str,
) -> None:
    left, top, right, bottom = box
    draw.rounded_rectangle(box, radius=8, fill=HIGHLIGHT_FILL, outline=HIGHLIGHT_STROKE, width=3)

    text_bbox = draw.multiline_textbbox((0, 0), label, font=font, spacing=6)
    label_width = text_bbox[2] - text_bbox[0] + 28
    label_height = text_bbox[3] - text_bbox[1] + 20
    label_x, label_y = _choose_label_origin(image.size, box, (label_width, label_height))
    label_box = (label_x, label_y, label_x + label_width, label_y + label_height)

    draw.rounded_rectangle(label_box, radius=6, fill=LABEL_FILL, outline=HIGHLIGHT_STROKE, width=2)
    draw.multiline_text(
        (label_x + 14, label_y + 10),
        label,
        font=font,
        fill=LABEL_TEXT,
        spacing=6,
    )

    source = ((left + right) // 2, (top + bottom) // 2)
    if label_y + label_height < top:
        target = (label_x + label_width // 2, label_y + label_height)
    elif label_y > bottom:
        target = (label_x + label_width // 2, label_y)
    elif label_x > right:
        target = (label_x, label_y + label_height // 2)
    else:
        target = (label_x + label_width, label_y + label_height // 2)
    draw.line([target, source], fill=LINE_COLOR, width=3)


def build_result(args: argparse.Namespace) -> dict:
    input_path = Path(args.input).expanduser()
    output_path = Path(args.output).expanduser()
    if not input_path.is_file():
        return {
            "message": f"未找到输入图片：{input_path}",
            "ok": False,
            "reason": "input_not_found",
            "status": "failed",
        }

    if not args.box:
        return {
            "message": "至少需要提供一个 --box。",
            "ok": False,
            "reason": "missing_box",
            "status": "failed",
        }

    if len(args.box) != len(args.label):
        return {
            "message": "--box 与 --label 的数量必须一致。",
            "ok": False,
            "reason": "annotation_count_mismatch",
            "status": "failed",
        }

    image = Image.open(input_path).convert("RGBA")
    overlay = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    font, font_source = _load_font()

    boxes = [_parse_box(item) for item in args.box]
    if args.padding:
        padded_boxes = []
        w_img, h_img = image.size
        for left, top, right, bottom in boxes:
            x, y = left, top
            bw, bh = right - left, bottom - top
            px, py, pw, ph = apply_padding(x, y, bw, bh, args.padding, w_img, h_img)
            padded_boxes.append((px, py, px + pw, py + ph))
        boxes = padded_boxes
    for box, label in zip(boxes, args.label):
        _draw_annotation(image, draw, font, box, label)

    annotated = Image.alpha_composite(image, overlay).convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    annotated.save(output_path)

    warnings = _font_warnings(font_source)
    result = {
        "annotation_count": len(boxes),
        "font_source": font_source,
        "input_path": str(input_path.resolve()),
        "message": "Annotated image generated" if not warnings else "Annotated image generated with font warning",
        "ok": True,
        "output_path": str(output_path.resolve()),
        "status": "generated",
    }
    if warnings:
        result["warnings"] = warnings
    return result


def main() -> int:
    args = _build_parser().parse_args()
    result = build_result(args)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result["message"])

    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
