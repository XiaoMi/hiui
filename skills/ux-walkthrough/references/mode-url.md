# URL 走查

## 本模式门禁

- 优先运行 `scripts/precheck_walkthrough.py --url <URL> ... --json`
- 优先读取 `precheck_walkthrough.py` 返回的 `next_action`
- 必须先确认是否已进入真实业务页
- 未进入真实业务页前，不进入正式 URL 走查
- 若无法获得登录态，但用户能提供登录后截图，可显式降级为截图走查

首选命令：

```bash
python3 {SKILL_DIR}/scripts/precheck_walkthrough.py --url <当前URL> --current-url <当前URL> --page-title <当前标题> --page-reachable true|false --login-required true|false --json
```

若只需要单独调试证据门禁，再使用底层脚本：

```bash
python3 {SKILL_DIR}/scripts/check_evidence_gate.py --source url --current-url <当前URL> --page-title <当前标题> --page-reachable true|false --login-required true|false --json
```

若脚本输出：

- `status=failed`
- `failure_preset=url_login_required|url_page_unreachable`

则不继续停留在口头判断，应直接说明失败原因，并等待用户补充可执行输入。

## 登录失败处理

若页面停留在登录页或无法获得登录态，不要直接基于登录页继续走查系统内部页面。

先明确提示用户：

“当前看到的是登录/注册页，无法代表登录后的真实系统体验。请先完成登录或授权，完成后告诉我，我再继续走查。”

处理原则：

- 默认等待用户完成登录后继续
- 不默认把登录页当成截图走查对象
- 若用户明确要求走查登录页本身，可以单独分析登录页体验
- 若用户暂时无法提供登录态，再建议用户提供登录后的页面截图，切换为截图走查模式

## 证据采集

- 页面截图
- 结构快照
- 关键交互探索
- 关键操作后截图
- 必要时的问题标注图

生成标注图时，遵循 `annotation-style.md`。

## 标注图门禁

1. 打开原始截图
2. 确认问题本体是哪一个控件或状态块
3. 目标较小时先做局部确认
4. 回到原图完成标注
5. 标注完成后复核再写入最终交付

未经过这几步，不应提交最终标注图。

## 问题判断重点

以下仅为 URL 走查的额外关注点。正式问题判断时，仍需结合 `ux-checklist.md` 与命中条目 `related_examples` 指向的 `issue-examples/*` 锚点执行。

- 首屏层级
- 主操作是否清晰
- 导航是否可回退
- 状态反馈是否充分
- 文案是否面向业务

## 交付门禁

- 截图留证是 URL 走查的必要步骤
- 若没有完成截图留证，不应提交完整报告
- 输出的每个确定问题都须有对应标注图与 bbox
- `.docx` 的嵌图与排版方式统一按 `report-json.md` § DOCX 执行

## `report.json` 组织建议

- `source` 固定写 `url`
- `scope` 建议写成：`页面 URL + 关键页面范围`，例如 `https://.../order/list + 列表页 / 详情页`
- `issues[].location` 优先写页面区域与交互位置，例如“列表筛选区”“弹窗底部操作区”
- `issues[].evidence_note` 建议写明截图对应状态，例如“点击保存前”“提交失败提示出现后”
- `issues[].images` 原则上应带真实页面截图或标注图；不要只写路径但不保留文件
- 若某问题跨多个状态才成立，可在同一问题下放多张图，并给每张图写 caption
- 若当前只拿到登录页、授权页或无留证截图，不要硬凑 `report.json` 走完整交付，应先回到门禁判断

## 记为一次完整 `source=url` 使用的条件

- 已进入真实业务页
- 已完成必要截图留证
- 已输出完整报告
- 已生成本地 `.docx`
- 若只是暂时停留在登录页、授权页或待用户登录阶段，且仍在等待用户继续操作，属于 `needs_input`，暂不完成判断
- 若已确认因登录态、授权态或页面不可达而无法进入真实业务页，应说明失败原因和下一步，不要输出完整报告
- 若没有完成截图留证，即使已经做了部分分析，也不应记为完整 URL 使用
- 若任务最终降级成截图走查，应按截图模式写 `source=screenshot`
- 具体完成判断按 `SKILL.md` 完成定义执行
