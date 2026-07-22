# Dispatch Boundary

本文件冻结 `hiui-page-workflow` 与下游 skill 的调度边界，目标是把依赖面收缩到“可调度且稳定”的最小公开面，而不是追求“完全不看下游名字”。

## 编码前冻结清单

- `hiui-page-workflow` 必须依赖下游的能力标识、公开调度身份和 machine-public protocol。
- `hiui-page-workflow` 不得依赖下游 skill 的内部文件名、内部脚本名、内部目录名、内部 references 文档名或内部字段分组。
- 若下游只改内部命名，不应触发 `hiui-page-workflow` 的主流程、调度判断或 contract 文档改动。
- 若下游改公开 skill 身份，必须通过能力映射迁移或其他明确兼容方案保持调度稳定；若分发层真实支持 alias，可在该层承接兼容。
- 若某能力的 provider 发生变化，只更新能力映射和兼容说明；不要把 workflow 主流程改成依赖新的内部实现路径。
- 若 machine-public protocol 变化，必须显式更新 `hiui-page-workflow` 的消费逻辑与公开 contract，不能靠“名字没变”掩盖协议破坏。

## 正式边界表

| 层次 | `hiui-page-workflow` 是否可依赖 | 当前稳定标识 / 例子 | 变化时的处理要求 |
| --- | --- | --- | --- |
| 能力标识 | 是 | `requirements-refinement`、`page-planning-and-delivery`、`ux-walkthrough-review` | provider 可变，但必须更新能力映射；workflow 主流程不直接依赖 provider 内部实现 |
| 公开调度身份 | 是 | `hiui-refine`、`hiui-design`、`ux-walkthrough` | 可重命名，但必须提供迁移方案，避免 workflow 去猜测新名字 |
| machine-public protocol | 是 | `references/handoff-contract.md`、`hiui-design` 的 planner JSON 最小字段、`requiredActions` / `formalAcceptanceActions`、`uxGate` / `p0ScenarioCoverage` | 协议变化必须同步更新 contract 文档与消费逻辑 |
| 内部命名细节 | 否 | `references/hiui-handoff-template.md`、`scripts/plan-page-task.mjs`、`references-v2`、内部目录分层、内部字段分组 | 允许自由调整；只要公开面不变，就不应影响 workflow |

## 能力映射

| 能力标识 | 当前 canonical provider | `hiui-page-workflow` 允许消费的公开面 |
| --- | --- | --- |
| `requirements-refinement` | `hiui-refine` | 需求细化结果、页面清单、页面级提示词、HiUI 交接包、`requirementGate` / `generationInputGate` 状态 |
| `page-planning-and-delivery` | `hiui-design` | `plan-page-task` 对应的 machine-public planner 输出、`planSnapshot` 最小字段、`requiredActions`、`formalAcceptanceActions` |
| `ux-walkthrough-review` | `ux-walkthrough` | UX evidence gate、问题分级、报告产物、`uxGate` 与 P0 场景覆盖相关结构化结论 |

## 变更影响判定

以下变化通常不应影响 `hiui-page-workflow`：

- 下游 skill 改内部目录结构。
- 下游 skill 改内部脚本文件名。
- 下游 skill 拆分或重命名 references 文档。
- 下游 skill 增删内部字段分组，但未改公开 contract。

以下变化一定要显式处理：

- 公开 skill 身份变化，例如 `refine-product-requirements -> hiui-refine`。
- 能力映射变化，例如 `requirements-refinement` 不再由 `hiui-refine` 提供。
- machine-public protocol 变化，例如 planner JSON 必填字段或 handoff contract 字段语义变更。

## 维护要求

- `handoff-contract` 中的 `sourceSkill` 只记录公开调度身份，不记录内部脚本名、目录名或 references 文件名。
- `hiui-page-workflow` 调 `hiui-design` 时，只认 `plan-page-task` 这类 machine-public CLI 身份和它输出的结构化事实；不要把脚本文件路径写进 workflow 主流程。
- 当文档或实现需要新增下游依赖时，先判断它属于能力标识、公开调度身份、machine-public protocol 还是内部命名细节；只有前三类可以进入 workflow contract。
