#!/usr/bin/env python3
"""
UX Walkthrough - 业务理解卡构建脚本

用途：
- 从 PRD / 需求文档、项目目录、手工整理的页面线索中提炼业务理解卡
- 输出统一结构，供阶段 B 先建立业务前提，再进入流程走查与 checklist 补漏

用法示例：
  python3 build_business_context.py --prd-path prd.md --json
  python3 build_business_context.py --project-path /repo --signal "按钮：新建合同" --json
  python3 build_business_context.py --prd-path prd.docx --project-path /repo --signal-file notes.txt --json
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path

try:
    from docx import Document
except ImportError:  # pragma: no cover - optional dependency
    Document = None  # type: ignore[assignment]


SCRIPT_DIR = Path(__file__).resolve().parent
SCAN_SCRIPT = SCRIPT_DIR / "scan-pages.py"
PYTHON_BIN = sys.executable or "python3"
SKIP_CODE_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage", "__pycache__"}
CODE_FILE_PATTERNS = ("*.ts", "*.tsx", "*.js", "*.jsx", "*.vue")
TEXT_EXTENSIONS = {".md", ".markdown", ".txt", ".json", ".yaml", ".yml", ".csv", ".tsv"}
GOAL_CUES = ("目标", "用于", "帮助", "支持", "实现", "用来", "目的是", "希望", "to help", "used to", "allows")
SUCCESS_CUES = ("成功", "完成", "保存后", "提交后", "结果", "反馈", "确认", "生效", "completed", "success")
FLOW_CUES = ("流程", "步骤", "路径", "进入", "点击", "提交", "查看", "保存", "审批", "导出", "下一步")
IGNORED_LABEL_LINES = {"产品目标", "核心用户", "核心流程", "风险点", "目标", "流程", "用户", "场景"}
GENERIC_UI_TERMS = {
    "详情",
    "列表",
    "管理",
    "页面",
    "按钮",
    "确认",
    "取消",
    "提交",
    "保存",
    "搜索",
    "筛选",
    "重置",
    "返回",
    "首页",
    "click",
    "button",
    "cancel",
    "submit",
    "save",
    "search",
}
BAD_OBJECT_SUBSTRINGS = ("页面", "展示", "区域", "模块", "一个", "只有", "首页", "fixture", "smoke")
ROLE_PATTERNS = {
    "管理员": ("管理员", "admin", "administrator"),
    "运营": ("运营", "operations", "operation"),
    "审批人": ("审批人", "审核人", "approver", "reviewer"),
    "销售": ("销售", "sale", "sales"),
    "财务": ("财务", "finance", "accounting"),
    "采购": ("采购", "purchase", "procurement"),
    "仓管": ("仓库", "仓管", "warehouse"),
    "客服": ("客服", "customer service", "support"),
    "商家": ("商家", "merchant", "seller"),
    "教师": ("老师", "教师", "teacher"),
    "学员": ("学员", "学生", "student"),
    "用户": ("用户", "user", "member", "visitor"),
}
TASK_PATTERNS = [
    ("查询", ("查询", "搜索", "检索", "查找", "search")),
    ("筛选", ("筛选", "过滤", "filter")),
    ("查看", ("查看", "浏览", "详情", "view")),
    ("新建", ("新建", "创建", "新增", "添加", "create", "add")),
    ("编辑", ("编辑", "修改", "更新", "edit", "update")),
    ("审批", ("审批", "审核", "approve", "review")),
    ("提交", ("提交", "送审", "确认", "submit", "confirm")),
    ("发布", ("发布", "上线", "publish")),
    ("导出", ("导出", "下载", "export", "download")),
    ("配置", ("配置", "设置", "规则", "权限", "config", "setup")),
    ("监控", ("监控", "看板", "监测", "dashboard", "monitor")),
]
OBJECT_KEYWORDS = (
    "合同",
    "订单",
    "资产",
    "客户",
    "用户",
    "成员",
    "报表",
    "商品",
    "工单",
    "任务",
    "规则",
    "权限",
    "库存",
    "发票",
    "项目",
    "设备",
    "账号",
    "活动",
    "课程",
    "记录",
)
FIELD_LABEL_RE = re.compile(r"""["'`](.{2,40}?)["'`]|>([^<>{}\n]{2,30})<""")
CHINESE_TERM_RE = re.compile(r"[\u4e00-\u9fff]{2,8}")
SEPARATOR_RE = re.compile(r"[；;。.!?\n]+")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="为 ux-walkthrough 构建业务理解卡")
    parser.add_argument("--prd-path", action="append", default=[])
    parser.add_argument("--project-path", default="")
    parser.add_argument("--signal-file", action="append", default=[])
    parser.add_argument("--signal", action="append", default=[])
    parser.add_argument("--page-title", action="append", default=[])
    parser.add_argument("--route", action="append", default=[])
    parser.add_argument("--max-code-files", type=int, default=24)
    parser.add_argument("--max-snippets", type=int, default=80)
    parser.add_argument("--json", action="store_true")
    return parser


