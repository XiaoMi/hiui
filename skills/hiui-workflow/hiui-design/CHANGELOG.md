# 更新日志

说明：
- 本文件由 `scripts/sync-changelog.mjs` 自动生成。
- 当前 changelog 维护一份持久化的每日变更历史；同一天内的多次修改会自动合并到同一个日期分组。
- 历史补录优先使用 Git 提交日期；Git 无记录时，回退到当前可见文件的真实修改时间（mtime）按天回填。
- 默认忽略 `.git/`、`outputs/`、`.DS_Store`、`.codex-write-check` 等隐藏或派生产物，避免噪声污染每日摘要。
- 日期区间中的空白天会显式展示“暂无可追溯修改记录”，用于区分“没有记录”与“没有该日期分组”。
- 当前 `hiui-design` skill 目录的历史仍属于最佳努力追溯；若某一天既无 Git 提交、又无可见文件时间戳，则无法还原更细的修改明细。
- 当前版本：`1.0.5`
- 如需在维护期自动刷新，可执行 `node scripts/sync-changelog.mjs --watch`。

## 2026-07-20

- 版本快照：manual patch bump after aligning record-usage event with the current usage service contract。
- 记录到同日文件变更：更新 634 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 32 个文件，`docs/onboarding/` 接入文档 14 个文件，`docs/generation/` 生成说明 41 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 202 个文件，`examples/` 示例工程 68 个文件，`reference/` 参考资产 55 个文件，`manifests/` 清单定义 4 个文件，`templates/` 模板资产 98 个文件，`vendor/` 分发快照 2 个文件。

## 追溯来源

- 版本文件：`rules/VERSION`（last-updated: 2026-07-20）
- 发布报告：未检测到 `outputs/RELEASE_REPORT.md`
- 每日历史：`outputs/CHANGELOG_HISTORY.json`（按天合并 Git / mtime 推导出的新增 / 更新 / 删除路径）
- 快照文件：`outputs/CHANGELOG_SNAPSHOT.json`
