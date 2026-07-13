"""Shared bbox helpers for ux-walkthrough annotation pipeline."""

from __future__ import annotations

import re
from typing import Iterable


def parse_box(raw: str) -> tuple[int, int, int, int]:
    parts = [part.strip() for part in raw.split(",")]
    if len(parts) != 4:
        raise ValueError(f"无法识别 box 参数：{raw}")
    x, y, w, h = [int(part) for part in parts]
    if w <= 0 or h <= 0:
        raise ValueError(f"box 宽高必须大于 0：{raw}")
    return x, y, w, h


def parse_region(raw: str) -> tuple[int, int, int, int]:
    return parse_box(raw)


def box_to_xyxy(x: int, y: int, w: int, h: int) -> tuple[int, int, int, int]:
    return x, y, x + w, y + h


def xyxy_to_xywh(left: int, top: int, right: int, bottom: int) -> tuple[int, int, int, int]:
    return left, top, max(right - left, 1), max(bottom - top, 1)


def clamp_box(
    x: int,
    y: int,
    w: int,
    h: int,
    canvas_w: int,
    canvas_h: int,
) -> tuple[int, int, int, int]:
    x = max(0, min(x, max(canvas_w - 1, 0)))
    y = max(0, min(y, max(canvas_h - 1, 0)))
    w = max(1, min(w, canvas_w - x))
    h = max(1, min(h, canvas_h - y))
    return x, y, w, h


def apply_padding(
    x: int,
    y: int,
    w: int,
    h: int,
    padding: int,
    canvas_w: int,
    canvas_h: int,
    min_size: int = 24,
) -> tuple[int, int, int, int]:
    left, top, right, bottom = box_to_xyxy(x, y, w, h)
    left -= padding
    top -= padding
    right += padding
    bottom += padding
    out_w = max(right - left, min_size)
    out_h = max(bottom - top, min_size)
    return clamp_box(left, top, out_w, out_h, canvas_w, canvas_h)


def center_in_region(
    cx: float,
    cy: float,
    region: tuple[int, int, int, int] | None,
) -> bool:
    if region is None:
        return True
    rx, ry, rw, rh = region
    return rx <= cx <= rx + rw and ry <= cy <= ry + rh


def normalize_match_text(text: str) -> str:
    return re.sub(r"\s+", "", text).lower()


def text_matches(query: str, candidate: str) -> bool:
    q = normalize_match_text(query)
    c = normalize_match_text(candidate)
    if not q:
        return False
    return q in c or c in q


def pick_occurrence(
    matches: list[dict],
    occurrence: str | int | None,
) -> dict:
    if not matches:
        raise ValueError("未找到匹配项")
    if occurrence is None or occurrence == "":
        if len(matches) == 1:
            return matches[0]
        titles = ", ".join(
            f"[{idx}] {item.get('match_text', '')} @ {item.get('bbox')}"
            for idx, item in enumerate(matches)
        )
        raise ValueError(f"找到 {len(matches)} 个匹配，请用 --occurrence 指定：{titles}")

    if isinstance(occurrence, str):
        value = occurrence.strip().lower()
        if value == "first":
            return matches[0]
        if value == "last":
            return matches[-1]
        occurrence = int(value)

    index = int(occurrence)
    if index < 0:
        index = len(matches) + index
    if index < 0 or index >= len(matches):
        raise ValueError(f"occurrence 越界：{occurrence}（共 {len(matches)} 项）")
    return matches[index]


def merge_boxes(boxes: Iterable[tuple[int, int, int, int]]) -> tuple[int, int, int, int]:
    items = list(boxes)
    if not items:
        raise ValueError("boxes 不能为空")
    left = min(x for x, _, _, _ in items)
    top = min(y for _, y, _, _ in items)
    right = max(x + w for x, _, w, _ in items)
    bottom = max(y + h for _, y, _, h in items)
    return xyxy_to_xywh(left, top, right, bottom)
