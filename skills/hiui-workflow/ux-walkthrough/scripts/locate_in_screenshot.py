#!/usr/bin/env python3
"""
在截图中定位 UI 元素的像素 bbox（禁止凭肉眼估坐标）。

策略（按优先级）：
1. --bbox x,y,w,h           手动坐标（须配合 preview_bbox 复核）
2. --find-text + --region   OCR 在限定区域内搜文案（推荐）
3. --find-color + --region  在区域内找主色块（侧栏选中等）

用法：
  python3 locate_in_screenshot.py \\
    --input page.png \\
    --find-text "1,2897" \\
    --region 680,55,340,75 \\
    --occurrence last \\
    --padding 8 \\
    --json
"""

from __future__ import annotations

import argparse
import json
import platform
import re
import sys
from pathlib import Path

from PIL import Image

from bbox_utils import (
    apply_padding,
    center_in_region,
    clamp_box,
    parse_box,
    parse_region,
    pick_occurrence,
    text_matches,
)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="在截图中定位目标 bbox")
    parser.add_argument("--input", required=True)
    parser.add_argument("--bbox", default="", help="手动 x,y,w,h")
    parser.add_argument("--find-text", default="", help="OCR 搜索文案（支持子串）")
    parser.add_argument("--find-color", default="", help="目标色 #RRGGBB，配合 --region")
    parser.add_argument("--region", default="", help="限定搜索区域 x,y,w,h")
    parser.add_argument("--occurrence", default="", help="多匹配时：0 / last / first")
    parser.add_argument("--min-confidence", type=float, default=0.3)
    parser.add_argument("--padding", type=int, default=8)
    parser.add_argument("--min-size", type=int, default=24)
    parser.add_argument("--verify", action="store_true", help="定位后在 bbox 内 OCR 复核 query")
    parser.add_argument("--json", action="store_true")
    return parser


def _ocr_recognize(image_path: Path) -> list[tuple[str, float, list[float]]]:
    errors: list[str] = []

    if platform.system() == "Darwin":
        try:
            from ocrmac import ocrmac

            return list(ocrmac.OCR(str(image_path)).recognize())
        except Exception as exc:  # pragma: no cover - optional backend
            errors.append(f"ocrmac: {exc}")

    try:
        import pytesseract
        from pytesseract import Output

        data = pytesseract.image_to_data(
            Image.open(image_path),
            output_type=Output.DICT,
            lang="chi_sim+eng",
        )
        results: list[tuple[str, float, list[float]]] = []
        n = len(data["text"])
        width, height = Image.open(image_path).size
        for i in range(n):
            text = (data["text"][i] or "").strip()
            if not text:
                continue
            conf_raw = data["conf"][i]
            try:
                conf = float(conf_raw) / 100.0
            except (TypeError, ValueError):
                conf = 0.0
            x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
            results.append((text, conf, [x / width, y / height, w / width, h / height]))
        if results:
            return results
    except Exception as exc:  # pragma: no cover - optional backend
        errors.append(f"pytesseract: {exc}")

    hint = "；".join(errors) if errors else "未安装 OCR 后端"
    raise RuntimeError(
        f"无法 OCR：{hint}。"
        " macOS 请 pip install ocrmac；或安装 tesseract + pip install pytesseract；"
        " 或使用 --bbox + preview_bbox.py 复核。"
    )


def _normalized_to_pixels(
    bbox_norm: list[float],
    width: int,
    height: int,
    offset_x: int = 0,
    offset_y: int = 0,
) -> tuple[int, int, int, int]:
    x, y, w, h = bbox_norm
    px = int(x * width) + offset_x
    py = int(y * height) + offset_y
    pw = max(int(w * width), 1)
    ph = max(int(h * height), 1)
    return px, py, pw, ph


def _find_text_matches(
    image_path: Path,
    query: str,
    region: tuple[int, int, int, int] | None,
    min_confidence: float,
) -> list[dict]:
    image = Image.open(image_path)
    width, height = image.size

    if region is not None:
        rx, ry, rw, rh = region
        crop = image.crop((rx, ry, rx + rw, ry + rh))
        crop_path = image_path.with_suffix(".locate-crop.png")
        crop.save(crop_path)
        search_path = crop_path
        offset_x, offset_y = rx, ry
        search_w, search_h = rw, rh
    else:
        search_path = image_path
        offset_x = offset_y = 0
        search_w, search_h = width, height

    matches: list[dict] = []
    for text, confidence, bbox_norm in _ocr_recognize(search_path):
        if confidence < min_confidence:
            continue
        if not text_matches(query, text):
            continue
        x, y, w, h = _normalized_to_pixels(bbox_norm, search_w, search_h, offset_x, offset_y)
        cx, cy = x + w / 2, y + h / 2
        if not center_in_region(cx, cy, region):
            continue
        matches.append(
            {
                "bbox": [x, y, w, h],
                "confidence": confidence,
                "match_text": text,
                "method": "ocr_text",
            }
        )

    if region is not None:
        crop_path = image_path.with_suffix(".locate-crop.png")
        if crop_path.exists():
            crop_path.unlink(missing_ok=True)

    matches.sort(key=lambda item: (item["bbox"][1], item["bbox"][0]))
    return matches


