# Final Report Template

最终回复保持短而完整，不要把 `hiui-design` 和 `ux-walkthrough` 的原始日志整段贴出。

## 推荐结构

```markdown
已完成端到端页面交付。

门禁状态：
- requirementGate：<needs-confirmation | requirements-confirmed | assumption-authorized | blocked>
- generationInputGate：<confirmed | assumption-authorized | blocked | 未执行>
- uxGate：<ux-smoke | ux-standard | ux-formal | 未执行>，证据状态 <ready | insufficient | blocked | 未执行>

需求细化：
- 交付模式：<quick-refine | hiui-handoff | full-prd-to-generation | 未执行>
- MVP 范围：<一句话摘要>
- 页面清单：<P01 页面名，P02 页面名...>
- 待确认：<无 | 待确认项>

页面：<页面名称或路径>
页面类型：<pageType>
Workflow level：<quick-preview | standard-e2e | formal-e2e>

工程验收：
- <command>：<passed | failed | skipped | blocked>，<简短说明>
- <command>：<passed | failed | skipped | blocked>，<简短说明>

UX 验收：
- 模式：<ux-smoke | ux-standard | ux-formal>
- P0 场景覆盖：<已覆盖 | 未覆盖及原因 | 不适用>
1. [P1] <问题标题>
   位置：<位置>
   问题：<一句话说明>
   处理：<已修复 | 建议 | 待确认>

P0 场景覆盖矩阵：
| 场景 | 入口 | 主路径 | 关键数据 | 权限 | 状态 | 防错 | 反馈恢复 | 结论 |
|---|---|---|---|---|---|---|---|---|
| S01 <场景名> | <passed/failed/unknown> | <passed/failed/unknown> | <passed/failed/unknown> | <passed/failed/unknown> | <passed/failed/unknown> | <passed/failed/unknown> | <passed/failed/unknown> | <结论> |

效果对比：
- 修复前：<before-fix 截图路径或未生成原因>
- 修复后：<after-fix 截图路径或未生成原因>
- 变化：<一句话说明本次修复带来的可见变化>

已修复：
- <修复项>

遗留风险：
- <风险或待确认项>

报告：
- <docx 报告路径，若有>
```

## 写法要求

- 工程验收结果优先列失败和阻断项。
- 执行过需求细化时，必须说明交付模式、MVP 范围、页面清单摘要和待确认项。
- 进入页面生成前，必须说明 `generationInputGate` 是用户确认还是用户授权假设；不能只写“已确认”。
- 若需求阶段使用了推荐假设继续推进，最终报告必须把这些假设列为遗留风险或待确认项。
- `standard-e2e` 和 `formal-e2e` 必须说明 P0 场景覆盖结果；若未覆盖，不能声称完成结构化 UX 验收。
- UX 问题按 P0、P1、P2 排序。
- 没有发现问题时，明确写“本次未发现 P0/P1 体验问题”，并说明覆盖了哪些 P0 场景和证据。
- 若 UX 只发现 P2 问题，必须说明 P0/P1 核心路径已检查且未发现问题的依据。
- 有 P0 / P1 修复时，必须列出修复前和修复后的截图路径；有多组状态时只列最关键的对比，其余放报告或附件。
- 截图路径必须指向可查看的清晰原图；报告内缩略图不能替代原图路径。
- 无法生成 before / after 对比时，必须说明缺失的是修复前、修复后、登录态、数据状态还是浏览器访问。
- 生成了 docx 报告时，给出本地报告路径。
- 没有生成 docx 时，说明原因：例如当前是 `quick-preview`、`ux-standard`，或用户未要求完整 UX review。
- 未运行的命令或未验证的页面状态必须明说，不要写成已通过。