def _text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _clean_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"^[#>\-\*\d\.\)\(：: ]+", "", text)
    return text.strip()


def _truncate(text: str, limit: int = 120) -> str:
    text = _clean_line(text)
    return text if len(text) <= limit else f"{text[:limit - 1]}…"


def _read_docx(path: Path) -> str:
    if Document is None:
        raise ValueError("当前环境缺少 python-docx，无法直接读取 .docx；请先转成文本再传入")
    document = Document(str(path))
    paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n".join(paragraphs)


def _read_text_path(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".docx":
        return _read_docx(path)
    if suffix not in TEXT_EXTENSIONS and suffix not in {"", ".log"}:
        raise ValueError(f"暂不支持直接解析 {suffix or '该类型'} 文件：{path}")
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="ignore")


def _load_file_text(path_str: str) -> tuple[Path, str]:
    path = Path(path_str).expanduser().resolve()
    if not path.is_file():
        raise ValueError(f"文件不存在：{path}")
    return path, _read_text_path(path)


def _split_sentences(text: str) -> list[str]:
    items: list[str] = []
    for chunk in SEPARATOR_RE.split(text):
        line = _clean_line(chunk)
        if len(line) >= 4 and line not in IGNORED_LABEL_LINES:
            items.append(line)
    return items


def _contains_any(text: str, keywords: tuple[str, ...] | list[str]) -> bool:
    lowered = text.lower()
    return any(keyword.lower() in lowered for keyword in keywords)


def _dedupe_keep_order(items: list[str], limit: int | None = None) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        normalized = re.sub(r"\s+", "", item.lower())
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(item)
        if limit is not None and len(result) >= limit:
            break
    return result


def _run_scan_pages(project_path: Path) -> dict:
    with tempfile.NamedTemporaryFile(prefix="uxw-business-", suffix=".json", delete=False) as handle:
        output_path = Path(handle.name)
    try:
        command = [PYTHON_BIN, str(SCAN_SCRIPT), str(project_path), "--output", str(output_path)]
        completed = subprocess.run(command, capture_output=True, text=True, check=False)
        if completed.returncode != 0 or not output_path.is_file():
            return {}
        try:
            data = json.loads(output_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}
        return data if isinstance(data, dict) else {}
    finally:
        output_path.unlink(missing_ok=True)


def _iter_candidate_code_files(project_path: Path, limit: int) -> list[Path]:
    candidates: list[Path] = []
    preferred_fragments = (
        "src/pages/",
        "src/views/",
        "src/routes/",
        "src/screens/",
        "pages/",
        "views/",
        "routes/",
        "screens/",
        "app/",
    )
    for pattern in CODE_FILE_PATTERNS:
        for path in sorted(project_path.rglob(pattern)):
            if any(part in SKIP_CODE_DIRS for part in path.parts):
                continue
            rel = path.relative_to(project_path).as_posix()
            if not any(fragment in rel for fragment in preferred_fragments):
                continue
            candidates.append(path)
            if len(candidates) >= limit:
                return candidates
    return candidates


