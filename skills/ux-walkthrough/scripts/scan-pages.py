#!/usr/bin/env python3
"""
UX Walkthrough - 代码库扫描脚本
扫描前端项目，提取页面结构、路由、组件、样式文件信息。

用法: python3 scan-pages.py <项目路径> [--entry packages/web] [--output pages.json]
"""

import argparse
import os
import sys
import json
import re
import tempfile
from pathlib import Path

SKIP_DIRS = ("node_modules", ".git", "dist", "build", ".next", ".nuxt")


def detect_tech_stack(project_path):
    """识别技术栈"""
    pkg_json = os.path.join(project_path, "package.json")
    tech = {"framework": "unknown", "ui_lib": None, "css_solution": None}

    if not os.path.exists(pkg_json):
        # 检查是否为小程序项目
        if os.path.exists(os.path.join(project_path, "app.json")):
            tech["framework"] = "miniprogram"
        return tech

    with open(pkg_json, "r", encoding="utf-8") as f:
        try:
            pkg = json.load(f)
        except json.JSONDecodeError:
            return tech

    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}

    # 框架识别
    if "next" in deps:
        tech["framework"] = "next.js"
    elif "nuxt" in deps or "@nuxt" in deps:
        tech["framework"] = "nuxt"
    elif "react" in deps:
        tech["framework"] = "react"
    elif "vue" in deps:
        tech["framework"] = "vue"
    elif "@angular/core" in deps:
        tech["framework"] = "angular"
    elif "taro" in deps:
        tech["framework"] = "taro"
    elif "uni-app" in deps or "@dcloudio/uni" in deps:
        tech["framework"] = "uni-app"

    # UI 组件库
    ui_libs = ["antd", "@ant-design", "@arco-design", "@element-plus",
               "@element-ui", "@mui", "@chakra-ui", "@mantine",
               "vant", "nutui", "@hi-ui/hiui"]
    for lib in ui_libs:
        if any(lib in d for d in deps):
            tech["ui_lib"] = lib
            break

    # CSS 方案
    if "tailwindcss" in deps:
        tech["css_solution"] = "tailwind"
    elif "sass" in deps or "scss" in deps or "node-sass" in deps:
        tech["css_solution"] = "sass"
    elif "less" in deps:
        tech["css_solution"] = "less"
    else:
        tech["css_solution"] = "css"

    return tech


def find_router_files(project_path):
    """查找路由配置文件"""
    router_patterns = [
        r"router\.[jt]sx?$",
        r"routes?\.[jt]sx?$",
        r"router/index\.[jt]sx?$",
        r"src/router\.[jt]sx?$",
        r"src/routes?\.[jt]sx?$",
        r"app\.json$",  # 小程序
    ]
    found = []
    for root, dirs, files in os.walk(project_path):
        # 跳过 node_modules 和 .git
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            fpath = os.path.join(root, f)
            rel = os.path.relpath(fpath, project_path)
            for pattern in router_patterns:
                if re.search(pattern, rel):
                    found.append(rel)
                    break
    return found


def find_page_components(project_path):
    """查找页面级组件"""
    page_dirs = ["pages", "views", "scenes", "routes", "screens", "app"]
    pages = []

    src_path = os.path.join(project_path, "src")
    search_root = src_path if os.path.exists(src_path) else project_path

    for root, dirs, files in os.walk(search_root):
        dirs[:] = [d for d in dirs if d not in (*SKIP_DIRS, "components", "hooks", "utils", "stores", "services")]
        rel = os.path.relpath(root, project_path)

        # 检查是否在页面目录下
        in_page_dir = any(rel.startswith(d) or rel.startswith(f"src/{d}") for d in page_dirs)

        for f in files:
            if re.search(r"\.[jt]sx?$", f) and not f.startswith("_") and not f.startswith("index."):
                fpath = os.path.join(root, f)
                pages.append({
                    "path": os.path.relpath(fpath, project_path),
                    "is_page_dir": in_page_dir,
                    "name": f.rsplit(".", 1)[0]
                })

    return pages


