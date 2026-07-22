#!/usr/bin/env python3
"""Minimal version consistency check for the hiui-refine skill."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


SEMVER_PATTERN = r"\d+\.\d+\.\d+"


def extract(pattern: str, text: str, label: str) -> str:
    match = re.search(pattern, text, flags=re.MULTILINE)
    if not match:
        raise ValueError(f"Could not find {label}.")
    return match.group(1)


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    root = script_dir.parent

    manifest_path = root / "skill.manifest.json"
    skill_path = root / "SKILL.md"
    changelog_path = root / "CHANGELOG.md"

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    skill_text = skill_path.read_text(encoding="utf-8")
    changelog_text = changelog_path.read_text(encoding="utf-8")

    versions = {
        "manifest": manifest.get("version"),
        "skill_front_matter": extract(
            rf"^version:\s*({SEMVER_PATTERN})\s*$",
            skill_text,
            "SKILL.md front matter version",
        ),
        "skill_version_section": extract(
            rf"^- 当前版本：`({SEMVER_PATTERN})`$",
            skill_text,
            "SKILL.md version section",
        ),
        "changelog_latest": extract(
            rf"^## \[({SEMVER_PATTERN})\] - ",
            changelog_text,
            "CHANGELOG latest version",
        ),
    }

    if not versions["manifest"] or not re.fullmatch(SEMVER_PATTERN, versions["manifest"]):
        raise ValueError("Manifest version is missing or not valid semver.")

    unique_versions = sorted(set(versions.values()))

    print("Version sources:")
    for name, version in versions.items():
        print(f"- {name}: {version}")

    if len(unique_versions) != 1:
        print("\nVersion mismatch detected.", file=sys.stderr)
        return 1

    print(f"\nVersion consistency check passed: {unique_versions[0]}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"Validation error: {exc}", file=sys.stderr)
        raise SystemExit(1)
