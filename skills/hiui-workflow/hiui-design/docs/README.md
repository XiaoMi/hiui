# hiui-design Docs

`docs/` 是解释层，不是默认决策层。

先读 [`../rules/QUICK-START.md`](../rules/QUICK-START.md)，只有在需要接入说明、页型正文或排障细节时再进入本目录。

- AI 默认先读 `../rules/`
- 人类需要背景、接入说明、页型专章或兼容模式细节时，再读 `docs/`
- 若 `docs/` 与 `rules/` 冲突，以 `rules/` 为准；若需要机器事实源，以 `../rules/common.page-types.json` 为准

## 入口分层

- `onboarding/`
  接入、宿主边界、框架适配与排障说明。
  其中 `onboarding/distribution-governance.md` 用于汇总 maintainer source / active source / global mirror / team package / open-source package 的官方仓位与流向定义；`../distribution-addresses.json` 是对应的机器可读地址草案。若与 `distribution-manifest.json`、`scripts/README.md`、`global-sync-workflow.md` 冲突，以那些真相源为准。
- `generation/`
  规则解释层。展开页型专章、共享规则、视觉基线与兼容说明。
  若未命中典型页型，优先进入 `generation/non-typical-pages.md`。
- `archetypes/`
  archetype 与 adapter contract 的解释层。机器事实源在 `../archetypes/`。
  其中 `source contract` 要回写到业务页面源码本身，不能只停留在 sidecar contract。
- `validation/`
  更完整的验收清单和人工 review 提示。
- `business-lines/`
  业务线 overlay 的解释性文档。
- `../examples/host-integration/`
  仅作参考或联调用基线，不是默认要同步进业务项目的正式源码；其中还包含通用 `数据可视化` 与 `异常反馈` 能力示例。
- `../examples/business-lines/`
  业务线专属示例层。只放稳定差异页；当前已落地 `after-sales` 与 `hr` 两条业务线 overlay。

## 人类推荐阅读顺序

1. `../rules/mode-selection.md`
2. `../rules/page-type-map.md`
3. `../rules/generation-rules.md`
4. `onboarding/install-and-host.md`
5. `onboarding/host-profiles.md`
6. `generation/figma-page-rules.md`
7. `generation/non-typical-pages.md`
8. `generation/non-typical-component-routing.md`
9. `generation/hiui-v5-component-map.md`
10. `generation/figma-pages/README.md`
11. `validation/checklist.md`

## 业务线扩展

当前 `generation/` 默认视为通用解释层。

如果后续新增零售、供应链、财务等业务线模板，请优先新增：

1. `business-lines/<line-id>/`
2. `../examples/business-lines/<line-id>/`
3. `../manifests/`

不要直接复制整套通用解释目录，也不要把业务线特例写回 `../rules/` 的通用规则里。
