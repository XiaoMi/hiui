#!/usr/bin/env python3

from __future__ import annotations

import json
import importlib.util
import subprocess
import sys
import tempfile
import types
from pathlib import Path
from zipfile import ZipFile


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


def run_json_any_exit(command: list[str]) -> tuple[int, dict]:
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    try:
        payload = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise AssertionError(f"命令未返回 JSON: {' '.join(command)}\n{completed.stdout}") from exc
    return completed.returncode, payload


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


def test_skill_root_not_page_project() -> None:
    result = run_json(
        [
            PYTHON,
            str(SCRIPTS / "precheck_walkthrough.py"),
            str(ROOT),
            "--json",
        ]
    )
    assert result["status"] == "failed"
    assert result["next_action"] == "run_closeout_walkthrough"
    assert result["failure_preset"] == "code_not_page_project"


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
    assert result["next_action"] == "run_closeout_walkthrough"
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


def test_docx_generation_with_hiui_sections_only() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["style_review"] = {
        "framework": "hiui-design",
        "trigger": "source_default",
        "structure_scan": [
            {
                "name": "页头到首屏内容有没有接住",
                "status": "pass",
                "note": "测试报告仍先记录结构快扫结果",
                "evidence": "用于验证仅 HiUI 专项不会直接展示",
            },
            {
                "name": "主白底外边距稳不稳",
                "status": "pass",
                "note": "测试报告主工作区边距稳定",
                "evidence": "用于满足样式门禁结构快扫要求",
            },
            {
                "name": "多列有没有收口",
                "status": "n/a",
                "note": "测试报告不涉及多列布局结构",
                "evidence": "当前 fixture 仅验证 HiUI 专项隐藏行为",
            },
            {
                "name": "有没有大块无效空白",
                "status": "pass",
                "note": "测试报告未声明大块无效空白",
                "evidence": "用于保持样式门禁流程完整执行",
            },
        ],
        "hiui_sections": [
            {
                "name": "全局视觉基线",
                "status": "issue",
                "severity": "P1",
                "note": "仅保留 HiUI 对照结论",
                "evidence": "验证导出时不会漏掉 HiUI 专项块",
                "linked_issue_index": 1,
            },
            {
                "name": "跨页面共享结构",
                "status": "pass",
                "severity": "P3",
                "note": "共享结构没有发现明显偏离",
                "evidence": "该用例保留单一主工作区结构",
            },
            {
                "name": "页型规范",
                "status": "pass",
                "severity": "P3",
                "note": "页面结构仍符合基础页型",
                "evidence": "该用例仅验证无维度表时不展示样式专项观察",
            },
            {
                "name": "组件语义",
                "status": "pass",
                "severity": "P3",
                "note": "组件语义没有新增问题",
                "evidence": "该用例仅验证 HiUI 专项门禁完整性",
            }
        ],
        "hiui_component_checks": [
            {
                "id": "HIUI-ACTION-PRIMARY-RIGHTMOST",
                "name": "页头主按钮位于动作组最右端",
                "status": "pass",
                "note": "fixture 主操作区没有顺序冲突",
                "evidence": "该用例仅保留一个主操作按钮",
            },
            {
                "id": "HIUI-ACTION-GROUP-RIGHT-ALIGNED",
                "name": "页头动作组靠右对齐",
                "status": "pass",
                "note": "fixture 主操作区对齐关系稳定",
                "evidence": "代码结构保持单一主操作区域",
            },
            {
                "id": "HIUI-TABLE-ROW-ACTION-LINK-BLUE",
                "name": "表格行内操作使用蓝色 link 文本",
                "status": "n/a",
                "note": "fixture 没有表格行内操作",
                "evidence": "代码结构未包含表格操作列",
            },
            {
                "id": "HIUI-TABLE-ROW-ACTION-FIXED-RIGHT",
                "name": "表格操作列固定在右侧",
                "status": "n/a",
                "note": "fixture 没有表格操作列",
                "evidence": "代码结构未包含表格组件",
            },
            {
                "id": "HIUI-DANGER-ACTION-CONFIRM",
                "name": "危险操作具备二次确认或撤销路径",
                "status": "n/a",
                "note": "fixture 没有危险操作入口",
                "evidence": "代码中未出现删除禁用等动作",
            },
            {
                "id": "HIUI-FORM-FOOTER-ACTIONS",
                "name": "表单底部操作主次清晰并靠右",
                "status": "n/a",
                "note": "fixture 没有表单底部操作区",
                "evidence": "代码结构未包含表单页",
            },
            {
                "id": "HIUI-MODAL-DRAWER-ACTION-SEMANTICS",
                "name": "弹窗抽屉操作区符合主次与风险语义",
                "status": "n/a",
                "note": "fixture 没有弹窗或抽屉",
                "evidence": "代码结构未包含 Modal 或 Drawer",
            },
            {
                "id": "HIUI-DATA-VIS-THEME-SEMANTICS",
                "name": "统计图表使用 HiUI 主题与状态语义",
                "status": "n/a",
                "note": "fixture 没有统计图表",
                "evidence": "代码结构未包含图表或指标卡",
            },
        ],
    }

    with tempfile.TemporaryDirectory(prefix="uxw-docx-hiui-only-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        output_path = Path(tmp_dir) / "report.docx"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "generate_docx.py"),
                "--report-json",
                str(report_path),
                "--output",
                str(output_path),
                "--overwrite",
                "--json",
            ]
        )
        assert result["status"] == "generated"
        with ZipFile(output_path) as archive:
            document_xml = archive.read("word/document.xml").decode("utf-8")
        assert "样式专项观察" in document_xml
        assert "HiUI 组件逐项检查" in document_xml
        assert "HiUI 对照结论" not in document_xml
        assert "全局视觉基线" not in document_xml