def _parse_color(raw: str) -> tuple[int, int, int]:
    value = raw.strip().lstrip("#")
    if len(value) != 6:
        raise ValueError(f"无法识别颜色：{raw}")
    return int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)


def _find_color_region(
    image_path: Path,
    color: tuple[int, int, int],
    region: tuple[int, int, int, int],
    tolerance: int = 48,
) -> dict:
    image = Image.open(image_path).convert("RGB")
    rx, ry, rw, rh = region
    crop = image.crop((rx, ry, rx + rw, ry + rh))
    px = crop.load()
    tr, tg, tb = color
    points: list[tuple[int, int]] = []
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b = px[x, y]
            if abs(r - tr) <= tolerance and abs(g - tg) <= tolerance and abs(b - tb) <= tolerance:
                points.append((x, y))
    if not points:
        raise ValueError(f"在 region {region} 内未找到接近 {color} 的像素")

    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    x0, x1 = min(xs), max(xs)
    y0, y1 = min(ys), max(ys)
    return {
        "bbox": [rx + x0, ry + y0, x1 - x0 + 1, y1 - y0 + 1],
        "confidence": 1.0,
        "match_text": f"color={color}",
        "method": "color_cluster",
    }


def _digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def _verify_bbox_text(
    image_path: Path,
    bbox: list[int],
    query: str,
    min_confidence: float,
    match_text: str = "",
) -> dict:
    if match_text and (
        text_matches(query, match_text) or _digits(query) in _digits(match_text)
    ):
        return {
            "hits": [{"text": match_text, "confidence": 1.0, "matched": "locate_text"}],
            "ok": True,
            "message": "bbox 复核通过（locate match_text 一致）",
        }

    x, y, w, h = bbox
    image = Image.open(image_path)
    margin = max(24, max(w, h))
    crop = image.crop(
        (
            max(0, x - margin),
            max(0, y - margin),
            min(image.width, x + w + margin),
            min(image.height, y + h + margin),
        )
    )
    crop_path = image_path.with_suffix(".verify-crop.png")
    crop.save(crop_path)
    try:
        hits = []
        query_digits = _digits(query)
        for text, confidence, _bbox in _ocr_recognize(crop_path):
            if confidence < min_confidence:
                continue
            candidate_digits = _digits(text)
            if text_matches(query, text) or text_matches(match_text, text):
                hits.append({"text": text, "confidence": confidence})
            elif query_digits and query_digits in candidate_digits:
                hits.append({"text": text, "confidence": confidence, "matched": "digits"})
        ok = bool(hits)
        return {
            "hits": hits,
            "ok": ok,
            "message": "bbox 复核通过" if ok else f"bbox 区域内未 OCR 到「{query}」，坐标可能偏移",
        }
    finally:
        crop_path.unlink(missing_ok=True)


def locate(args: argparse.Namespace) -> dict:
    image_path = Path(args.input).expanduser().resolve()
    if not image_path.is_file():
        return {"ok": False, "message": f"未找到图片：{image_path}", "reason": "input_not_found"}

    image = Image.open(image_path)
    width, height = image.size
    region = parse_region(args.region) if args.region else None

    if args.bbox:
        x, y, w, h = parse_box(args.bbox)
        match = {
            "bbox": [x, y, w, h],
            "confidence": 1.0,
            "match_text": "manual",
            "method": "manual_bbox",
        }
    elif args.find_text:
        matches = _find_text_matches(image_path, args.find_text, region, args.min_confidence)
        try:
            picked = pick_occurrence(matches, args.occurrence or None)
        except ValueError as exc:
            return {"ok": False, "message": str(exc), "reason": "ambiguous_match", "matches": matches}
        match = picked
    elif args.find_color:
        if region is None:
            return {"ok": False, "message": "--find-color 必须配合 --region", "reason": "missing_region"}
        match = _find_color_region(image_path, _parse_color(args.find_color), region)
    else:
        return {
            "ok": False,
            "message": "请提供 --bbox、--find-text 或 --find-color",
            "reason": "missing_target",
        }

    x, y, w, h = match["bbox"]
    padded = apply_padding(x, y, w, h, args.padding, width, height, min_size=args.min_size)
    result = {
        "bbox": list(padded),
        "bbox_raw": match["bbox"],
        "confidence": match.get("confidence"),
        "image_size": [width, height],
        "input_path": str(image_path),
        "match_text": match.get("match_text", ""),
        "method": match.get("method", ""),
        "message": "bbox located",
        "ok": True,
        "padding": args.padding,
        "region": list(region) if region else None,
    }

    if args.verify and args.find_text:
        check = _verify_bbox_text(
            image_path,
            match["bbox"],
            args.find_text,
            args.min_confidence,
            match.get("match_text", ""),
        )
        result["verify"] = check
        if not check["ok"]:
            result["ok"] = False
            result["message"] = check["message"]
            result["reason"] = "verify_failed"

    return result


def main() -> int:
    args = _build_parser().parse_args()
    try:
        result = locate(args)
    except Exception as exc:
        result = {"ok": False, "message": str(exc), "reason": "locate_failed"}

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result.get("message", result))

    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
