# 表单共享规则

适用于：

- 全页编辑
- 抽屉表单

## P0

- 可编辑场景必须有 `Form` 根；不要只散落 `FormItem`
- 默认 `labelPlacement: 'top'`
- 表单字段能力以当前项目接入的 HiUI5 `Form` / `SchemaForm` / `schema-core` 支持能力为准；文档中出现的 `Text`、`Select`、`Date`、`CheckSelect`、`Upload`、`Textarea` 等都只是常见类型示例，不构成封闭列表
- 基础输入控件默认沿用 HiUI 5 基线：`32px` 高、`6px` 圆角、`1px solid #E5E6EB`、focus ring `0 0 0 2px #BDE2FF`
- 标签文字默认 `14 / 400 / #4E5969`，控件文字默认 `14 / 400 / #1A1D26`，占位默认 `#91959E`
- disabled 默认背景 `#F2F3F5`、文字 `#BABCC2`；不要在单页里随意改成新灰阶
- `Upload`、长 `Textarea` 等宽控件默认整行
- 二级子分组内容区不要再整体水平缩进
- 二级标题统一为 `3x14` 色块 + `9px` 间距 + `48px` 高行，标题字重 `600`；标题与字段区不要再额外叠 `12px`
- 若需要补颜色、字阶、按钮、容器等通用视觉基线，回看 `../hiui5-visual-baseline.md`

## 分组约定

- 一级分组标题默认不依赖强装饰物建立层级，优先通过字重、字号和区块节奏表达信息层级
- 表单分组默认服务字段组织，不额外承担第二层页面壳职责；不要通过分组容器再造新的大白卡体系

## 栅格与横向滚动

- 具体列数、`gutter`、`rowGap` 由页型专章定义；shared 只约束这些参数必须服从页型网格，而不是按单页自由发明
- 需要时在表单作用域内处理 `.hi-v5-grid-col` 的 `min-width: 0` / `flex-shrink`
- 不要靠常态 `overflow-x: auto` 掩盖布局错误

## 关键组件与属性契约

这里只写页面规范会约束到的关键 props，不重复组件库完整 API 文档。

### `Form`

- `groups` / `fields`：表单内容入口；应由 schema / group 配置驱动，不要把字段散成一批手写控件。
- `formProps.labelPlacement`：默认 `top`；它定义标签布局语法，不应用来切换成另一套详情式左右结构。
- `initialValues`：只负责回填默认值或详情回填结果，不承载布局和展示层逻辑。
- `borderedGroups`：控制分组是否自带描边；是否开启由页型专章定义，不单页随意切换。
- `gridProps`：控制表单网格。
  `columnCount`：列数由页型决定。
  `gutter`：列间距由页型决定。
  `rowGap`：行间距由页型决定；抽屉表单这类页型会有强制约束。

### `SchemaForm`

- `fields`：字段 schema 列表；字段能力以 HiUI5 / schema 运行时支持能力为准，不按文档示例做白名单。
- `formRef`：表单实例引用；用于校验、提交前校验和读取值，不承担布局职责。
- `grid` / `column`：是否开启网格和默认列数；具体值仍服从页型专章。
- `formProps`：表单级视觉和交互语法入口，最关键的是 `labelPlacement`。
- `gridProps`：与 `Form.gridProps` 同语义；页面规范主要约束 `columnCount`、`gutter`、`rowGap`。
- `borderedGroups`：是否给分组补边框；不要为了“更明显”在单页里随意打开或关闭。

### 字段级 props / MWP

- `Required`：表达校验语义，不改变布局。
- `Placeholder`：表达输入提示，不应用长说明文本顶替帮助文案系统。
- `MWP.span`：字段跨列的主要入口；长文本、上传、富输入等宽字段应优先通过它收口。
- `MWP.colSpan`：当桥接到描述或特定布局语义时使用；仍需服从页型网格。
- `MWP.className`：只用于补充受控样式挂点，不应用来重造第二套组件皮肤。

### 组配置

- `GS().Fields(...)`：定义一级 / 二级分组内的字段集合，是分组主入口。
- `GS().CardProps(...)`：定义分组容器表现；是否允许卡片化、卡片尺寸和边距节奏由页型专章控制。
- `Simple()` / 其他 group mode：决定分组渲染形态；不要在没有页型依据时混用多套 group mode。