def test_docx_generation_hiui_style_review_after_checklist() -> None:
    with tempfile.TemporaryDirectory(prefix="uxw-docx-hiui-style-order-") as tmp_dir:
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
        with ZipFile(output_path) as archive:
            document_xml = archive.read("word/document.xml").decode("utf-8")
        assert "样式专项观察" in document_xml
        assert "整体判断" not in document_xml
        assert "优先收敛点" not in document_xml
        assert "HiUI 对照结论" not in document_xml
        assert document_xml.index("Checklist 逐条检查记录") < document_xml.index("样式专项观察")


def test_docx_generation_records_style_review_for_non_hiui() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["style_review"]["framework"] = "other-design"
    report["style_review"]["hiui_sections"] = [
        {
            "name": "跨页面共享结构",
            "status": "issue",
            "severity": "P1",
            "note": "模拟非 HiUI 报告残留的旧专项数据",
            "evidence": "这里保留残留数据，验证导出模块不会误展示",
            "linked_issue_index": 1,
        }
    ]

    with tempfile.TemporaryDirectory(prefix="uxw-docx-non-hiui-style-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        output_path = Path(tmp_dir) / "report.docx"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "generate_docx.py"),
                "--report-json",
                str(report_path),
                "--output",
                str(output_path),
                "--overwrite",
                "--json",
            ]
        )
        assert result["status"] == "generated"
        with ZipFile(output_path) as archive:
            document_xml = archive.read("word/document.xml").decode("utf-8")
        assert "样式专项观察" in document_xml