def _extract_code_snippets(project_path: Path, limit: int, max_snippets: int) -> list[str]:
    snippets: list[str] = []
    for path in _iter_candidate_code_files(project_path, limit):
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for match in FIELD_LABEL_RE.finditer(content):
            candidate = _clean_line(match.group(1) or match.group(2) or "")
            if len(candidate) < 2 or len(candidate) > 30:
                continue
            lowered = candidate.lower()
            if "/" in candidate or "{" in candidate or "}" in candidate or "class" in lowered:
                continue
            if candidate in GENERIC_UI_TERMS:
                continue
            if not (re.search(r"[\u4e00-\u9fff]", candidate) or re.fullmatch(r"[A-Za-z][A-Za-z ]{1,28}", candidate)):
                continue
            snippets.append(candidate)
            if len(snippets) >= max_snippets:
                return _dedupe_keep_order(snippets, max_snippets)
    return _dedupe_keep_order(snippets, max_snippets)


def _collect_project_signals(project_path: Path, max_code_files: int, max_snippets: int) -> dict:
    scan_result = _run_scan_pages(project_path)
    tech_stack = scan_result.get("tech_stack", {}) if isinstance(scan_result, dict) else {}
    pages = scan_result.get("pages", []) if isinstance(scan_result, dict) else []
    router_files = scan_result.get("router_files", []) if isinstance(scan_result, dict) else []

    page_names: list[str] = []
    if isinstance(pages, list):
        for page in pages[:20]:
            if isinstance(page, dict):
                name = _text(page.get("name", ""))
                if name:
                    page_names.append(name)

    return {
        "code_snippets": _extract_code_snippets(project_path, max_code_files, max_snippets),
        "page_names": _dedupe_keep_order(page_names, 20),
        "project_path": str(project_path),
        "router_files": router_files[:10] if isinstance(router_files, list) else [],
        "tech_stack": tech_stack if isinstance(tech_stack, dict) else {},
    }


def _extract_roles(sentences: list[str]) -> tuple[list[str], list[str]]:
    counter: Counter[str] = Counter()
    evidence: list[str] = []
    for sentence in sentences:
        if sentence in IGNORED_LABEL_LINES:
            continue
        lowered = sentence.lower()
        for role, patterns in ROLE_PATTERNS.items():
            if any(pattern.lower() in lowered for pattern in patterns):
                counter[role] += 1
                evidence.append(_truncate(sentence))
    roles = [role for role, _ in counter.most_common(3)]
    return roles, _dedupe_keep_order(evidence, 5)


def _top_object_terms(sentences: list[str], code_snippets: list[str]) -> list[str]:
    counter: Counter[str] = Counter()
    corpus = sentences + code_snippets
    for text in corpus:
        for keyword in OBJECT_KEYWORDS:
            if keyword in text:
                counter[keyword] += 1
    if counter:
        return [term for term, _ in counter.most_common(5)]

    chinese_terms: Counter[str] = Counter()
    for text in corpus:
        for match in CHINESE_TERM_RE.findall(text):
            if match in GENERIC_UI_TERMS or match in {"页面", "系统", "用户", "管理"}:
                continue
            if len(match) <= 2 and match not in OBJECT_KEYWORDS:
                continue
            if any(fragment in match.lower() for fragment in BAD_OBJECT_SUBSTRINGS):
                continue
            chinese_terms[match] += 1
    return [term for term, _ in chinese_terms.most_common(5)]


def _build_task_phrase(task: str, sentence: str, object_terms: list[str]) -> str:
    current_object = next((term for term in object_terms if term in sentence), "")
    if current_object:
        return f"{task}{current_object}"
    return task


