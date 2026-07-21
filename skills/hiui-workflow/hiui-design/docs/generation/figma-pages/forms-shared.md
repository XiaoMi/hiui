# 表单共享规则

适用于：

- 全页编辑
- 抽屉表单

## 硬门槛说明

- 本文件中涉及编辑页结构语义的规则，默认按硬门槛执行，不是“表单视觉建议”
- 对编辑页，以下事项必须同时成立：固定页壳语义、`Form` 根与 `labelPlacement: 'top'`、分组结构、字段栅格规则、宽控件整行、宿主高度链与滚动链关系
- 若页面实现不满足这些规则，应判定为不合规，而不是视作“项目自己的编辑页变体”
- 若要修改这些规则本身，按规范变更处理；至少同步更新本文件、`drawer-form.md`、`edit.md`、`rules/validation-checklist.md`、`docs/validation/checklist.md` 与对应示例页
- 编辑家族若在 `form-body` 中新增一级 supporting section，必须同步落盘 `semanticContract.bodySectionContract`，并让该 section 继续可被 `supportingSections` / `allowedExtensions` 解释；不要把它当成普通 slot-fill 或页面局部自由布局

## P0

- 可编辑场景必须有 `Form` 根；不要只散落 `FormItem`
- 默认 `labelPlacement: 'top'`
- 基础输入控件默认沿用 HiUI 5 基线：`32px` 高、`6px` 圆角；`appearance="line"` 时常见边框为 `1px solid #DBDDE0`，focus 通常以主色边框 `#2660FF` 表达
- 标签文字默认 `14 / 400 / #4E5969`，控件文字默认 `14 / 400 / #1A1D26`，占位默认 `#91959E`
- disabled 默认背景常见 `#F2F4F7`；文字 / 图标通常落在 `#91959E ~ #BABCC2`；不要在单页里随意改成新灰阶
- 外部项目的全页编辑必须挂在固定页壳的表单滚动区内，不要把 `Form` 单独塞进一张普通 `Card`
- `Upload`、长 `Textarea` 等宽控件默认整行
- 若宿主 `Upload` 触发器本身已经带上传图标，页面局部自定义 `content` 时不要再额外补第二个上传图标；优先复用宿主默认触发器语义或只保留文案
- 二级子分组内容区不要再整体水平缩进
- 二级标题统一为 `3x14` 色块 + `9px` 间距 + `48px` 高行，标题字重 `600`；标题与字段区不要再额外叠 `12px`
- `full-page-edit` 中，字段纵向节奏归 `FormItem` 与 section 结构所有；页面层不要通过覆写 `.hi-v5-form-item`、`.hi-v5-form`、`.hi-v5-form-label`、`.hi-v5-form-item__label` 去改整页表单节奏
- 若只是单个字段需要特例间距，必须把特例收口在该字段局部 wrapper；不要去改 HiUI 基础表单骨架类
- 若需要补颜色、字阶、按钮、容器等通用视觉基线，回看 `../hiui5-visual-baseline.md`
- supporting section 默认只允许作为 `form-body.after-primary-fields` 的一级区块存在；它可以是只读摘要、媒体行、简单表格或局部工具条，但不能接管 `white-body`、`main-scroll`、`query-filter`、`pagination` 或 `footer`

## 分组约定

- 全页一级分组标题前不要加色块，一级分组标题字重统一 `600`
- 抽屉分组不要用 `Card`
- 抽屉多组之间默认无额外间隙
- 全页多个一级分组块默认竖向 `16px`
- 若宿主 archetype 已经是扁平 section 组，优先沿用该 section 结构；不要再为一级分组额外包 `Card` 叠出第二层主容器
- supporting section 仍属于同一个 `form-body`；不要把它翻译成第二层白卡、独立 panel shell 或新的局部 workspace

## 栅格与横向滚动

- 三栏全页编辑默认 `gutter: 40`
- 三栏全页编辑默认 `row-gap: 0`
- 抽屉双栏默认 `gutter: 32`
- 抽屉表单 `Grid.Row` 必须显式 `rowGap={0}`
- 字段 grid 只拥有列数、横向 gutter 与必要的 `min-width: 0`
- `full-page-edit` 的字段 grid 不得拥有纵向节奏：不要新增 `row-gap`、`padding-bottom`、`margin-bottom`，也不要靠最后一行留白给 footer 人造分隔
- 全页编辑只在**宿主内容槽宽度**不足以承载三栏时才降为两栏；不要用粗暴的 viewport 断点提前收成两栏
- `de-DE / th-TH / ar-SA` 在 `<=1366px` 时默认优先降为 2 列；`>=1440px` 可回到 3 列，但仍以宿主内容槽宽度为准
- 非中文 label 默认不要写死窄宽度；优先通过上方标签、内容 padding 与 auto layout 承接文本膨胀
- 需要时在表单作用域内处理 `.hi-v5-grid-col` 的 `min-width: 0` / `flex-shrink`
- 不要靠常态 `overflow-x: auto` 掩盖布局错误

## 禁止

- 不要通过页面级 `.hi-v5-form-item { margin-bottom / margin-top }` 去控制整页字段节奏
- 不要通过页面级 `.hi-v5-form` / `.hi-v5-form-label` / `.hi-v5-form-item__label` 的上下间距去制造分组尾部留白
- 不要让字段 grid 通过 `gap: 24px 40px`、`padding-bottom`、`margin-bottom` 去制造 footer 上方的统一空白带
- 不要用自写 grid、自由 wrapper、第二层白底主体或 panel 容器去组织 `form-body` 一级 section；命中这类需求时，先声明 supporting section，再判断是否已升级到 `controlled-extension`
