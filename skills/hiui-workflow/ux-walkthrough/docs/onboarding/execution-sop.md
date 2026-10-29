# UX Walkthrough 执行 SOP

这份文件定义 `ux-walkthrough` 的正式执行顺序。

## 核心原则

- 每个阶段都有明确目标
- 每个阶段都有通过条件
- 未通过时不能进入下一阶段
- 最终完成不是主观判断，而是关键阶段全部走通后的结果

## 主流程约定

主流程优先只走两个高层入口：

1. `scripts/precheck_walkthrough.py`
2. `scripts/closeout_walkthrough.py`

只有在需要定位单层问题时，才拆到底层脚本。

## 完整流程

1. 阶段 0：输入接收与可执行性判断
2. 阶段 1：模式判定
3. 阶段 2：证据就绪判断
4. 阶段 3：证据采集
5. 阶段 4：问题判断与分级
6. 阶段 5：正式报告生成
7. 阶段 6：本地 `.docx` 生成
8. 阶段 7：统一收口
9. 阶段 8：最终完成判断

## 阶段 0：输入接收与可执行性判断

**目标：** 判断当前输入是否足以进入正式走查。

**推荐先做：**

- 对代码仓库输入，或模式仍有歧义的输入，优先运行 `scripts/precheck_walkthrough.py <输入> ... --json`
- 先看结构化结果里的 `mode`、`precheck_stage`、`status`、`next_action`

**通过条件：**

- 输入类型可识别
- 当前输入具备继续推进的基础条件

**失败回路：**

- 无法判断输入类型：只问一句最小必要澄清
- URL 仍停留在登录页：暂停正式走查，等待用户登录
- 截图零散且不足以形成完整结论：明确标记“证据不足，暂不进入正式交付”
- 代码仓库已被结构化识别为非页面项目：不继续正式走查，交给 `scripts/closeout_walkthrough.py` 做统一失败收口

## 阶段 1：模式判定

**目标：** 绑定本次任务唯一主模式。

**推荐先做：**

- 若已经执行 `precheck_walkthrough.py`，优先复用它返回的 `mode`
- 只有在单层调试时，才单独看 `scripts/detect_input_mode.py`

可选模式只有三种：

- `code`
- `url`
- `screenshot`

**通过条件：**

- 当前任务已有唯一主模式
- 已读取对应模式说明文件

**失败回路：**

- URL 因登录态缺失无法继续，但用户能提供登录后截图：显式降级为 `screenshot`
- 代码模式缺少局部上下文，但仍能扫描整体结构：继续保留 `code`

## 阶段 2：证据就绪判断

**目标：** 判断当前是否已具备正式问题判断的证据基础。

**推荐先做：**

- 若已走统一前置检查，优先复用 `scripts/precheck_walkthrough.py` 返回的 `gate` 结果
- 若只单独调试证据门禁，再运行 `scripts/check_evidence_gate.py --source <mode> ... --json`
- 先看结构化结果里的 `status`、`next_action`、`should_continue`

### `code`

- 项目目录可读
- 能运行扫描脚本，或能手动识别核心页面与结构

### `url`

- 已进入真实业务页
- 可以进行截图留证

### `screenshot`

- 用户已提供可读截图
- 截图数量和顺序足以支持本次结论

**失败回路：**

- 证据不足时，只能输出“待补充信息”或“待交互验证”，不能进入正式交付
- 若 `check_evidence_gate.py` 已给出固定失败出口，不继续停留在文本分析，交给 `scripts/closeout_walkthrough.py` 做统一失败收口

## 阶段 3：证据采集

**目标：** 收集后续判断和交付真正依赖的材料。

### `code`

- 页面结构扫描结果或手动扫描结果
- 问题涉及的页面、文件、组件、函数或状态定位

### `url`

- 首屏截图
- 关键交互后截图
- 必要时的问题标注图

### `screenshot`

- 原始截图路径
- 必要时的局部确认图
- 必要时的问题标注图

**失败回路：**

- 截图不够：先补截图，再继续
- 标注不准：先回到对象确认，再重新标注

