# 报告结构化 JSON 约定

`generate_docx.py` 不直接吃自然语言大段正文，而是读取一份结构化 `report.json`。

主流程建议：

1. 先在对话中输出完整 Markdown 报告
2. 再同步整理一份 `report.json`
3. 最后调用 `scripts/generate_docx.py` 生成本地 `.docx`

标准命令：

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py \
  --report-json <report.json> \
  --output <output.docx> \
  --json
```

可直接参考：`references/report-json.smoke.json`

## 必填字段

```json
{
  "title": "IPD 体验走查报告",
  "project": "IPD",
  "source": "screenshot",
  "generated_at": "2026-06-04T17:00:00+08:00",
  "scope": "需求页截图 3 张",
  "walkthrough_options": {
    "style_review_required": true
  },
  "business_context": {
    "source": "mixed",
    "product_goal": "帮助运营人员快速识别并处理待审批记录。",
    "primary_users": ["运营", "审批人"],
    "core_tasks": ["筛选待处理记录", "查看详情并确认状态", "完成审批动作"],
    "assumptions": ["未拿到正式 PRD，流程基于页面信息推断"],
    "missing_information": ["未确认是否存在批量处理流程"]
  },
  "core_flows": [
    {
      "name": "筛选并查看待审批记录",
      "type": "查询流程",
      "goal": "帮助审批人定位目标记录并进入详情确认状态",
      "steps": ["进入待审批列表", "设置筛选条件", "打开目标记录详情"],
      "status": "inferred",
      "execution": {
        "status": "completed",
        "executed_steps": [
          {"step": "进入待审批列表", "result": "页面正常展示待审批列表和筛选区"},
          {"step": "设置筛选条件", "result": "筛选条件可录入并触发列表刷新"},
          {"step": "打开目标记录详情", "result": "详情入口可点击并进入记录详情区域"}
        ],
        "verification": "筛选后能够进入目标记录详情并看到状态信息",
        "evidence": [{"type": "screenshot_review", "note": "依据截图中的列表、筛选区和详情入口完成验证"}]
      }
    }
  ],
  "action_inventory": {
    "header_actions": ["新建", "导出"],
    "row_actions": ["查看详情", "删除"],
    "danger_actions": ["删除"]
  },
  "element_inventory": {
    "source": "screenshot",
    "evidence": "基于首屏截图和主流程截图完成元素盘点",
    "items": {
      "page_header_actions": {"present": true, "note": "页头右上角存在新建和导出按钮", "evidence": "截图右上角可见页头动作组"},
      "table_row_actions": {"present": true, "note": "表格右侧存在查看和删除操作", "evidence": "列表行右侧可见操作列"},
      "danger_actions": {"present": true, "note": "删除属于危险操作", "evidence": "操作列包含删除入口"},
      "form_actions": {"present": false, "note": "当前截图未进入表单页", "evidence": "本轮证据只覆盖列表页"},
      "modal_or_drawer_actions": {"present": false, "note": "当前截图未出现弹窗或抽屉", "evidence": "首屏没有弹窗抽屉组件"},
      "data_visualization": {"present": false, "note": "当前页面未展示图表或统计卡", "evidence": "首屏主体为筛选和列表"}
    }
  },
  "summary": {
    "overall": "页面信息承载较完整，但主次层级和操作引导仍有明显优化空间。",
    "key_points": [
      "主操作入口不突出",
      "信息分组边界不清晰"
    ],
    "improvement_direction": "先强化主操作与主信息层级，再收敛局部视觉噪音。"
  },
  "style_review": {
    "framework": "hiui-design",
    "trigger": "user_requested",
    "detail_check_required": true,
    "detail_check_reason": "user_requested",
    "summary": "页面整体整洁，但首屏主次和状态样式仍不够稳定。",
    "priority_actions": [
      "先拉开标题、主按钮和辅助信息的视觉权重",
      "统一卡片、筛选区和表格上沿的对齐节奏"
    ],
    "structure_scan": [
      {
        "name": "页头到首屏内容有没有接住",
        "status": "pass",
        "note": "页头下方能直接承接主内容",
        "evidence": "标题后紧接筛选区和列表主体"
      },
      {
        "name": "主白底外边距稳不稳",
        "status": "issue",
        "note": "主白底左右外边距不在同一档位",
        "evidence": "列表区右侧留白明显大于左侧",
        "linked_issue_index": 1
      },
      {
        "name": "多列有没有收口",
        "status": "n/a",
        "note": "当前页面不是双列或三列布局",
        "evidence": "页面主体是单列列表工作区"
      },
      {
        "name": "有没有大块无效空白",
        "status": "pass",
        "note": "未发现割裂阅读流的大块空白",
        "evidence": "首屏内容从筛选区连续进入列表区"
      }
    ],
    "dimensions": [
      {
        "name": "信息层级",
        "status": "issue",
        "note": "主标题、说明和操作按钮视觉权重接近",
        "evidence": "首屏顶部区域需要反复辨认主路径",
        "linked_issue_index": 1
      },
      {
        "name": "间距与对齐",
        "status": "pass",
        "note": "主要模块左右边线一致",
        "evidence": "筛选区与列表区的外边距稳定"
      },
      {
        "name": "文字可读性",
        "status": "pass",
        "note": "正文和辅助说明保持可读",
        "evidence": "字号、行高和灰度没有明显影响阅读"
      },
      {
        "name": "色彩语义",
        "status": "pass",
        "note": "主色和状态色语义没有混用",
        "evidence": "主按钮、链接和状态表达职责清楚"
      },
      {
        "name": "组件状态一致性",
        "status": "pass",
        "note": "同类组件状态表达保持一致",
        "evidence": "按钮、筛选和表格状态未出现明显分叉"
      },
      {
        "name": "密度与版面稳定性",
        "status": "pass",
        "note": "高密信息下仍能保持扫读节奏",
        "evidence": "筛选区、列表区和操作区没有互相挤压"
      }
    ],
    "hiui_sections": [
      {
        "name": "全局视觉基线",
        "status": "pass",
        "severity": "P2",
        "note": "主交互色、主白底和文字灰阶仍在 HiUI 体系内",
        "evidence": "主按钮、链接和选中态都使用 HiUI Blue"
      },
      {
        "name": "跨页面共享结构",
        "status": "pass",
        "severity": "P2",
        "note": "页面仍保持单一主工作区结构",
        "evidence": "未出现第二主滚动或第二白底工作区"
      },
      {
        "name": "页型规范",
        "status": "issue",
        "severity": "P1",
        "note": "当前更像统计页型，但主体结构退回普通列表壳",
        "evidence": "指标卡与表格没有留在同一主工作区",
        "linked_issue_index": 1
      },
      {
        "name": "组件语义",
        "status": "pass",
        "severity": "P2",
        "note": "按钮、筛选和表格组件语义保持一致",
        "evidence": "未发现伪造组件或同类组件样式分叉"
      }
    ],
    "hiui_component_checks": [
      {
        "id": "HIUI-ACTION-PRIMARY-RIGHTMOST",
        "name": "页头主按钮位于动作组最右端",
        "status": "issue",
        "note": "主按钮没有位于动作组最右端",
        "evidence": "页头动作组中主按钮在导出左侧",
        "linked_issue_index": 1
      },
      {
        "id": "HIUI-ACTION-GROUP-RIGHT-ALIGNED",
        "name": "页头动作组靠右对齐",
        "status": "pass",
        "note": "页头动作组整体位于右上角",
        "evidence": "截图右上角显示按钮组"
      },
      {
        "id": "HIUI-TABLE-ROW-ACTION-LINK-BLUE",
        "name": "表格行内操作使用蓝色 link 文本",
        "status": "issue",
        "note": "行内操作未使用蓝色链接样式",
        "evidence": "操作列文字颜色与普通正文接近",
        "linked_issue_index": 1
      },
      {
        "id": "HIUI-TABLE-ROW-ACTION-FIXED-RIGHT",
        "name": "表格操作列固定在右侧",
        "status": "pass",
        "note": "操作列保持在表格右侧区域",
        "evidence": "列表行右侧可见操作入口"
      },
      {
        "id": "HIUI-DANGER-ACTION-CONFIRM",
        "name": "危险操作具备二次确认或撤销路径",
        "status": "issue",
        "note": "删除需要二次确认或撤销路径",
        "evidence": "操作列存在删除入口需验证确认机制",
        "linked_issue_index": 1
      },
      {
        "id": "HIUI-FORM-FOOTER-ACTIONS",
        "name": "表单底部操作主次清晰并靠右",
        "status": "n/a",
        "note": "本轮证据没有进入表单工作面",
        "evidence": "截图未展示新建或编辑表单"
      },
      {
        "id": "HIUI-MODAL-DRAWER-ACTION-SEMANTICS",
        "name": "弹窗抽屉操作区符合主次与风险语义",
        "status": "n/a",
        "note": "当前页面未出现弹窗抽屉",
        "evidence": "首屏证据没有弹窗或抽屉"
      },
      {
        "id": "HIUI-DATA-VIS-THEME-SEMANTICS",
        "name": "统计图表使用 HiUI 主题与状态语义",
        "status": "n/a",
        "note": "当前页面未展示统计或图表",
        "evidence": "首屏主体为筛选区和表格"
      }
    ]
  },
  "issues": [
    {
      "index": 1,
      "severity": "P1",
      "title": "首屏主操作与页面结构不符合样式规范",
      "category": "样式问题",
      "location": "首屏顶部操作区",
      "description": "主按钮和次级按钮视觉权重接近，且统计类内容没有保持在统一主工作区内，不符合样式规范。",
      "suggestion": "增强主按钮对比度，压低次级按钮权重，并将指标卡与表格回收到统一主工作区。",
      "evidence_note": "截图右上角操作区",
      "images": [
        {
          "path": "/abs/path/to/issue-1-annotated.png",
          "caption": "图 1：主操作与次级操作区分不明显（标注：右上角操作区）",
          "annotated": true,
          "bbox": [120, 80, 240, 96],
          "annotation_meta": {"generated_by": "annotate_issue.py"}
        }
      ]
    }
  ],
  "appendix": {
    "note": "本次报告基于用户提供截图完成。",
    "items": [
      "走查依据：UX 走查清单",
      "截图来源：用户本地文件"
    ]
  }
}
```

## 字段说明

- `title`：文档标题
- `project`：项目名，可为空
- `source`：必须是 `code / url / screenshot`
- `generated_at`：生成时间字符串
- `scope`：走查范围说明
- `business_context`：**正式交付必填**；记录简洁业务理解摘要
  - `source`：`prd / inferred / mixed / unknown`
  - `product_goal`：产品目标
  - `primary_users`：主要用户列表
  - `core_tasks`：核心任务列表（建议 1–3 条）
  - `assumptions`：关键假设
  - `missing_information`：当前缺失信息
  - `confidence / success_signal / risk_points`：兼容旧版，可选
- `core_flows`：**必填**；每次正式交付必须记录 1–3 条核心流程，不能只写流程名称或页面可达性
  - `name`：流程名
  - `type`：可选；建议写 `页头主动作 / 行内动作 / 查询流程`
  - `goal`：该流程的用户目标
  - `steps`：流程步骤数组
  - `status`：`confirmed / inferred / pending`，表示业务理解状态
  - `execution`：**必填**，表示本次实际走查状态
    - `status`：`completed / stopped_before_submit / blocked_high_risk`
    - `executed_steps`：已实际执行步骤；`completed` 时必须覆盖 `steps`
    - `evidence`：至少一条实际证据，填写截图、URL、代码行为或结果记录
    - `verification`：`completed` 时必须写清结果落点、状态变化或失败反馈
    - `stopped_at / stop_reason`：停在提交前或高风险阻断时必填
    - `side_effect_level`：`stopped_before_submit / blocked_high_risk` 时必填；仅 `high / unknown` 允许不提交，`none / low / recoverable` 必须完成闭环验证
- `action_inventory`：**必填**；记录页面实际存在的 `header_actions / row_actions / danger_actions`，无动作时填空数组。若 `header_actions` 非空，`core_flows` 必须包含 `type=页头主动作`；若 `row_actions` 非空，`core_flows` 必须包含 `type=行内动作`
- `element_inventory`：HiUI 样式专项 **必填**；先盘点页面元素，再派生组件检查。`items` 必须覆盖 `page_header_actions / table_row_actions / danger_actions / form_actions / modal_or_drawer_actions / data_visualization`，每项都要有 `present` 布尔值、`note` 和 `evidence`
- `summary.overall`：整体评价
- `summary.key_points`：核心问题列表
- `summary.improvement_direction`：改进方向
- `walkthrough_options.style_review_required`：可选布尔值；当用户明确要求样式走查、代码证据暴露样式风险、主流程区域存在视觉风险或用户框选具体区域时填 `true`，用于触发机器门禁
- `style_review`：样式专项触发时必填；`url / screenshot` 默认触发，`code` 模式写了 `style_review` 或 `walkthrough_options.style_review_required=true` 时也必须满足门禁。对外报告与 docx 中展示 `dimensions` 的维度结论，位置放在附录里的 `Checklist 逐条检查记录` 之后
  - **边界规则**：`style_review` 只用于承载维度结论与辅助判断，**不能替代**正式问题列表。凡是已经判定为正式样式问题的项，必须同时写入 `issues[]`，并在对话报告 / docx 的「问题详情」中展开
  - `framework`：可选；HiUI 页面建议填 `hiui-design`
  - `trigger`：**必填**；取值 `source_default / user_requested / code_style_evidence / main_flow_visual_risk / user_marked_area`
  - `detail_check_required`：结构四问命中、用户明确要求、主流程视觉风险或用户框选区域时填 `true`
  - `detail_check_reason`：需要六维详查时必填；取值 `structure_issue / user_requested / main_flow_visual_risk / user_marked_area / manual_detail_check`
  - `summary` / `priority_actions`：可保留在 JSON 中作为内部辅助信息，但默认**不展示**到对外报告和 docx
  - `structure_scan`：**样式走查必填**；结构四问快扫，必须覆盖：`页头到首屏内容有没有接住 / 主白底外边距稳不稳 / 多列有没有收口 / 有没有大块无效空白`
    - `name`：四问之一，必须使用上述名称
    - `status`：`pass / issue / pending / n/a`
    - `note / evidence`：均须填写具体结论与证据
    - `linked_issue_index / linked_issue_title`：当 `status=issue` 时必填其一，指向正式样式 issue
  - `dimensions`：维度数组；结构四问命中、`detail_check_required=true`、`trigger=user_requested/main_flow_visual_risk/user_marked_area` 时必须覆盖 `信息层级 / 间距与对齐 / 文字可读性 / 色彩语义 / 组件状态一致性 / 密度与版面稳定性`
    - `name`：维度名
    - `status`：`pass / issue / pending / n/a`
    - `note`：该维度结论
    - `evidence`：一句证据或观察依据
    - `linked_issue_index / linked_issue_title`：当 `status=issue` 时必填其一，指向正式样式 issue
  - `hiui_sections`：`framework=hiui-design` 且执行样式专项时必填；必须覆盖 `全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义`，如存在数据看板、图表或统计卡，再补 `数据可视化专项`
    - `name`：建议使用 `全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义 / 数据可视化专项`
    - `status`：`pass / issue / pending / n/a`
    - `severity`：建议用 `P0 / P1 / P2 / P3`；其中 `P3` 用于轻微样式规范偏差，并应通过 `linked_issue_index/title` 指向正式样式 issue
    - `note`：本项判断
    - `evidence`：一句证据或定位依据
  - `hiui_component_checks`：`framework=hiui-design` 且执行样式专项时必填；必须覆盖 `HIUI-ACTION-PRIMARY-RIGHTMOST / HIUI-ACTION-GROUP-RIGHT-ALIGNED / HIUI-TABLE-ROW-ACTION-LINK-BLUE / HIUI-TABLE-ROW-ACTION-FIXED-RIGHT / HIUI-DANGER-ACTION-CONFIRM / HIUI-FORM-FOOTER-ACTIONS / HIUI-MODAL-DRAWER-ACTION-SEMANTICS / HIUI-DATA-VIS-THEME-SEMANTICS`
    - `id`：必须使用上述固定 ID
    - `name`：检查项中文名
    - `status`：`pass / issue / pending / n/a`
    - `note / evidence`：均须填写具体结论与证据
    - `linked_issue_index / linked_issue_title`：当 `status=issue` 时必填其一，指向正式样式 issue
    - 若 `element_inventory.items.<type>.present=true`，对应检查项不得写 `n/a`；`url / screenshot` 模式下也不得写 `pending`
  - 一致性要求：若 `dimensions` 中 `信息层级 / 间距与对齐 / 组件状态一致性 / 密度与版面稳定性` 任一项为 `issue`，则 `checklist_coverage` 中 `UX-1.2 / UX-2.5 / UX-3.1` 不得全部写 `pass`
  - 一致性要求：若 `framework=hiui-design` 且 `hiui_sections` 中 `全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义` 任一项为 `issue`，则相关 checklist 不得全部写 `pass`
  - 若用户额外提供截图并指出具体样式区域，`style_review` 或 `issues[]` 中必须逐区回应，不能只留一句整体总结
- `closure_verification`：可选；涉及创建 / 发布 / 删除等闭环动作时可保留为内部辅助字段，用来说明这次是否真实提交、是否经过用户确认、是否已回收；**默认不展示在对话报告或 docx 正文中**
  - `status`：`not_submitted / submitted_verified / submitted_not_reverted`
  - `user_confirmed`：`true / false`
  - `side_effect_level`：`none / low / recoverable / high / unknown`
  - `rollback_status`：`not_needed / reverted / not_reverted`
  - `note`：一句话补充说明，例如“因存在真实影响，本次停在提交前”；低风险且可回收动作通常应直接执行，`user_confirmed` 可为 `false`
- `issues`：非空数组
- `checklist_coverage`：**必填**；键为全部 checklist ID（`UX-1.1` … `UX-3.5`），值为下列之一：
  - `pass: <验证证据>` — 已检查且无问题；**备注须 ≥8 字**，禁止裸 `pass`
  - `issue` — 已发现问题（须在 `issues[]` 中体现；标为 issue 的条数不得大于 `issues` 总数）
  - `pending: <原因>` — 证据不足，原因须 ≥8 字；须在 `issues[]` 中以标题含「待交互验证」的条目体现
  - `n/a: <原因>` — 本条不适用，原因须 ≥8 字（**url/screenshot 模式下 UX-1.4 / UX-1.5 / UX-1.6 不可标 n/a**）
  - `generate_docx.py` 会把 `checklist_coverage` 按 checklist 原始顺序展开到 docx 附录，展示每一条的结果与说明，供用户回看“实际检查了什么”
- `issues[].index`：问题序号
- `issues[].severity`：流程 / 交互问题必须是 `P0 / P1 / P2`；`category=样式问题` 可使用 `P0 / P1 / P2 / P3`
- 样式规范偏差即使不影响任务完成或理解效率，也应进入 `issues[]`，此时优先定为 `P3`；`style_review` 中标为 `issue` 的维度必须用 `linked_issue_index` 或 `linked_issue_title` 指向正式样式 issue
- `issues[].title`：不带序号和优先级也可以，脚本会统一组装为 `序号. [P级]标题`
- 截图/URL 证据不足但已暴露明显用户疑惑时，也应作为 `issues[]` 条目输出；标题必须显式包含「待交互验证」，`description` 写清疑惑点，`suggestion` 写清需要验证的交互和建议验证方式，不得只在 `appendix.items` 中概括
- `issues[].category`：与 checklist `report_category` 一致，使用 `流程问题` / `交互问题` / `样式问题` 三者之一
- 若某条样式观察不符合规范，`issues[].category` 应写为 `样式问题`，且不能只停留在 `style_review.dimensions`
- `issues[].location`：页面区域 / 文件路径 / 模块
- `issues[].description`：问题描述
- `issues[].suggestion`：改进建议
- `issues[].evidence_note`：证据说明，可为空
- `issues[].images`：图片列表；可传字符串路径，也可传 `{path, caption, annotated, bbox, annotation_meta}` 对象
- `issues[].flow_step / affected_users / business_impact / confidence`：兼容旧版，可保留给内部分析；新模板与 docx 默认不展示
- `issues[].images[].annotated`：**screenshot / url 必填 `true`**（须为 overlay 标注版，非整页原图重复引用；单独写 `true` 不能替代标注路径或标注元数据）
- `issues[].images[].bbox`：**screenshot / url 必填** `[x, y, w, h]`（由 `locate_in_screenshot.py` / `annotate_issue.py` 产出；禁止手估）
- `issues[].images[].annotation_meta.generated_by`：建议写 `annotate_issue.py`；当文件名或目录无法体现标注产物时用于通过标注门禁
- `appendix.note`：附录说明
- `appendix.items`：附录条目列表
- `generate_docx.py` 当前不会把 `closure_verification` 渲染到对外 docx 正文；如需保留，可仅用于内部记录或后续统计扩展

## 图片规则

- `source=url` 或 `source=screenshot` 时，**每个 issue 都必须有标注图**，且 `annotated: true`
- 这条规则同样适用于正式样式问题：只要它进入 `issues[]`，就必须有对应标注图；附录里的 `style_review` 维度结论本身不要求单独配图
- 定位失败时的局部裁切 / 文字说明不能替代确定 issue 的标注门禁；若无法取得可靠 `bbox`，应标为「待确认 / 待交互验证」或补充证据后再交付
- 「待交互验证」问题若进入 `issues[]`，同样需要标注图与 `bbox`；若无法可靠定位，只能放入 `appendix.items` 并说明定位失败原因，不能伪造确定 issue
- 没有 PRD 时，`business_context.source` 应为 `inferred` 或 `mixed`，并在 `assumptions / missing_information` 中简要写清边界
- 若无法判断 `product_goal / primary_users / core_tasks`，不要硬写业务结论；应先澄清或降级为只报确定问题
- 若页面存在明确主按钮或行内主动作，但 `core_flows` 没有覆盖这些主流程，不应判定为正式交付完成

### 标注门禁（screenshot / url 必过）

```bash
python3 <SKILL_ROOT>/scripts/validate_checklist_coverage.py --report-json <report.json> --json
python3 <SKILL_ROOT>/scripts/validate_report_annotations.py --report-json <report.json> --json
python3 <SKILL_ROOT>/scripts/annotate_issue.py \
  --input <原图> \
  --output <SKILL_ROOT>/output/annotations/issue-N-annotated.png \
  --find-text "<目标文案>" \
  --region x,y,w,h \
  --label "问题简述" \
  --preview-dir <SKILL_ROOT>/output/annotations/previews \
  --json
