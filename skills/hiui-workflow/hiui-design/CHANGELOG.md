# 更新日志

说明：
- 本文件由 `scripts/sync-changelog.mjs` 自动生成。
- 当前 changelog 维护一份持久化的每日变更历史；同一天内的多次修改会自动合并到同一个日期分组。
- 历史补录优先使用 Git 提交日期；Git 无记录时，回退到当前可见文件的真实修改时间（mtime）按天回填。
- 默认忽略 `.git/`、`outputs/`、`.DS_Store`、`.codex-write-check` 等隐藏或派生产物，避免噪声污染每日摘要。
- 日期区间中的空白天会显式展示“暂无可追溯修改记录”，用于区分“没有记录”与“没有该日期分组”。
- 当前 `hiui-design` skill 目录的历史仍属于最佳努力追溯；若某一天既无 Git 提交、又无可见文件时间戳，则无法还原更细的修改明细。
- 当前版本：`1.2.2`
- 如需在维护期自动刷新，可执行 `node scripts/sync-changelog.mjs --watch`。

## 2026-08-04

- 发布 `1.2.2`，生成对外交付归档（user archive） `outputs/archives/hiui-design.zip`，并回写 `outputs/RELEASE_REPORT.md`。
- 发布前校验通过：`verify-typical-page-maintainer-regressions`、`sync-manifest-docs --check`、`sync-hiui-v5-manifest --check`、`validate-hiui-v5-knowledge --strict-coverage`、`sync-hiui-v5-quick-reference --check`、`sync-hiui-v5-component-map --check`、`check-rules-coverage`、`check-distribution-boundary --scope maintainer`、`build-skill-archive`。
- 版本快照：sync profile closure contract, tarball hash manifest, and three-chain bootstrap gate hardening。
- 记录到同日文件变更：新增 32 个文件，更新 80 个文件。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`rules/` 规则层 8 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 8 个文件，`scripts/` 执行脚本 64 个文件，`vendor/` 分发快照 1 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-08-03

- 记录到同日文件变更：新增 67 个文件，更新 111 个文件，删除 1 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 11 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 7 个文件，`docs/generation/` 生成说明 5 个文件，`docs/business-lines/` 业务线文档 9 个文件，`scripts/` 执行脚本 102 个文件，`vendor/` 分发快照 1 个文件。

## 2026-08-02

- 记录到同日文件变更：新增 70 个文件，更新 196 个文件，删除 19 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 2 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 25 个文件，`docs/onboarding/` 接入文档 6 个文件，`docs/generation/` 生成说明 14 个文件，`docs/business-lines/` 业务线文档 9 个文件，`scripts/` 执行脚本 166 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 26 个文件，`vendor/` 分发快照 2 个文件。

## 2026-08-01

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-31

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-30

- 记录到同日文件变更：新增 62 个文件，更新 780 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 35 个文件，`docs/onboarding/` 接入文档 17 个文件，`docs/generation/` 生成说明 41 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 235 个文件，`examples/` 示例工程 68 个文件，`reference/` 参考资产 57 个文件，`manifests/` 清单定义 4 个文件，`templates/` 模板资产 148 个文件，`vendor/` 分发快照 3 个文件。

## 2026-07-29

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-28

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-27

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-26

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-25

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-24

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-23

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-22

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-21

- 记录到同日文件变更：更新 4 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 1 个文件，`docs/generation/` 生成说明 3 个文件。

## 2026-07-20

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-19

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-18

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-17

- 记录到同日文件变更：新增 64 个文件，更新 174 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 22 个文件，`docs/onboarding/` 接入文档 2 个文件，`docs/generation/` 生成说明 10 个文件，`scripts/` 执行脚本 82 个文件，`reference/` 参考资产 4 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 33 个文件。

## 2026-07-16

- 记录到同日文件变更：更新 51 个文件。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`rules/` 规则层 5 个文件，`docs/generation/` 生成说明 3 个文件，`scripts/` 执行脚本 24 个文件，`reference/` 参考资产 2 个文件，`templates/` 模板资产 9 个文件。

## 2026-07-15

- 记录到同日文件变更：更新 647 个文件。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 55 个文件，`rules/` 规则层 16 个文件，`docs/onboarding/` 接入文档 14 个文件，`docs/generation/` 生成说明 33 个文件，`scripts/` 执行脚本 162 个文件，`examples/` 示例工程 51 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 130 个文件，`vendor/` 分发快照 2 个文件。

## 2026-07-14

- 记录到同日文件变更：新增 328 个文件，更新 135 个文件，删除 224 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 11 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 23 个文件，`docs/onboarding/` 接入文档 10 个文件，`docs/generation/` 生成说明 24 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 170 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 4 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 31 个文件。

## 2026-07-13

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-12

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-11

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-10

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-09

- 记录到同日文件变更：新增 10 个文件，更新 63 个文件。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`rules/` 规则层 13 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 8 个文件，`docs/business-lines/` 业务线文档 9 个文件，`scripts/` 执行脚本 28 个文件，`examples/` 示例工程 3 个文件，`reference/` 参考资产 3 个文件，`templates/` 模板资产 3 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-07-08