def _extract_tasks(sentences: list[str], code_snippets: list[str]) -> tuple[list[str], list[str]]:
    object_terms = _top_object_terms(sentences, code_snippets)
    tasks: list[str] = []
    evidence: list[str] = []
    for sentence in sentences:
        lowered = sentence.lower()
        for task_name, patterns in TASK_PATTERNS:
            if any(pattern.lower() in lowered for pattern in patterns):
                tasks.append(_build_task_phrase(task_name, sentence, object_terms))
                evidence.append(_truncate(sentence))
    if not tasks:
        for snippet in code_snippets:
            lowered = snippet.lower()
            for task_name, patterns in TASK_PATTERNS:
                if any(pattern.lower() in lowered for pattern in patterns):
                    tasks.append(_build_task_phrase(task_name, snippet, object_terms))
                    evidence.append(_truncate(snippet))
    tasks = [task for task in _dedupe_keep_order(tasks, 3) if not any(fragment in task.lower() for fragment in BAD_OBJECT_SUBSTRINGS)]
    if not tasks and object_terms:
        tasks = [f"查看{object_terms[0]}", f"查询{object_terms[0]}"]
    return tasks, _dedupe_keep_order(evidence, 5)


def _extract_goal(sentences: list[str], roles: list[str], tasks: list[str]) -> tuple[str, list[str]]:
    evidence: list[str] = []
    for sentence in sentences:
        if sentence in IGNORED_LABEL_LINES:
            continue
        if _contains_any(sentence, GOAL_CUES) and len(sentence) >= 8:
            evidence.append(_truncate(sentence))
    if evidence:
        return evidence[0], _dedupe_keep_order(evidence, 3)
    if tasks:
        subject = roles[0] if roles else "业务用户"
        return f"帮助{subject}完成{tasks[0]}等核心任务，并降低关键流程中的理解与操作成本。", []
    return "", []


def _extract_success_signal(sentences: list[str], tasks: list[str]) -> tuple[str, list[str]]:
    evidence: list[str] = []
    for sentence in sentences:
        if sentence in IGNORED_LABEL_LINES:
            continue
        if _contains_any(sentence, SUCCESS_CUES) and len(sentence) >= 8:
            evidence.append(_truncate(sentence))
    if evidence:
        return evidence[0], _dedupe_keep_order(evidence, 3)
    if tasks:
        return f"用户能在较少步骤内完成{tasks[0]}，并清楚知道结果是否已生效。", []
    return "", []


def _extract_risk_points(sentences: list[str], tasks: list[str]) -> tuple[list[str], list[str]]:
    risk_points: list[str] = []
    evidence: list[str] = []
    risk_cues = ("风险", "错误", "误操作", "失败", "异常", "驳回", "超时", "中断")
    for sentence in sentences:
        if _contains_any(sentence, risk_cues):
            risk_points.append(_truncate(sentence, 80))
            evidence.append(_truncate(sentence))
    task_blob = "".join(tasks)
    if any(keyword in task_blob for keyword in ("审批", "提交", "发布", "支付", "删除")):
        risk_points.append("关键动作一旦误操作，恢复成本较高。")
    if any(keyword in task_blob for keyword in ("查询", "筛选", "查看")):
        risk_points.append("筛选或查看结果后若上下文丢失，会拖慢后续处理。")
    return _dedupe_keep_order(risk_points, 4), _dedupe_keep_order(evidence, 3)


def _derive_flow_steps(task: str) -> list[str]:
    if "查询" in task or "筛选" in task:
        return ["进入列表页", "设置筛选条件", "查看结果并定位目标对象", "继续下一步动作"]
    if "新建" in task or "创建" in task:
        return ["进入目标页面", "点击新建入口", "填写关键信息", "提交并确认结果"]
    if "审批" in task:
        return ["找到待处理对象", "查看详情并确认信息", "提交审批结果", "确认状态已更新"]
    if "导出" in task:
        return ["设置导出范围", "触发导出动作", "等待反馈并获取结果文件"]
    if "配置" in task:
        return ["进入配置项", "调整参数", "保存并确认生效"]
    if "编辑" in task:
        return ["定位目标对象", "修改关键信息", "保存并确认结果"]
    return ["进入相关页面", "定位目标对象或入口", "执行关键动作", "确认结果"]


