#!/usr/bin/env python3

from __future__ import annotations

import json
import importlib.util
import subprocess
import sys
import tempfile
import types
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
FIXTURES = ROOT / "tests" / "fixtures"
PYTHON = sys.executable or "python3"


def run_json(command: list[str]) -> dict:
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    if completed.returncode != 0:
        raise AssertionError(f"命令执行失败: {' '.join(command)}\nSTDERR:\n{completed.stderr}\nSTDOUT:\n{completed.stdout}")
    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise AssertionError(f"命令未返回 JSON: {' '.join(command)}\n{completed.stdout}") from exc


def test_monorepo_gate() -> None:
    repo = FIXTURES / "monorepo"

    root_detect = run_json(
        [
            PYTHON,
            str(SCRIPTS / "detect_input_mode.py"),
            "--repo-path",
            str(repo),
            "--json",
        ]
    )
    assert root_detect["status"] == "continue"
    assert root_detect["next_action"] == "run_scan_pages"

    precheck = run_json(
        [
            PYTHON,
            str(SCRIPTS / "precheck_walkthrough.py"),
            "--repo-path",
            str(repo),
            "--json",
        ]
    )
    assert precheck["status"] == "continue"
    assert precheck["mode"] == "code"
    assert precheck["scan"]["summary"]["total_pages"] >= 1
    assert precheck["next_action"] in {
        "continue_walkthrough",
        "try_url_walkthrough",
        "start_dev_server_then_url_walkthrough",
        "fallback_code_walkthrough",
    }


def test_url_login_gate() -> None:
    result = run_json(
        [
            PYTHON,
            str(SCRIPTS / "precheck_walkthrough.py"),
            "--url",
            "https://example.com/app",
            "--current-url",
            "https://example.com/login",
            "--page-title",
            "登录",
            "--page-reachable",
            "true",
            "--login-required",
            "true",
            "--has-screenshot-evidence",
            "false",
            "--json",
        ]
    )
    assert result["status"] == "failed"
    assert result["next_action"] == "explain_failure"
    assert result["failure_preset"] == "url_login_required"


def test_annotate_script() -> None:
    from PIL import Image

    with tempfile.TemporaryDirectory(prefix="uxw-annotate-test-") as tmp_dir:
        raw_path = Path(tmp_dir) / "raw.png"
        output_path = Path(tmp_dir) / "annotated.png"
        Image.new("RGB", (640, 360), "#FFFFFF").save(raw_path)

        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "annotate.py"),
                "--input",
                str(raw_path),
                "--output",
                str(output_path),
                "--box",
                "80,60,220,90",
                "--label",
                "主按钮说明不清晰",
                "--json",
            ]
        )
        assert result["status"] == "generated"
        assert output_path.is_file()
        assert "font_source" in result


def _load_annotate_module() -> types.ModuleType:
    module_path = SCRIPTS / "annotate.py"
    scripts_path = str(SCRIPTS)
    if scripts_path not in sys.path:
        sys.path.insert(0, scripts_path)
    spec = importlib.util.spec_from_file_location("uxw_annotate_test", module_path)
    if spec is None or spec.loader is None:
        raise AssertionError("无法加载 annotate.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_annotate_fallback_warning() -> None:
    from PIL import Image

    annotate_module = _load_annotate_module()

    with tempfile.TemporaryDirectory(prefix="uxw-annotate-warning-") as tmp_dir:
        raw_path = Path(tmp_dir) / "raw.png"
        output_path = Path(tmp_dir) / "annotated.png"
        Image.new("RGB", (320, 180), "#FFFFFF").save(raw_path)

        original_candidates = annotate_module.FONT_CANDIDATES
        try:
            annotate_module.FONT_CANDIDATES = []
            args = annotate_module._build_parser().parse_args(
                [
                    "--input",
                    str(raw_path),
                    "--output",
                    str(output_path),
                    "--box",
                    "20,20,120,50",
                    "--label",
                    "中文告警测试",
                ]
            )
            result = annotate_module.build_result(args)
        finally:
            annotate_module.FONT_CANDIDATES = original_candidates

        assert result["status"] == "generated"
        assert result["font_source"] == "PIL_default"
        assert result["warnings"]


def test_docx_generation() -> None:
    with tempfile.TemporaryDirectory(prefix="uxw-docx-test-") as tmp_dir:
        output_path = Path(tmp_dir) / "report.docx"
        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "generate_docx.py"),
                "--report-json",
                str(FIXTURES / "report" / "minimal-report.json"),
                "--output",
                str(output_path),
                "--overwrite",
                "--json",
            ]
        )
        assert result["status"] == "generated"
        assert output_path.is_file()


def test_checklist_gate() -> None:
    result = run_json(
        [
            PYTHON,
            str(SCRIPTS / "validate_checklist_coverage.py"),
            "--report-json",
            str(FIXTURES / "report" / "minimal-report.json"),
            "--json",
        ]
    )
    assert result["ok"] is True
    assert result["required_count"] >= 17


def main() -> int:
    test_monorepo_gate()
    test_url_login_gate()
    test_annotate_script()
    test_annotate_fallback_warning()
    test_checklist_gate()
    test_docx_generation()
    print("Smoke tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