- 记录到同日文件变更：新增 2 个文件，更新 18 个文件，删除 1 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 2 个文件，`docs/generation/` 生成说明 2 个文件，`scripts/` 执行脚本 15 个文件，`templates/` 模板资产 1 个文件。

## 2026-07-07

- 记录到同日文件变更：新增 2 个文件，更新 41 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 7 个文件，`docs/generation/` 生成说明 4 个文件，`scripts/` 执行脚本 28 个文件，`examples/` 示例工程 1 个文件，`reference/` 参考资产 1 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-07-06

- 记录到同日文件变更：新增 85 个文件，更新 113 个文件，删除 2 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`rules/` 规则层 11 个文件，`docs/onboarding/` 接入文档 6 个文件，`docs/generation/` 生成说明 15 个文件，`scripts/` 执行脚本 95 个文件，`examples/` 示例工程 14 个文件，`reference/` 参考资产 11 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 2 个文件，`vendor/` 分发快照 1 个文件。

## 2026-07-05

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-04

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-03

- 记录到同日文件变更：新增 10 个文件，更新 74 个文件，删除 44 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 8 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 6 个文件，`scripts/` 执行脚本 77 个文件，`manifests/` 清单定义 1 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-07-02

- 记录到同日文件变更：新增 20 个文件，更新 57 个文件，删除 20 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 6 个文件，`scripts/` 执行脚本 49 个文件，`manifests/` 清单定义 1 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-07-01

- 记录到同日文件变更：新增 3 个文件，更新 25 个文件，删除 12 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 2 个文件，`scripts/` 执行脚本 23 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-30

- 记录到同日文件变更：新增 8 个文件，更新 21 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 4 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 3 个文件，`scripts/` 执行脚本 13 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-29

- 记录到同日文件变更：新增 4 个文件，更新 5 个文件，删除 44 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 观察到同日规则资产变更：`docs/onboarding/` 接入文档 4 个文件，`scripts/` 执行脚本 38 个文件。

## 2026-06-28

- 记录到同日文件变更：新增 4 个文件，更新 37 个文件，删除 16 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 4 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 1 个文件，`scripts/` 执行脚本 26 个文件，`templates/` 模板资产 18 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-27

- 记录到同日文件变更：新增 68 个文件，更新 95 个文件，删除 23 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 19 个文件，`docs/onboarding/` 接入文档 5 个文件，`docs/generation/` 生成说明 10 个文件，`docs/business-lines/` 业务线文档 3 个文件，`scripts/` 执行脚本 53 个文件，`examples/` 示例工程 3 个文件，`reference/` 参考资产 3 个文件，`templates/` 模板资产 37 个文件。

## 2026-06-26

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-25

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-24

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-23

- 记录到同日文件变更：新增 12 个文件，更新 27 个文件。
- 观察到同日规则资产变更：`agents/` agent 配置 1 个文件，`rules/` 规则层 5 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 1 个文件，`scripts/` 执行脚本 19 个文件，`manifests/` 清单定义 1 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-22

- 记录到同日文件变更：新增 27 个文件，更新 21 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 6 个文件，`scripts/` 执行脚本 41 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-21

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-20

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-19

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-18

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-17

- 记录到同日文件变更：新增 27 个文件，更新 30 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 10 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 6 个文件，`scripts/` 执行脚本 27 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-16

- 记录到同日文件变更：更新 8 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 4 个文件，`docs/generation/` 生成说明 2 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-15

- 记录到同日文件变更：新增 3 个文件，更新 52 个文件。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`rules/` 规则层 7 个文件，`docs/generation/` 生成说明 4 个文件，`docs/business-lines/` 业务线文档 9 个文件，`scripts/` 执行脚本 18 个文件，`examples/` 示例工程 7 个文件，`reference/` 参考资产 4 个文件，`templates/` 模板资产 4 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-14

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-13

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-12

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-11

- 记录到同日文件变更：新增 5 个文件，更新 60 个文件。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 1 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 5 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 6 个文件，`docs/business-lines/` 业务线文档 9 个文件，`scripts/` 执行脚本 22 个文件，`examples/` 示例工程 6 个文件，`reference/` 参考资产 3 个文件，`templates/` 模板资产 10 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-10

- 记录到同日文件变更：新增 1 个文件，更新 42 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`rules/` 规则层 3 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 8 个文件，`scripts/` 执行脚本 17 个文件，`examples/` 示例工程 2 个文件，`reference/` 参考资产 2 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 2 个文件，`vendor/` 分发快照 1 个文件。

## 2026-06-09

- 记录到同日文件变更：新增 13 个文件，更新 165 个文件，删除 48 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 10 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 8 个文件，`docs/generation/` 生成说明 14 个文件，`docs/business-lines/` 业务线文档 10 个文件，`scripts/` 执行脚本 84 个文件，`examples/` 示例工程 30 个文件，`reference/` 参考资产 26 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 18 个文件，`vendor/` 分发快照 3 个文件。