def _derive_core_flows(tasks: list[str], source: str, confidence: str) -> list[dict]:
    flows: list[dict] = []
    status = "confirmed" if source == "prd" and confidence == "high" else "inferred"
    for task in tasks[:3]:
        flows.append(
            {
                "goal": task,
                "name": f"{task}流程",
                "status": status,
                "steps": _derive_flow_steps(task),
            }
        )
    return flows


def _requires_core_flows(has_prd: bool, sentences: list[str], tasks: list[str]) -> bool:
    if has_prd:
        return True
    if tasks:
        return True
    for sentence in sentences:
        lowered = sentence.lower()
        for _, patterns in TASK_PATTERNS:
            if any(pattern.lower() in lowered for pattern in patterns):
                return True
    return False


def _build_assumptions(source: str, project_signals: dict, has_prd: bool) -> list[str]:
    assumptions: list[str] = []
    if not has_prd:
        assumptions.append("未提供正式 PRD，当前业务理解基于页面线索、代码命名或手工信号推断。")
    if project_signals.get("page_names"):
        assumptions.append("项目目录中的页面名和路由名被视为当前业务模块的重要线索。")
    return _dedupe_keep_order(assumptions, 3)


def _build_missing_information(has_prd: bool, roles: list[str], tasks: list[str], success_signal: str) -> list[str]:
    missing: list[str] = []
    if not has_prd:
        missing.append("未提供正式 PRD 或可直接引用的需求文档。")
    if not roles:
        missing.append("主要用户角色仍不够明确。")
    if not tasks:
        missing.append("核心任务仍缺少足够证据支撑。")
    if not success_signal:
        missing.append("成功完成任务后的结果反馈尚不明确。")
    return _dedupe_keep_order(missing, 4)


def _decide_source(has_prd: bool, has_other_signals: bool) -> str:
    if has_prd and has_other_signals:
        return "mixed"
    if has_prd:
        return "prd"
    if has_other_signals:
        return "inferred"
    return "unknown"


def _decide_confidence(source: str, roles: list[str], tasks: list[str], success_signal: str) -> str:
    critical_count = sum(bool(item) for item in (roles, tasks, success_signal))
    if source == "prd" and critical_count == 3:
        return "high"
    if source in {"mixed", "prd"} and critical_count >= 2:
        return "medium"
    if source == "inferred" and critical_count >= 2:
        return "medium"
    return "low"


def _build_message(source: str, confidence: str, status: str) -> str:
    if status == "needs_input":
        return "现有证据仍不足以判断主要用户、核心任务和成功标志，建议先补充最小业务信息。"
    if status == "degraded":
        return "已根据当前线索生成业务理解卡，但仍建议以确定问题为主，业务相关结论需谨慎落笔。"
    return f"已生成业务理解卡（source={source}，confidence={confidence}），可进入核心流程走查。"


