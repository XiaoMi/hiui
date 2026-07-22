#!/usr/bin/env python3
"""
UX Walkthrough - 代码库扫描脚本
扫描前端项目，提取页面结构、路由、组件、样式文件信息。

用法: python3 scan-pages.py <项目路径> [--output pages.json]
"""

import os
import sys
import json
import re
from pathlib import Path

SKIP_WALK_DIRS = ("node_modules", ".git", "dist", "build", ".next", ".nuxt")


def _prune_walk_dirs(root: str, dirs: list[str], project_path: str) -> None:
    dirs[:] = [d for d in dirs if d not in SKIP_WALK_DIRS]
    rel = os.path.relpath(root, project_path)
    if rel in (".", "scripts"):
        dirs[:] = [d for d in dirs if d != "dev"]


def _is_skipped_repo_path(rel: str) -> bool:
    parts = Path(rel).parts
    return len(parts) >= 2 and parts[0] == "scripts" and parts[1] == "dev"

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
               "vant", "nutui", "@xiaomi/hiui"]
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
        _prune_walk_dirs(root, dirs, project_path)
        for f in files:
            fpath = os.path.join(root, f)
            rel = os.path.relpath(fpath, project_path)
            if _is_skipped_repo_path(rel):
                continue
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
        _prune_walk_dirs(root, dirs, project_path)
        dirs[:] = [d for d in dirs if d not in ("components", "hooks", "utils", "stores", "services")]
        rel = os.path.relpath(root, project_path)

        # 检查是否在页面目录下
        in_page_dir = any(rel.startswith(d) or rel.startswith(f"src/{d}") for d in page_dirs)

        for f in files:
            if re.search(r"\.[jt]sx?$", f) and not f.startswith("_") and not f.startswith("index."):
                fpath = os.path.join(root, f)
                rel_path = os.path.relpath(fpath, project_path)
                if _is_skipped_repo_path(rel_path):
                    continue
                pages.append({
                    "path": rel_path,
                    "is_page_dir": in_page_dir,
                    "name": f.rsplit(".", 1)[0]
                })

    return pages


def find_style_files(project_path):
    """查找样式文件"""
    style_exts = {".css", ".scss", ".less", ".styl", ".stylus"}
    styles = []

    for root, dirs, files in os.walk(project_path):
        _prune_walk_dirs(root, dirs, project_path)
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in style_exts:
                fpath = os.path.join(root, f)
                rel = os.path.relpath(fpath, project_path)
                if _is_skipped_repo_path(rel):
                    continue
                styles.append(rel)

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


def main():
    if len(sys.argv) < 2:
        print("用法: python3 scan-pages.py <项目路径> [--output pages.json]")
        sys.exit(1)

    project_path = sys.argv[1]
    output_file = "pages.json"

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_file = sys.argv[idx + 1]

    if not os.path.isdir(project_path):
        print(f"错误: {project_path} 不是有效目录")
        sys.exit(1)

    print(f"🔍 扫描项目: {project_path}")

    tech = detect_tech_stack(project_path)
    print(f"  技术栈: {tech['framework']} | UI: {tech['ui_lib']} | CSS: {tech['css_solution']}")

    router_files = find_router_files(project_path)
    print(f"  路由文件: {len(router_files)} 个")

    pages = find_page_components(project_path)
    print(f"  页面组件: {len(pages)} 个")

    styles = find_style_files(project_path)
    print(f"  样式文件: {len(styles)} 个")

    components = find_component_files(project_path)
    print(f"  通用组件: {len(components)} 个")

    result = {
        "project_path": os.path.abspath(project_path),
        "tech_stack": tech,
        "router_files": router_files,
        "pages": pages,
        "style_files": styles,
        "components": components,
        "summary": {
            "total_pages": len(pages),
            "total_styles": len(styles),
            "total_components": len(components)
        }
    }

    output_path = os.path.join(project_path, output_file) if not os.path.isabs(output_file) else output_file
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 扫描完成，结果已写入: {output_path}")
    print(json.dumps(result["summary"], ensure_ascii=False))


if __name__ == "__main__":
    main()