```

`generate_docx.py` 强制调用核心流程、样式走查、checklist 覆盖与标注四项校验；`checklist` 与样式走查门禁不可跳过，未通过则 `status=failed`。
- `source=code` 时允许全篇无图
- 图片路径支持绝对路径，也支持相对 `report.json` 所在目录的相对路径
- 任一图片路径不存在时，`generate_docx.py` 会直接返回失败

## 返回结构

成功：

```json
{
  "ok": true,
  "status": "generated",
  "output_path": "/abs/path/IPD-ux-report-20260604.docx",
  "file_name": "IPD-ux-report-20260604.docx",
  "source": "screenshot",
  "issue_count": 5,
  "image_count": 4,
  "message": "DOCX generated"
}
```

失败：

```json
{
  "ok": false,
  "status": "failed",
  "failure_stage": "docx_generation",
  "failure_reason": "tool_error",
  "message": "DOCX generation failed",
  "detail": "图片不存在：/abs/path/to/annotated-1.png"
}
```

## 与收口脚本的衔接

成功后，推荐直接把结果映射到：

```bash
python3 <SKILL_ROOT>/scripts/closeout_walkthrough.py \
  --source <code|url|screenshot> \
  --report-json <report.json> \
  --report-generated true \
  --docx-generated true \
  --docx-name <output.docx 文件名> \
  --docx-path <output.docx 绝对或相对路径> \
  --json