def _build_result(args: argparse.Namespace) -> dict:
    prd_inputs = [_text(item) for item in args.prd_path if _text(item)]
    signal_files = [_text(item) for item in args.signal_file if _text(item)]
    direct_signals = [_clean_line(item) for item in args.signal if _clean_line(item)]
    page_titles = [_clean_line(item) for item in args.page_title if _clean_line(item)]
    routes = [_clean_line(item) for item in args.route if _clean_line(item)]
    project_path = Path(_text(args.project_path)).expanduser().resolve() if _text(args.project_path) else None

    prd_texts: list[str] = []
    prd_files_read: list[str] = []
    for path_str in prd_inputs:
        path, text = _load_file_text(path_str)
        prd_files_read.append(str(path))
        prd_texts.append(text)

    signal_texts: list[str] = []
    signal_files_read: list[str] = []
    for path_str in signal_files:
        path, text = _load_file_text(path_str)
        signal_files_read.append(str(path))
        signal_texts.append(text)

    project_signals: dict = {}
    if project_path:
        if not project_path.is_dir():
            raise ValueError(f"项目目录不存在：{project_path}")
        project_signals = _collect_project_signals(project_path, args.max_code_files, args.max_snippets)

    sentences: list[str] = []
    for text in prd_texts + signal_texts:
        sentences.extend(_split_sentences(text))
    sentences.extend(page_titles)
    sentences.extend(routes)
    sentences.extend(direct_signals)
    sentences.extend(project_signals.get("page_names", []))
    sentences.extend(project_signals.get("code_snippets", []))
    sentences = _dedupe_keep_order([_clean_line(item) for item in sentences if _clean_line(item)], 240)

    roles, role_evidence = _extract_roles(sentences)
    tasks, task_evidence = _extract_tasks(sentences, project_signals.get("code_snippets", []))
    product_goal, goal_evidence = _extract_goal(sentences, roles, tasks)
    success_signal, success_evidence = _extract_success_signal(sentences, tasks)
    risk_points, risk_evidence = _extract_risk_points(sentences, tasks)

    has_prd = bool(prd_files_read)
    has_other_signals = bool(
        signal_files_read
        or direct_signals
        or page_titles
        or routes
        or project_signals.get("page_names")
        or project_signals.get("code_snippets")
    )
    source = _decide_source(has_prd, has_other_signals)
    confidence = _decide_confidence(source, roles, tasks, success_signal)
    assumptions = _build_assumptions(source, project_signals, has_prd)
    missing_information = _build_missing_information(has_prd, roles, tasks, success_signal)
    core_flows = _derive_core_flows(tasks, source, confidence)
    requires_core_flows = _requires_core_flows(has_prd, sentences, tasks)
    has_task_evidence = bool(task_evidence)

    critical_missing = not roles or not tasks or not success_signal
    if source == "unknown":
        status = "needs_input"
        next_action = "request_business_context_clarification"
        ok = False
    elif requires_core_flows and (not core_flows or (has_prd and not has_task_evidence)):
        status = "needs_input"
        next_action = "request_business_context_clarification"
        ok = False
        if has_prd:
            missing_information = _dedupe_keep_order(
                ["已提供 PRD / 产品文档，但当前仍未能从文档中提炼出有证据支撑的核心流程。"] + missing_information,
                5,
            )
        else:
            missing_information = _dedupe_keep_order(
                ["当前页面线索已指向具体动作，但仍未能提炼出可执行的核心流程。"] + missing_information,
                5,
            )
    elif critical_missing:
        status = "degraded"
        next_action = "confirmed_issues_only"
        ok = True
    else:
        status = "ready"
        next_action = "continue_walkthrough"
        ok = True

    return {
        "business_context": {
            "assumptions": assumptions,
            "confidence": confidence,
            "core_tasks": tasks,
            "missing_information": missing_information,
            "primary_users": roles,
            "product_goal": product_goal,
            "risk_points": risk_points,
            "source": source,
            "success_signal": success_signal,
        },
        "confidence": confidence,
        "core_flows": core_flows,
        "evidence_map": {
            "core_tasks": task_evidence,
            "primary_users": role_evidence,
            "product_goal": goal_evidence,
            "risk_points": risk_evidence,
            "success_signal": success_evidence,
        },
        "evidence_summary": {
            "page_titles": page_titles,
            "prd_files_read": prd_files_read,
            "project_scan": {
                "page_names": project_signals.get("page_names", []),
                "project_path": project_signals.get("project_path", ""),
                "router_files": project_signals.get("router_files", []),
                "sampled_code_signals": project_signals.get("code_snippets", [])[:20],
                "tech_stack": project_signals.get("tech_stack", {}),
            },
            "routes": routes,
            "signal_files_read": signal_files_read,
            "signals": direct_signals,
        },
        "message": _build_message(source, confidence, status),
        "next_action": next_action,
        "ok": ok,
        "requires_core_flows": requires_core_flows,
        "source": source,
        "status": status,
    }


def main() -> int:
    args = _build_parser().parse_args()
    try:
        result = _build_result(args)
    except ValueError as exc:
        result = {
            "message": str(exc),
            "next_action": "request_business_context_clarification",
            "ok": False,
            "source": "unknown",
            "status": "needs_input",
        }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(result.get("message", ""))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
