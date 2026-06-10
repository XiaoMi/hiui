# 代码走查

## 适用场景

当用户提供的是本地前端项目目录，且目录中可识别到 `package.json`、`src/`、路由文件或页面组件时，使用本模式。

若仓库是 monorepo、微前端或 `packages/*` 多包结构，优先明确实际前端入口，再进入正式扫描。

## 本模式门禁

- 优先运行 `scripts/precheck_walkthrough.py <项目路径> --json`
- 优先读取 `precheck_walkthrough.py` 返回的 `next_action`
- 至少能运行扫描脚本，或能手动识别核心页面与结构
- 若项目不可读或结构无法判断，不进入完整交付
- 若结构化判断结果显示仓库不是页面项目，不进入完整交付，直接说明当前输入不适合做页面走查

## 证据采集

优先做两件事：

1. 先用统一前置检查脚本确认这是页面项目并完成扫描门禁
2. 锁定核心页面与高频流程

首选命令：

```bash
python3 {SKILL_DIR}/scripts/precheck_walkthrough.py <项目路径> --json
```

若当前仓库不是单包项目，而是多包结构，优先补充实际入口：

```bash
python3 {SKILL_DIR}/scripts/precheck_walkthrough.py --repo-path <仓库根目录> --entry packages/web --json
```

若只需要拆开单独调试，再分别使用下面两个底层脚本：

首选命令：

```bash
python3 {SKILL_DIR}/scripts/detect_input_mode.py <项目路径> --json
```

首选命令：

```bash
python3 {SKILL_DIR}/scripts/scan-pages.py <项目路径>
```

若要扫描 monorepo 中的具体子应用，可显式指定入口：

```bash
python3 {SKILL_DIR}/scripts/detect_input_mode.py --repo-path <仓库根目录> --entry packages/web --json
python3 {SKILL_DIR}/scripts/scan-pages.py <仓库根目录> --entry packages/web
```

完成扫描后，立即运行：

```bash
python3 {SKILL_DIR}/scripts/check_evidence_gate.py --source code --scan-json <扫描结果JSON> --json
```

优先读取返回里的 `next_action`，不要再靠中文消息自行判断是继续走查还是补证据。

重点保留：

- 技术栈
- 实际扫描入口
- 路由文件
- 路由线索
- 页面清单
- 页面组件
- 样式文件
- 通用组件

若扫描脚本已经给出 `page_catalog`，优先用它锁定本次走查的核心页面，再补充高频流程和关键状态。

若脚本不可用，不中断任务，改为手动扫描：

1. 读取 `package.json`
2. 若是多包结构，先确认实际前端入口
3. 查找路由配置
4. 列出页面级组件
5. 列出样式文件
6. 识别通用组件和高频交互模块

若 `detect_input_mode.py` 已明确给出：

- `status=failed`
- `failure_preset=code_not_page_project`

则当前仓库不应继续按页面项目走查，应直接结束本次完整交付流程，并提示用户补充真正的页面输入。

若 `check_evidence_gate.py` 已明确给出：

- `status=needs_input`
- `reason=scan_failed`

则说明当前扫描结果不足或扫描失败，当前应先补充页面入口、关键页面位置或手动证据，而不是直接结束流程。

## 问题判断重点

以下仅为代码走查的额外关注点。正式问题判断时，仍需结合 `ux-checklist.md` 与 `issue-examples.md` 执行。

- 主流程是否完整
- 页面层级是否清楚
- 高频操作是否顺手
- 状态反馈是否充分
- 文案是否面向业务
- 样式是否一致
- 是否存在明显重复劳动或错误恢复困难

## 交付门禁

- 每个问题尽量落到具体位置：页面、文件、组件、函数、状态变量
- 若证据只来自代码推断，必须明确写出“基于代码推断，建议结合实际页面确认”
- 即使没有实际截图，也仍需生成本地 `.docx`

## `report.json` 组织建议

- `source` 固定写 `code`
- `scope` 建议写成：`项目路径 + 走查模块`，例如 `src/pages/order + 结算主流程`
- `tech_stack` 建议显式写入
- `issues[].location` 优先写页面、文件、组件或函数定位
- `issues[].evidence_note` 若结论主要来自代码推断，建议固定包含“基于代码推断，建议结合实际页面确认”
- `issues[].images` 允许为空数组；不要为了凑图强行补无关截图
- 若全篇无图，附录说明建议写“本次报告无截图证据，结论主要基于代码结构与交互逻辑推断”

## 形成一次完整 `code` 交付的条件

- 已形成完整报告
- 已生成本地 `.docx`
- 若结论主要来自代码推断，报告中必须明确提示“建议结合实际页面确认”
- 若当前只是还在补仓库信息、补页面入口或补扫描证据，说明当前还不能形成完整交付
- 若已确认仓库不是页面项目、代码扫描失败且无法补足，直接说明失败原因，不要停留在模糊的中间状态