```

若 `generate_docx.py` 返回失败，则推荐直接映射到：

```bash
python3 <SKILL_ROOT>/scripts/closeout_walkthrough.py \
  --source <code|url|screenshot> \
  --report-generated true \
  --docx-failed true \
  --docx-name <原计划输出文件名> \
  --failure-detail "<当前对象 + 卡住位置 + 直接原因>" \
  --json
```

---

## DOCX 生成要求

每次完成体验走查时，除了对话中的完整报告，还必须同步生成一份本地 `.docx` 报告。

### 标准入口

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py --report-json <report.json> --output <output.docx> --json
```

### 文件命名

建议使用：`{项目名或页面名}-ux-report-{YYYYMMDD}.docx`

若同一天生成多份，可追加模式或时间：`{项目名}-url-ux-report-{YYYYMMDD-HHMM}.docx`

默认输出目录：`<SKILL_ROOT>/output/`

### 建议结构

1. 标题 · 2. 走查时间 · 3. 走查模式 · 4. 走查范围 · 5. 业务理解与核心流程 · 6. 整体评价 · 7. 核心问题 · 8. 改进方向 · 9. 问题详情 · 10. 问题分布 · 11. 附录（含 checklist 逐条检查记录）

### 图片规则

- 若存在问题对应截图，文档中应直接嵌入截图，而不是只写图片路径
- 若存在**标注版截图**，优先嵌入（样式与定位流程见 `annotation-style.md`）
- **screenshot / url**：禁止仅嵌入未标注的整页原图；须 `validate_report_annotations.py` 已通过
- 若没有标注版，`generate_docx.py` 将拒绝生成（勿依赖「可先使用原图」绕过）
- 每个问题尽量配最相关的一张图；问题文字与对应图片应尽量相邻排布
- 图下方可补一句简短说明

### 无截图时

若本次走查没有实际截图，也仍需生成 `.docx` 报告：保留完整文字报告，并明确标注「本次报告无截图证据」。

### 模式差异

| 模式 | docx 要求 |
|------|-----------|
| code | 允许只有文字；重点保留页面、文件、组件定位 |
| url | 必须保留页面截图、交互后截图和问题标注图 |
| screenshot | 必须直接嵌入用户提供的截图或标注图 |

### 收口边界

- `.docx` 是 `success` 完成交付前的必过门禁
- 若 `.docx` 尚未生成成功，不进入 `success` 收口；若已确认卡在 `.docx` 生成阶段，应按固定失败出口执行 `failed` 收口
- 统一收口的具体动作，以 `docs/onboarding/gates.md` § 统一收口协议 为准