def find_style_files(project_path):
    """查找样式文件"""
    style_exts = {".css", ".scss", ".less", ".styl", ".stylus"}
    styles = []

    for root, dirs, files in os.walk(project_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in style_exts:
                fpath = os.path.join(root, f)
                styles.append(os.path.relpath(fpath, project_path))

    return styles


def find_component_files(project_path):
    """查找通用组件"""
    components = []
    comp_dirs = ["components", "shared", "common"]

    src_path = os.path.join(project_path, "src")
    search_root = src_path if os.path.exists(src_path) else project_path

    for comp_dir in comp_dirs:
        dir_path = os.path.join(search_root, comp_dir)
        if not os.path.isdir(dir_path):
            continue
        for root, dirs, files in os.walk(dir_path):
            dirs[:] = [d for d in dirs if d != "node_modules"]
            for f in files:
                if re.search(r"\.[jt]sx?$", f):
                    fpath = os.path.join(root, f)
                    components.append(os.path.relpath(fpath, project_path))

    return components


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return ""


def _extract_import_aliases(file_path: Path) -> dict[str, str]:
    text = _read_text(file_path)
    imports: dict[str, str] = {}
    for alias, rel_path in re.findall(r'import\s+([A-Za-z0-9_]+)\s+from\s+[\'"](.+?)[\'"]', text):
        imports[alias] = rel_path
    return imports


def _extract_route_entries(project_path: str, router_files: list[str]) -> list[dict]:
    entries: list[dict] = []
    route_pattern = re.compile(r'path\s*:\s*[\'"`]([^\'"`]+)[\'"`]')
    component_patterns = [
        re.compile(r'element\s*:\s*<\s*([A-Za-z0-9_]+)'),
        re.compile(r'element\s*:\s*["\']?([A-Za-z0-9_]+)["\']?'),
        re.compile(r'component\s*:\s*([A-Za-z0-9_]+)'),
        re.compile(r'component\s*:\s*\(\s*\)\s*=>\s*import\([\'"](.+?)[\'"]\)'),
        re.compile(r'import\([\'"](.+?)[\'"]\)'),
    ]

    for rel_path in router_files:
        file_path = Path(project_path) / rel_path
        text = _read_text(file_path)
        if not text:
            continue
        imports = _extract_import_aliases(file_path)
        route_paths = route_pattern.findall(text)
        if not route_paths:
            continue

        component_hints: list[tuple[str, str]] = []
        for pattern in component_patterns:
            for match in pattern.findall(text):
                if isinstance(match, tuple):
                    continue
                hint = match.strip()
                if not hint:
                    continue
                import_hint = imports.get(hint, "") if hint in imports else (hint if "/" in hint or hint.startswith(".") else "")
                component_hints.append((hint, import_hint))

        if not component_hints:
            component_hints = [("", "")]

        for index, route_path in enumerate(route_paths):
            hint, import_hint = component_hints[index] if index < len(component_hints) else component_hints[-1]
            entries.append(
                {
                    "route_path": route_path,
                    "route_file": rel_path,
                    "component_hint": hint,
                    "import_path_hint": import_hint,
                }
            )
    return entries


def _normalize_component_name(value: str) -> str:
    text = value.strip()
    if not text:
        return ""
    name = Path(text).stem if "/" in text else text
    return re.sub(r"[^a-z0-9]+", "", name.lower())


def _guess_route_from_page_path(path: str) -> str:
    parts = list(Path(path).parts)
    if "src" in parts:
        parts = parts[parts.index("src") + 1 :]
    if parts and parts[0] in {"pages", "views", "scenes", "routes", "screens", "app"}:
        parts = parts[1:]
    if not parts:
        return "/"

    filename = Path(parts[-1]).stem.lower()
    parent_parts = [part.lower() for part in parts[:-1]]
    if filename != "index":
        parent_parts.append(filename)

    route_parts = [part for part in parent_parts if part and part not in {"page"}]
    return "/" + "/".join(route_parts) if route_parts else "/"


def _build_page_catalog(pages: list[dict], route_entries: list[dict]) -> tuple[list[dict], list[dict]]:
    page_catalog: list[dict] = []
    unresolved_routes: list[dict] = []
    pages_by_name: dict[str, list[dict]] = {}
    pages_by_guess: dict[str, list[dict]] = {}

    for page in pages:
        page_name = _normalize_component_name(page.get("name", ""))
        guessed_route = _guess_route_from_page_path(page["path"])
        enriched = {
            "name": page.get("name", ""),
            "page_file": page["path"],
            "guessed_route": guessed_route,
            "is_page_dir": bool(page.get("is_page_dir", False)),
        }
        if page_name:
            pages_by_name.setdefault(page_name, []).append(enriched)
        pages_by_guess.setdefault(guessed_route, []).append(enriched)

    used_page_files: set[str] = set()
    for route in route_entries:
        route_path = route.get("route_path", "")
        import_hint = route.get("import_path_hint", "")
        component_hint = route.get("component_hint", "")
        normalized_name = _normalize_component_name(component_hint or import_hint)
        matched_page = None

        if normalized_name and pages_by_name.get(normalized_name):
            matched_page = pages_by_name[normalized_name][0]
        elif route_path and pages_by_guess.get(route_path):
            matched_page = pages_by_guess[route_path][0]

        if matched_page:
            used_page_files.add(matched_page["page_file"])
            page_catalog.append(
                {
                    "name": matched_page["name"] or component_hint or Path(matched_page["page_file"]).stem,
                    "page_file": matched_page["page_file"],
                    "route_path": route_path,
                    "route_file": route.get("route_file", ""),
                    "source": "route_match",
                    "component_hint": component_hint,
                }
            )
        else:
            unresolved_routes.append(route)

    for page in pages:
        if page["path"] in used_page_files:
            continue
        page_catalog.append(
            {
                "name": page.get("name", ""),
                "page_file": page["path"],
                "route_path": _guess_route_from_page_path(page["path"]),
                "route_file": "",
                "source": "page_file_guess",
                "component_hint": "",
            }
        )

    page_catalog.sort(key=lambda item: (item["route_path"], item["page_file"]))
    return page_catalog, unresolved_routes


def _build_parser():
    parser = argparse.ArgumentParser(description="扫描前端项目，提取页面结构、路由、组件、样式文件信息。")
    parser.add_argument("project_path")
    parser.add_argument("--entry", default="")
    parser.add_argument("--output", default="")
    parser.add_argument("--json", action="store_true")
    return parser


def _resolve_scan_root(project_path: Path, entry: str) -> Path:
    entry_text = entry.strip()
    if not entry_text:
        return project_path
    entry_path = Path(entry_text).expanduser()
    return entry_path if entry_path.is_absolute() else project_path / entry_text


def _resolve_output_path(project_path: Path, output: str, json_mode: bool) -> Path | None:
    output_text = output.strip()
    if output_text:
        output_path = Path(output_text).expanduser()
        return output_path if output_path.is_absolute() else project_path / output_text
    if json_mode:
        return None
    with tempfile.NamedTemporaryFile(prefix="uxw-scan-", suffix=".json", delete=False) as handle:
        return Path(handle.name)


def main():
    args = _build_parser().parse_args()
    project_path = Path(args.project_path).expanduser().resolve()
    scan_root = _resolve_scan_root(project_path, args.entry).resolve()

    if not project_path.is_dir():
        if args.json:
            print(json.dumps({"message": f"错误: {project_path} 不是有效目录", "ok": False, "status": "failed"}, ensure_ascii=False, indent=2))
        else:
            print(f"错误: {project_path} 不是有效目录")
        sys.exit(1)
    if not scan_root.is_dir():
        if args.json:
            print(json.dumps({"message": f"错误: {scan_root} 不是有效入口目录", "ok": False, "status": "failed"}, ensure_ascii=False, indent=2))
        else:
            print(f"错误: {scan_root} 不是有效入口目录")
        sys.exit(1)

    tech = detect_tech_stack(str(scan_root))
    router_files = find_router_files(str(scan_root))
    pages = find_page_components(str(scan_root))
    styles = find_style_files(str(scan_root))
    components = find_component_files(str(scan_root))
    route_entries = _extract_route_entries(str(scan_root), router_files)

    prefix = ""
    if scan_root != project_path:
        try:
            prefix = f"{scan_root.relative_to(project_path).as_posix().rstrip('/')}/"
        except ValueError:
            prefix = ""
    normalized_router_files = [prefix + item for item in router_files]
    normalized_pages = [{**item, "path": prefix + item["path"]} for item in pages]
    normalized_styles = [prefix + item for item in styles]
    normalized_components = [prefix + item for item in components]
    normalized_route_entries = [
        {
            **item,
            "route_file": prefix + item["route_file"] if item.get("route_file") else "",
        }
        for item in route_entries
    ]
    page_catalog, unresolved_routes = _build_page_catalog(normalized_pages, normalized_route_entries)

    result = {
        "entry": args.entry.strip(),
        "project_path": str(project_path),
        "scan_root": str(scan_root),
        "tech_stack": tech,
        "router_files": normalized_router_files,
        "route_entries": normalized_route_entries,
        "page_catalog": page_catalog,
        "pages": normalized_pages,
        "style_files": normalized_styles,
        "components": normalized_components,
        "unresolved_routes": unresolved_routes,
        "summary": {
            "total_route_entries": len(normalized_route_entries),
            "total_page_catalog": len(page_catalog),
            "total_pages": len(normalized_pages),
            "total_router_files": len(normalized_router_files),
            "total_styles": len(normalized_styles),
            "total_components": len(normalized_components)
        }
    }

    output_path = _resolve_output_path(project_path, args.output, args.json)
    if output_path is not None:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        result["output_path"] = str(output_path)
    else:
        result["output_path"] = ""

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"🔍 扫描项目: {project_path}")
        if scan_root != project_path:
            print(f"  扫描入口: {scan_root}")
        print(f"  技术栈: {tech['framework']} | UI: {tech['ui_lib']} | CSS: {tech['css_solution']}")
        print(f"  路由文件: {len(normalized_router_files)} 个")
        print(f"  路由线索: {len(normalized_route_entries)} 条")
        print(f"  页面清单: {len(page_catalog)} 条")
        print(f"  页面组件: {len(normalized_pages)} 个")
        print(f"  样式文件: {len(normalized_styles)} 个")
        print(f"  通用组件: {len(normalized_components)} 个")
        if output_path is not None:
            print(f"\n✅ 扫描完成，结果已写入: {output_path}")
        print(json.dumps(result["summary"], ensure_ascii=False))


if __name__ == "__main__":
    main()