**禁止：**

- 不要先写问题，再回头硬找图凑证据
- 不要用模糊红框代替真实问题定位

## 阶段 4：问题判断与分级

**目标：** 基于统一标准形成问题清单。

**固定顺序：**

1. 先做简洁任务理解，生成 1–3 条核心流程
2. 先实际执行主流程；列表 / 管理页优先覆盖页头主动作与行内动作，低风险且可回收的创建默认跑完整闭环
3. 主流程完成或已明确停在提交前后，再做结构四问快扫；只有命中问题、主流程区域可疑或用户明确要求时，才展开局部样式细查
4. 再结合 `ux-checklist` 和 `issue-examples` 收口补漏
5. 再过 `ignore-list`，去掉不该报或证据不足的问题
6. 最后过 `severity-rubric`，为保留下来的问题定优先级

**通过条件：**

- 所有问题都经过优先级判断
- 证据不足的问题已标为“待确认项”或“待交互验证”

**禁止：**

- 不要凭感觉直接写 P0/P1/P2
- 不要把纯猜测写成确定问题
- 不要跳过主流程，只靠样式检查来判断页面质量

## 阶段 5：正式报告生成

**目标：** 在对话中输出完整报告正文。

**通过条件：**

- 对话中已有完整报告，而不是摘要
- 用户可以直接看到完整问题列表、建议与定位信息

**禁止：**

- 不要只给摘要而不输出完整正文
- 不要只给图片路径而不让用户看到问题内容

## 阶段 6：本地 `.docx` 生成

**目标：** 形成可归档、可转发的本地报告文件。

**标准入口：**

- 先整理结构化 `report.json`
- 再调用：

```bash
python3 {SKILL_DIR}/scripts/generate_docx.py --report-json <report.json> --output <output.docx> --json
```

- `report.json` 字段约定以 `references/report-json.md` 为准
- 生成后的文件命名、嵌图与无图规则以 `references/report-json.md` § DOCX 为准

**成功后衔接：**

- 若 `generate_docx.py` 返回 `status=generated`，则应继续执行：

```bash
python3 {SKILL_DIR}/scripts/closeout_walkthrough.py --source <mode> --report-json <report.json> --report-generated true --docx-generated true --docx-name <output.docx 文件名> --json
```

**失败后衔接：**

- 若 `generate_docx.py` 返回 `status=failed`，则不要停留在“docx 还没好”的口头状态，应继续执行：

```bash
python3 {SKILL_DIR}/scripts/closeout_walkthrough.py --source <mode> --report-generated true --docx-failed true --docx-name <原计划输出文件名> --failure-detail "<当前对象 + 卡住位置 + 直接原因>" --json
```

**通过条件：**

- 本地 `.docx` 已生成
- 文件名和交付内容可直接使用

**失败回路：**

- `.docx` 未生成成功：不能进入 `success` 收口；若已确认是 `.docx` 生成失败，应按固定失败出口执行 `failed` 收口

## 阶段 7：统一收口

**目标：** 把最终收尾变成固定闭环，而不是可选动作。

**主流程入口：**

- `scripts/closeout_walkthrough.py`

**通过条件：**

- 已先通过 `scripts/closeout_walkthrough.py` 得到结构化收口结果
- 已按 `gates.md` § 统一收口协议完成终态收口

**说明：**

- `scripts/classify_closeout.py` 仍保留为底层调试入口
- 统一收口的具体顺序与边界，以 `gates.md` § 统一收口协议为准
- `execution-sop.md` 只负责定义“必须经过这一阶段”，不重复展开实现细节

## 阶段 8：最终完成判断

以下条件必须同时满足，任务才算真正完成：

1. 已完成模式判定
2. 已满足证据门禁
3. 已完成正式问题判断与分级
4. 已在对话中输出完整报告
5. 已生成本地 `.docx`
6. 已完成统一收口判定，并按结果完成收口

换句话说：

- 已分析，不等于完成
- 已出报告，不等于完成
- 已生成 `.docx`，不等于完成
- 只有阶段 0 到阶段 7 全部走通，才算完成