def test_docx_generation_rejects_invalid_hiui_severity() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["style_review"]["hiui_sections"][0]["severity"] = "PX"

    with tempfile.TemporaryDirectory(prefix="uxw-docx-hiui-invalid-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        output_path = Path(tmp_dir) / "report.docx"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        completed = subprocess.run(
            [
                PYTHON,
                str(SCRIPTS / "generate_docx.py"),
                "--report-json",
                str(report_path),
                "--output",
                str(output_path),
                "--overwrite",
                "--json",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        assert completed.returncode != 0
        payload = json.loads(completed.stdout)
        assert payload["status"] == "failed"
        assert "severity" in payload["detail"]


def test_docx_generation_rejects_non_style_p3_issue() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["issues"][0]["category"] = "交互问题"
    report["issues"][0]["severity"] = "P3"

    with tempfile.TemporaryDirectory(prefix="uxw-docx-non-style-p3-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        output_path = Path(tmp_dir) / "report.docx"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [
                PYTHON,
                str(SCRIPTS / "generate_docx.py"),
                "--report-json",
                str(report_path),
                "--output",
                str(output_path),
                "--overwrite",
                "--json",
            ]
        )
        assert code != 0
        assert result["status"] == "failed"
        assert "P0 / P1 / P2" in result["detail"]


def test_checklist_gate_requires_style_review_issue_link() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["style_review"]["dimensions"][0].pop("linked_issue_index")

    with tempfile.TemporaryDirectory(prefix="uxw-style-link-gate-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_checklist_coverage.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("linked_issue_index" in error for error in result["errors"])


def test_style_gate_passes_complete_style_review() -> None:
    result = run_json(
        [
            PYTHON,
            str(SCRIPTS / "validate_style_review.py"),
            "--report-json",
            str(FIXTURES / "report" / "minimal-report.json"),
            "--json",
        ]
    )
    assert result["ok"] is True


def test_style_gate_requires_url_style_review() -> None:
    report = json.loads((FIXTURES / "report" / "minimal-report.json").read_text(encoding="utf-8"))
    report["source"] = "url"
    report.pop("style_review")
    with tempfile.TemporaryDirectory(prefix="uxw-style-required-url-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_style_review.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("必须填写 style_review" in error for error in result["errors"])


def test_style_gate_requires_structure_scan() -> None:
    report = json.loads((FIXTURES / "report" / "minimal-report.json").read_text(encoding="utf-8"))
    report["style_review"].pop("structure_scan")
    with tempfile.TemporaryDirectory(prefix="uxw-style-structure-required-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_style_review.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("structure_scan" in error for error in result["errors"])


def test_docx_generation_rejects_skip_gates() -> None:
    for flag, reason in (
        ("--skip-checklist-check", "checklist_gate_skip_forbidden"),
        ("--skip-annotation-check", "annotation_gate_skip_forbidden"),
    ):
        with tempfile.TemporaryDirectory(prefix="uxw-docx-skip-gate-") as tmp_dir:
            output_path = Path(tmp_dir) / "report.docx"
            code, result = run_json_any_exit(
                [
                    PYTHON,
                    str(SCRIPTS / "generate_docx.py"),
                    "--report-json",
                    str(FIXTURES / "report" / "minimal-report.json"),
                    "--output",
                    str(output_path),
                    flag,
                    "--json",
                ]
            )
            assert code != 0
            assert result["status"] == "failed"
            assert result["failure_reason"] == reason


def test_core_flow_rejects_low_risk_stopped_before_submit() -> None:
    report = json.loads((FIXTURES / "report" / "minimal-report.json").read_text(encoding="utf-8"))
    execution = report["core_flows"][0]["execution"]
    execution.clear()
    execution.update(
        {
            "status": "stopped_before_submit",
            "stopped_at": "已经填写完主操作表单但没有点击提交",
            "stop_reason": "低风险测试数据不应该停在提交前",
            "side_effect_level": "low",
            "evidence": [{"type": "code_fixture_review", "note": "模拟低风险流程停在提交前"}],
        }
    )

    with tempfile.TemporaryDirectory(prefix="uxw-core-low-risk-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_core_flows.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("不允许停在提交前" in error for error in result["errors"])


def test_annotation_gate_rejects_true_without_annotated_artifact() -> None:
    report = {
        "source": "url",
        "issues": [
            {
                "title": "伪造标注字段",
                "images": [
                    {
                        "path": "/tmp/plain-screenshot.png",
                        "annotated": True,
                        "bbox": [10, 20, 30, 40],
                    }
                ],
            }
        ],
    }
    with tempfile.TemporaryDirectory(prefix="uxw-annotation-true-only-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_report_annotations.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("须使用标注版截图" in error for error in result["errors"])


def test_closeout_success_requires_all_delivery_gates() -> None:
    report = json.loads((FIXTURES / "report" / "minimal-report.json").read_text(encoding="utf-8"))
    report.pop("checklist_coverage")
    with tempfile.TemporaryDirectory(prefix="uxw-closeout-delivery-gate-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [
                PYTHON,
                str(SCRIPTS / "classify_closeout.py"),
                "--source",
                "code",
                "--precheck-started",
                "true",
                "--report-json",
                str(report_path),
                "--report-generated",
                "true",
                "--docx-generated",
                "true",
                "--docx-name",
                "fake.docx",
                "--json",
            ]
        )
        assert code != 0
        assert result["status"] == "needs_input"
        assert result["closeout_reason"] == "checklist_coverage_incomplete"


def test_closeout_success_requires_real_docx_path() -> None:
    with tempfile.TemporaryDirectory(prefix="uxw-closeout-docx-path-") as tmp_dir:
        report_path = FIXTURES / "report" / "minimal-report.json"
        code, result = run_json_any_exit(
            [
                PYTHON,
                str(SCRIPTS / "classify_closeout.py"),
                "--source",
                "code",
                "--precheck-started",
                "true",
                "--report-json",
                str(report_path),
                "--report-generated",
                "true",
                "--docx-generated",
                "true",
                "--docx-name",
                "definitely-not-existing.docx",
                "--docx-path",
                str(Path(tmp_dir) / "definitely-not-existing.docx"),
                "--json",
            ]
        )
        assert code != 0
        assert result["status"] == "needs_input"
        assert result["closeout_reason"] == "docx_artifact_unverified"


def test_core_flow_requires_action_inventory_coverage() -> None:
    report = json.loads((FIXTURES / "report" / "minimal-report.json").read_text(encoding="utf-8"))
    report["action_inventory"]["row_actions"] = ["删除供应商"]
    with tempfile.TemporaryDirectory(prefix="uxw-core-action-coverage-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        code, result = run_json_any_exit(
            [PYTHON, str(SCRIPTS / "validate_core_flows.py"), "--report-json", str(report_path), "--json"]
        )
        assert code != 0
        assert result["ok"] is False
        assert any("row_actions" in error for error in result["errors"])


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


def test_checklist_gate_ignores_hiui_sections_for_non_hiui() -> None:
    fixture_path = FIXTURES / "report" / "minimal-report.json"
    report = json.loads(fixture_path.read_text(encoding="utf-8"))
    report["issues"] = []
    report["style_review"]["framework"] = "other-design"
    report["style_review"]["dimensions"] = [
        {
            "name": "信息层级",
            "status": "pass",
            "note": "这里改为通过，避免被通用样式门禁拦截",
            "evidence": "本用例只验证非 HiUI 下是否忽略 hiui_sections",
        }
    ]
    report["style_review"]["hiui_sections"] = [
        {
            "name": "跨页面共享结构",
            "status": "issue",
            "severity": "P1",
            "note": "模拟非 HiUI 报告里残留的旧 HiUI 专项字段",
            "evidence": "如果门禁仍读取它，就会误伤非 HiUI 报告",
        }
    ]
    for item_id in ("UX-1.2", "UX-2.5", "UX-3.1"):
        report["checklist_coverage"][item_id] = "pass: 这个用例刻意保持通过以验证非 HiUI 不受误伤"

    with tempfile.TemporaryDirectory(prefix="uxw-checklist-non-hiui-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "validate_checklist_coverage.py"),
                "--report-json",
                str(report_path),
                "--json",
            ]
        )
        assert result["ok"] is True


def test_build_business_context_requires_core_flows_for_prd() -> None:
    with tempfile.TemporaryDirectory(prefix="uxw-biz-prd-missing-flow-") as tmp_dir:
        prd_path = Path(tmp_dir) / "prd.md"
        prd_path.write_text(
            "\n".join(
                [
                    "# 图书管理",
                    "产品目标：帮助图书管理员维护馆藏资料。",
                    "主要用户：图书管理员。",
                    "说明：本页用于日常管理。",
                ]
            ),
            encoding="utf-8",
        )

        returncode, result = run_json_any_exit(
            [
                PYTHON,
                str(SCRIPTS / "build_business_context.py"),
                "--prd-path",
                str(prd_path),
                "--json",
            ]
        )
        assert returncode != 0
        assert result["ok"] is False
        assert result["status"] == "needs_input"
        assert result["evidence_map"]["core_tasks"] == []
        assert result["requires_core_flows"] is True


def test_build_business_context_allows_prd_with_core_flows() -> None:
    with tempfile.TemporaryDirectory(prefix="uxw-biz-prd-ready-") as tmp_dir:
        prd_path = Path(tmp_dir) / "prd.md"
        prd_path.write_text(
            "\n".join(
                [
                    "# 图书管理",
                    "产品目标：帮助图书管理员维护馆藏图书。",
                    "主要用户：图书管理员。",
                    "管理员可以新增图书、编辑图书并导出清单。",
                    "提交后系统会提示保存成功，并可在列表里查看最新结果。",
                ]
            ),
            encoding="utf-8",
        )

        result = run_json(
            [
                PYTHON,
                str(SCRIPTS / "build_business_context.py"),
                "--prd-path",
                str(prd_path),
                "--json",
            ]
        )
        assert result["ok"] is True
        assert result["status"] == "ready"
        assert result["core_flows"]
        assert result["requires_core_flows"] is True


def test_closeout_success_requires_precheck() -> None:
    code, result = run_json_any_exit(
        [
            PYTHON,
            str(SCRIPTS / "classify_closeout.py"),
            "--source",
            "code",
            "--report-json",
            str(FIXTURES / "report" / "minimal-report.json"),
            "--report-generated",
            "true",
            "--docx-generated",
            "true",
            "--docx-name",
            "demo.docx",
            "--json",
        ]
    )
    assert code != 0
    assert result["status"] == "needs_input"
    assert result["closeout_reason"] == "missing_precheck_for_success_closeout"
    assert result["should_finalize_usage"] is False


def main() -> int:
    test_monorepo_gate()
    test_skill_root_not_page_project()
    test_url_login_gate()
    test_annotate_script()
    test_annotate_fallback_warning()
    test_checklist_gate()
    test_checklist_gate_ignores_hiui_sections_for_non_hiui()
    test_build_business_context_requires_core_flows_for_prd()
    test_build_business_context_allows_prd_with_core_flows()
    test_docx_generation()
    test_docx_generation_with_hiui_sections_only()
    test_docx_generation_hiui_style_review_after_checklist()
    test_docx_generation_records_style_review_for_non_hiui()
    test_docx_generation_rejects_invalid_hiui_severity()
    test_docx_generation_rejects_non_style_p3_issue()
    test_checklist_gate_requires_style_review_issue_link()
    test_style_gate_passes_complete_style_review()
    test_style_gate_requires_url_style_review()
    test_style_gate_requires_structure_scan()
    test_docx_generation_rejects_skip_gates()
    test_core_flow_rejects_low_risk_stopped_before_submit()
    test_annotation_gate_rejects_true_without_annotated_artifact()
    test_closeout_success_requires_all_delivery_gates()
    test_closeout_success_requires_real_docx_path()
    test_core_flow_requires_action_inventory_coverage()
    test_closeout_success_requires_precheck()
    print("Smoke tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
