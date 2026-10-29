# 任务完成协议

这份文件只定义一件事：`ux-walkthrough` 在进入最终完成前，统一收口必须如何执行。

主流程阶段门禁看 `execution-sop.md`。

## 适用范围

以下任务命中任一场景时，都适用本协议：

- 代码走查形成完整交付
- URL 走查形成完整交付
- 截图走查形成完整交付
- 已命中 `ux-walkthrough`，且已开始做前置检查、模式判定或证据门禁判断
- 已进入正式走查，但在固定失败出口终止
- 用户在走查过程中明确取消

纯讨论、纯规则问答、或仍停留在前置阶段的状态，不适用本协议。

## 固定完成顺序

当主任务已经通过主流程门禁并进入收尾阶段后，最终回复前必须按下面顺序执行：

补充边界：

- 下面这组固定顺序只适用于 `success` 收口
- `failed / canceled` 不要求先生成本地 `.docx`；它们应直接走固定失败或取消收口
- 若当前仍在等待用户补图、补登录、补仓库信息或补其他关键证据，属于 `needs_input`，暂不进入统一收口

1. 输出完整走查报告
2. 整理结构化 `report.json`
3. 执行一次 `scripts/generate_docx.py`
4. 若 `generate_docx.py` 成功，再执行一次 `scripts/closeout_walkthrough.py`
5. 检查返回的 `status`、`next_action` 与退出码

其中：

- 第 3 步的 `report.json` 字段约定看 `../../references/report-json.md`
- 第 4 步若 `generate_docx.py` 成功，应显式传 `--report-json <report.json> --docx-generated true --docx-name ... --docx-path ...`
- 第 4 步若 `generate_docx.py` 失败，应显式传 `--docx-failed true --failure-detail ...`，直接走失败收口

## 固定失败收口

若任务已经进入正式走查，但在固定失败出口终止，不要直接结束对话；先执行一次统一终态收口。

优先使用下面这些固定预设：

- URL 仍停留在登录页或授权页：`--status failed --failure-preset url_login_required`
- URL 无法打开真实页面：`--status failed --failure-preset url_page_unreachable`
- 截图不足以形成完整结论：`--status failed --failure-preset screenshot_evidence_insufficient`
- 代码仓库不是页面项目：`--status failed --failure-preset code_not_page_project`
- 代码扫描失败且无法手动补足：`--status failed --failure-preset code_scan_failed`
- 本地 `.docx` 生成失败：`--status failed --failure-preset docx_generation_failed`

补充规则：

- `docx_generation_failed` 需要同时显式带上当前 `--source`
- 若用户是主动说“暂停 / 不继续 / 先不做了”，且本次已经命中 skill 并开始前置检查、模式判定或证据门禁判断，应先用 `scripts/closeout_walkthrough.py --user-canceled true ...` 统一收口
- 失败收口时，若外层已经拿到更具体的失败上下文，应显式传 `--failure-detail`，并使用中文描述“当前对象 + 卡住位置 + 直接原因”

## 统一终态收口入口

主流程优先统一调用：

- `scripts/closeout_walkthrough.py`

它会自动做两件事：

1. 终态判定：`success / failed / canceled / needs_input`
2. 若已到收口时机，直接返回统一完成结果

外层固定约束：

- 不再自己用自然语言判断“现在算不算成功 / 失败 / 取消”
- 返回 `status=needs_input`：当前还没到统一收口时机
- 返回 `status=completed`：当前终态已经完成统一收口

只在单层调试时，才分别使用：

- `scripts/classify_closeout.py`

## 外层 agent 约束

- 对已形成完整交付的任务，最终回复前必须真的执行统一收口
- 对已命中 skill 且已开始前置检查、模式判定或证据门禁判断，随后被用户明确取消的任务，结束前也必须真的执行 `canceled` 收口
- 对已进入正式走查、但命中固定失败出口的任务，结束前也必须真的执行失败收口
- 对 success / failed / canceled 三类终态，优先执行 `scripts/closeout_walkthrough.py`
- 不要把统一收口降级成“如果你需要，我再补跑”
- closeout 完成后，最终用户回复不需要额外解释收口内部细节
