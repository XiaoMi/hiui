# 更新日志

说明：
- 本文件由 `scripts/sync-changelog.mjs` 自动生成。
- 当前 changelog 维护一份持久化的每日变更历史；同一天内的多次修改会自动合并到同一个日期分组。
- 历史补录优先使用 Git 提交日期；Git 无记录时，回退到当前可见文件的真实修改时间（mtime）按天回填。
- 默认忽略 `.git/`、`outputs/`、`.DS_Store`、`.codex-write-check` 等隐藏或派生产物，避免噪声污染每日摘要。
- 日期区间中的空白天会显式展示“暂无可追溯修改记录”，用于区分“没有记录”与“没有该日期分组”。
- 当前 `hiui-design` skill 目录的历史仍属于最佳努力追溯；若某一天既无 Git 提交、又无可见文件时间戳，则无法还原更细的修改明细。
- 当前版本：`1.0.0`
- 如需在维护期自动刷新，可执行 `node scripts/sync-changelog.mjs --watch`。

## 2026-07-07

- 发布 `1.0.0`，生成对外交付归档（user archive） `outputs/archives/hiui-design.zip`，并回写 `outputs/RELEASE_REPORT.md`。
- 发布前校验通过：`verify-typical-page-maintainer-regressions`、`sync-manifest-docs --check`、`sync-hiui-v5-manifest --check`、`validate-hiui-v5-knowledge --strict-coverage`、`sync-hiui-v5-quick-reference --check`、`sync-hiui-v5-component-map --check`、`check-rules-coverage`、`check-distribution-boundary --scope maintainer`、`build-skill-archive`。
- 记录到同日文件变更：新增 56 个文件，更新 639 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 31 个文件，`docs/onboarding/` 接入文档 14 个文件，`docs/generation/` 生成说明 41 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 182 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 4 个文件，`templates/` 模板资产 98 个文件，`vendor/` 分发快照 2 个文件。

## 2026-07-06

- 版本快照：machine planning entry, fixture-backed public JSON contracts, runtime/preview/start contract fixtures, and global-sync-safe governance docs。

## 2026-07-05

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-04

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-03

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-02

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-07-01

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-30

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-29

- 记录到同日文件变更：新增 20 个文件，更新 568 个文件，删除 4 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 27 个文件，`docs/onboarding/` 接入文档 13 个文件，`docs/generation/` 生成说明 36 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 156 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 98 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-28

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-27

- 记录到同日文件变更：新增 11 个文件，更新 559 个文件，删除 21 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 26 个文件，`docs/onboarding/` 接入文档 12 个文件，`docs/generation/` 生成说明 36 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 149 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 111 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-26

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-25

- 记录到同日文件变更：新增 8 个文件，更新 580 个文件，删除 8 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 30 个文件，`docs/onboarding/` 接入文档 12 个文件，`docs/generation/` 生成说明 39 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 148 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 111 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-24

- 记录到同日文件变更：新增 35 个文件，更新 580 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 26 个文件，`docs/onboarding/` 接入文档 12 个文件，`docs/generation/` 生成说明 36 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 148 个文件，`examples/` 示例工程 67 个文件，`reference/` 参考资产 54 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 111 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-23

- 记录到同日文件变更：新增 9 个文件，更新 504 个文件，删除 3 个文件。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 15 个文件，`docs/onboarding/` 接入文档 10 个文件，`docs/generation/` 生成说明 34 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 113 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-22

- 记录到同日文件变更：新增 29 个文件，更新 539 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 15 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 34 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 132 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-21

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-20

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-19

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-18

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-17

- 记录到同日文件变更：新增 25 个文件，更新 509 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 11 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 34 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 107 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-16

- 记录到同日文件变更：更新 485 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 33 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 95 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-15

- 记录到同日文件变更：更新 485 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 33 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 95 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-14

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-13

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-12

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-11

- 记录到同日文件变更：新增 6 个文件，更新 485 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 33 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 95 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-10

- 记录到同日文件变更：新增 3 个文件，更新 479 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 33 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 89 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-09

- 记录到同日文件变更：新增 14 个文件，更新 477 个文件，删除 49 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 8 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 34 个文件，`docs/business-lines/` 业务线文档 23 个文件，`scripts/` 执行脚本 128 个文件，`examples/` 示例工程 66 个文件，`reference/` 参考资产 53 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 3 个文件。

## 2026-06-08

- 记录到同日文件变更：新增 49 个文件，更新 463 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 8 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 34 个文件，`docs/business-lines/` 业务线文档 23 个文件，`scripts/` 执行脚本 120 个文件，`examples/` 示例工程 64 个文件，`reference/` 参考资产 51 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-07

- 暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。

## 2026-06-06

- 记录到同日文件变更：新增 11 个文件，更新 462 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 33 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 76 个文件，`examples/` 示例工程 64 个文件，`reference/` 参考资产 51 个文件，`manifests/` 清单定义 3 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-05

- 记录到同日文件变更：新增 1 个文件，更新 451 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 31 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 69 个文件，`examples/` 示例工程 64 个文件，`reference/` 参考资产 51 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-04

- 记录到同日文件变更：更新 450 个文件，删除 1 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 31 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 68 个文件，`examples/` 示例工程 64 个文件，`reference/` 参考资产 51 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

## 2026-06-03

- 记录到同日文件变更：新增 5 个文件，更新 451 个文件。
- 刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。
- 补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。
- 移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。
- 观察到同日规则资产变更：`archetypes/` 页壳画像 56 个文件，`agents/` agent 配置 1 个文件，`rules/` 规则层 7 个文件，`docs/onboarding/` 接入文档 11 个文件，`docs/generation/` 生成说明 31 个文件，`docs/business-lines/` 业务线文档 20 个文件，`scripts/` 执行脚本 68 个文件，`examples/` 示例工程 64 个文件，`reference/` 参考资产 51 个文件，`manifests/` 清单定义 1 个文件，`templates/` 模板资产 110 个文件，`vendor/` 分发快照 2 个文件。

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

- 版本文件：`rules/VERSION`（last-updated: 2026-07-06）
- 发布报告：`outputs/RELEASE_REPORT.md`（released-at: 2026-07-07T12:21:26.291Z）
- 每日历史：`outputs/CHANGELOG_HISTORY.json`（按天合并 Git / mtime 推导出的新增 / 更新 / 删除路径）
- 快照文件：`outputs/CHANGELOG_SNAPSHOT.json`