## 2026-06-08

- 记录到同日文件变更：新增 61 个文件，更新 93 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 11 个文件，`rules/` 规则层 5 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 15 个文件，`docs/business-lines/` 业务线文档 16 个文件，`scripts/` 执行脚本 83 个文件，`examples/` 示例工程 3 个文件，`reference/` 参考资产 3 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 4 个文件。

## 2026-06-07

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-06

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-05

- 记录到同日文件变更：更新 5 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 1 个文件，`docs/onboarding/` 接入文档 1 个文件，`scripts/` 执行脚本 1 个文件，`examples/` 示例工程 1 个文件，`reference/` 参考资产 1 个文件。

## 2026-06-04

- 记录到同日文件变更：更新 18 个文件，删除 1 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 观察到同日规则资产变更：`agents/` agent 配置 1 个文件，`rules/` 规则层 1 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 1 个文件，`scripts/` 执行脚本 3 个文件，`examples/` 示例工程 3 个文件，`reference/` 参考资产 3 个文件。

## 2026-06-03

- 记录到同日文件变更：新增 3 个文件，更新 40 个文件，删除 1 个文件。
- 观察到同日规则资产变更：`agents/` agent 配置 1 个文件，`rules/` 规则层 4 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 4 个文件，`scripts/` 执行脚本 13 个文件，`examples/` 示例工程 8 个文件，`reference/` 参考资产 8 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-02

- 记录到同日文件变更：新增 7 个文件，更新 50 个文件，删除 1 个文件。
- 观察到同日规则资产变更：`agents/` agent 配置 1 个文件，`rules/` 规则层 4 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 6 个文件，`scripts/` 执行脚本 33 个文件，`examples/` 示例工程 1 个文件，`reference/` 参考资产 1 个文件，`templates/` 模板资产 9 个文件，`SKILL.md` skill 入口 1 个文件。

## 2026-06-01

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-31

- 记录到同日文件变更：新增 17 个文件，更新 20 个文件。
- 观察到同日规则资产变更：`agents/` agent 配置 1 个文件，`rules/` 规则层 3 个文件，`docs/onboarding/` 接入文档 1 个文件，`docs/generation/` 生成说明 3 个文件，`scripts/` 执行脚本 19 个文件。

## 2026-05-30

- 记录到同日文件变更：更新 6 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 2 个文件，`docs/generation/` 生成说明 4 个文件。

## 2026-05-29

- 记录到同日文件变更：新增 1 个文件，更新 25 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 5 个文件，`docs/generation/` 生成说明 7 个文件，`scripts/` 执行脚本 7 个文件，`examples/` 示例工程 2 个文件，`reference/` 参考资产 2 个文件，`templates/` 模板资产 3 个文件。

## 2026-05-28

- 记录到同日文件变更：新增 1 个文件，更新 19 个文件，删除 10 个文件。
- 观察到同日规则资产变更：`rules/` 规则层 1 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 4 个文件，`scripts/` 执行脚本 17 个文件。

## 2026-05-27

- 记录到同日文件变更：新增 56 个文件，更新 85 个文件，删除 4 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 4 个文件，`docs/generation/` 生成说明 17 个文件，`scripts/` 执行脚本 36 个文件，`examples/` 示例工程 9 个文件，`reference/` 参考资产 10 个文件，`templates/` 模板资产 42 个文件。

## 2026-05-26

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-25

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-24

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-23

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-22

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-21

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-20

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-19

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-18

- 记录到同日文件变更：新增 2 个文件，更新 29 个文件，删除 4 个文件。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`docs/onboarding/` 接入文档 2 个文件，`docs/generation/` 生成说明 4 个文件，`scripts/` 执行脚本 7 个文件，`examples/` 示例工程 5 个文件，`reference/` 参考资产 6 个文件，`templates/` 模板资产 6 个文件。

## 2026-05-17

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-16

- 记录到同日文件变更：新增 26 个文件，更新 49 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`rules/` 规则层 9 个文件，`docs/onboarding/` 接入文档 3 个文件，`docs/generation/` 生成说明 15 个文件，`scripts/` 执行脚本 17 个文件，`templates/` 模板资产 22 个文件。

## 2026-05-15

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-14

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-05-13

- 记录到同日文件变更：新增 382 个文件，删除 1 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 10 个文件，`docs/generation/` 生成说明 28 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 43 个文件，`examples/` 示例工程 61 个文件，`reference/` 参考资产 46 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 79 个文件，`vendor/` 分发快照 2 个文件。

## 追溯来源

- 版本文件：`rules/VERSION`（last-updated: 2026-08-04）
- 发布报告：`outputs/RELEASE_REPORT.md`（released-at: 2026-08-04T07:50:31.187Z）
- 每日历史：`outputs/CHANGELOG_HISTORY.json`（按天合并 Git / mtime 推导出的新增 / 更新 / 删除路径）
- 快照文件：`outputs/CHANGELOG_SNAPSHOT.json`
