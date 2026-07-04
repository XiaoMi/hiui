# Manifest Layers

`manifests/` 现在承载两类机器事实：

1. 业务线 overlay
2. HiUI v5 组件事实层

它仍然不负责通用规则定义；通用规则、页型决策、contract 结构与 gate 仍以 `../rules/` 为准。

## 1. 业务线 overlay

当前生效的通用页型事实源是：

- `../rules/common.page-types.json`

当前脚本已经支持通过 `--line <line-id>` 叠加业务线 overlay。

overlay 查找顺序如下：

1. `manifests/business-lines/<line-id>.page-types.overlay.json`
2. `docs/business-lines/<line-id>/page-types.overlay.json`

后续如需继续扩展业务线模板，不建议直接把所有业务线特例继续堆进同一个 manifest；建议改为：

```text
manifests/
  business-lines/
    <line-id>.page-types.overlay.json
```

业务线层仍保持下面这条原则：

1. 保持 `--line <line-id>` 的调用方式不变
2. 运行时先加载 `../rules/common.page-types.json`
3. 再叠加 business-line overlay

不要把不同业务线规则混写进一个超大 manifest；保持通用层稳定，业务线层最小覆盖。

## 2. HiUI v5 组件事实层

HiUI v5 融入 `hiui-design` 后，组件知识不再只靠 markdown 协调，而是逐步下沉到这里的 facts 层。

当前建议保留两个文件作为核心 facts：

- `hiui-v5-semantic-roles.json`
  统一维护组件选型使用的语义角色枚举，避免不同文档继续各自发明 role 名称。
- `hiui-v5-components.json`
  维护组件名、导入源、上游文档路径、摘要、高频度、最小速查分组、主语义角色、禁用场景与替代候选。

这层 facts 只回答“组件是什么、优先做什么、不要做什么”，不回答：

- 什么时候进入非典型路径
- `layout strategy` / `layout archetype` 怎么判
- ownership / `white-body` / `main-scroll` 由谁承接
- kickoff 顺序和阶段 gate

这些仍然分别回到：

- `../rules/generation-rules.md`
- `../docs/generation/non-typical-pages.md`
- `../docs/generation/non-typical-component-routing.md`
- `../rules/validation-checklist.md`

## 当前阶段

通用页型事实层已经移到 `../rules/common.page-types.json`。

HiUI v5 facts 层已经进入完整 catalog 阶段：

- `hiui-v5-components.json` 已覆盖完整 upstream 组件目录
- `sync-hiui-v5-manifest.mjs` 负责从 upstream README 同步自动字段
- `sync-hiui-v5-component-map.mjs` 负责从 manifest 渲染完整组件图谱附录
- `sync-hiui-v5-quick-reference.mjs` 负责从 manifest 渲染最小速查组件清单
- `validate-hiui-v5-knowledge.mjs` 负责校验 facts、路由文档、kickoff 模板与最小速查之间的一致性

建议演进顺序固定为：

1. 先稳定 `hiui-v5-semantic-roles.json`
2. 再稳定 `hiui-v5-components.json` 的字段模型
3. 再让 markdown 文档尽量改成 manifest 驱动，而不是继续双写组件清单
4. 最后把 release / global sync 默认切到严格校验
