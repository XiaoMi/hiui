# 全页分组详情

## 速览

- 何时读：已经判定为 `full-page-detail`，或抽屉详情超出容量后落全页
- 核心规则：字段表达继续以 `Descriptions` / `SchemaDescriptionsBridge` 为主，不发明字段卡体系
- 常见坑：给分组块加边框阴影，或把返回行为降级成右侧工具按钮

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `52409:60782`

## 适用

- 全页只读详情
- 抽屉详情 `>16` 条后的落地页
- 多分组 `Descriptions` / `detail-group`

## 硬门槛说明

- 本页全部规则默认按硬门槛执行，不是“详情页视觉偏好”
- 全页详情必须同时满足：`ProDetailPage` 页壳语义、`Descriptions` / `SchemaDescriptionsBridge` 主表达、`placement: 'vertical'`、默认 `column: 3`、分组详情结构、`header / white-body / detail-body` 关系、返回仍走 leading `onBack`
- 本页的 `P0`、`二级分组`、`禁止` 都属于生成与验收的强制约束；命中对应场景时不得省略
- `summary`、一级分组与媒体行必须继续收口在同一个 `white-body` 内；不允许拆成“顶部摘要卡 + 多张详情卡”或其他自由详情变体
- 即使业务页暂时放在 `host-integration` 的 `src/typical-page-reuse/pages/**` 目录里，也不能把 `ProDetailPage` 再翻译成 `scrollArea + whiteBody + hero/panel` 一类第二套工作区壳；这种写法按结构失败处理，不是“示例目录里的临时实现”
- 全页详情必须从 `examples/host-integration/src/pages/full-page-detail.tsx` 的语义骨架起步；不允许从抽屉详情、编辑页或空白详情容器临时扩写
- 若页面实现不满足这些规则，应直接判定为不合规，而不是视作“业务自定义详情布局”

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-detail-page/`
- 在批量生成同类业务页之前，必须先把 `full-page-detail.tsx` 作为 archetype smoke baseline 跑通；先锁定页头、单一白底主体与 `Descriptions vertical + 3 columns`，再生成真实详情页
- `summary`、一级分组与媒体行都必须收口在同一个 `white-body` 内；摘要区可以作为主体顶部信息块存在，但不能再长成独立白卡
- 页头 `onBack`
- 主标题 `18px / 600`
- 分组块之间竖向 `16px`
- 分组块白底、圆角 `12`、无描边、无阴影
- 一级分组 body 左右 `20`，不要写成 `24`
- 字段主表达保持 `Descriptions` / `SchemaDescriptionsBridge` 语义，不要翻译成自造字段卡网格
- `Descriptions` 继续保持 `placement: 'vertical'`
- 主体详情网格默认 `column: 3`
- 描述区行距 `16`、列距 `40`
- vertical 详情字段保持 `Descriptions` / `SchemaDescriptionsBridge` 语义骨架，但不要依赖 wrapper 的隐藏默认值；关键行为要在 props 边界显式冻结
- 若使用 `SchemaDescriptionsBridge`，必须显式写 `labelPlacement: 'left'`，并清空 bridge 默认继承的固定 `labelWidth`；不要再靠浏览器默认 `th` 对齐或页面级 CSS 去补救
- `legacy-host-compatible` / `existing-system` 若直接使用 `Descriptions`，同样不要把 `labelWidth` 写死；label 宽度应随内容自适应，不要再叠业务页本地骨架修正
- 非中文默认继续保持 `vertical` 主表达；重要字段值最多 2 行，超出 `ellipsis + tooltip`，不要把长 label 或长值硬压回固定窄宽
- 长文本项独占整行
- 图片、附件等媒体内容作为分组内的只读媒体行附着在 `detail-body` 内，不额外生成第二套摘要卡 / 媒体卡体系
- `rules-only + existing-system` 下，先锁定唯一宿主 detail archetype，再把 `header / white-body / detail-body` 与 ownership 映射写进 page contract
- 页头区域高度链保持 `60px`，标题与返回 affordance 在 header 容器中垂直居中

## 详情页中插入图表

- `full-page-detail` 中新增图表时，页面主表达仍必须保持 `Descriptions` / `SchemaDescriptionsBridge`。
- 任何新增图表都必须遵循 `hiui-design` 图表规范；不要因为它只是详情补充区，就允许使用默认图表 theme、默认 palette 或手写视觉近似图。
- 当图表承担独立业务问题、形成独立分析块或拥有单独标题 / section 边界时，必须升级为受管 `chart-section`。
- 图表仍需收口在既有 `white-body` 与 `detail-body` 的结构治理内；不要把图表区翻译成新的 `heroCard`、`summaryCard`、`fieldCard`、`mediaCard` 体系。
- 图表说明文案、趋势解读或 tool copy 不是默认产物；没有明确需求时，不要在详情页图表区自动补 explanatory copy。
- 若图表数量与阅读路径已经压过详情字段主表达，不应继续保持 `full-page-detail`，应重新判定页型。

## 二级分组

- 一级分组标题前不要加色块
- 一级分组标题默认字重 `600`
- 二级分组标题使用 `3x14` 色块 + `9px` 间距 + `48px` 高行，标题字重 `600`
- 二级标题下方不要再额外叠 `12px`
- 有二级分组时，子块内容不要再整体水平缩进

## 禁止

- 不要绕开 `ProDetailPage` 再重复手写详情白卡和滚动容器
- 不要把抽屉详情的 `360 / 600 / 2列16` 套到全页详情
- 不要给分组块加 `#EDEFF2` 边框或 `box-shadow`
- 不要让一级 body `24` 和二级 body padding 叠加出视觉缩进
- 不要把一级分组 body 的 `20px` 简化成整页内容根容器的 `padding: 20px`
- 不要新增 `heroCard` / 摘要头卡一类独立身份卡，除非设计稿明确要求且已在 page contract deviation 中声明
- 不要在 `ProDetailPage` 下再补本地 `scrollArea` / `whiteBody` / `pageRoot` 多层工作区容器；如果 DevTools 中能同时看到宿主 content slot、页面局部 scroll 容器和本地白底壳共同持有 `padding / background / radius / overflow`，说明 ownership 已经翻译失败
- 不要把 `summary`、一级分组或媒体区再各自包成独立白卡；`full-page-detail` 的默认基线是“一个白底主体 + 分组详情”，不是“顶部摘要卡 + 多张详情卡”
- 不要把字段渲染成带灰底、描边、圆角的 `fieldCard` / `fieldGrid` 体系代替 `Descriptions`
- 不要把详情字段改写成自造 label-value 列表或只读表单，即使视觉上接近示例也不合规
- 不要给 vertical 详情字段写死 `labelWidth`
- 不要把 left 对齐修补下放到页面级 label / `th` CSS；这类不变量必须通过 `Descriptions` props 或共享 bridge 适配层显式声明
- 不要继续依赖 `SchemaDescriptionsBridge` 的隐藏默认值来决定 detail-shell 的对齐和宽度分支
- 不要把返回行为翻译成 header 右侧 `titleExtra` / 工具按钮，返回仍属于 leading `onBack`
- 不要在详情页里用 `data:image/...`、`createMockImage` 一类内联大图制造示例媒体；优先真实资源或轻量缩略图
- 不要让媒体区脱离 `detail-body` 独立长成另一套主卡片层级
- 不要把详情页中的独立图表分析块包成 `summaryCard` / `panel` / `hero` 体系来绕开受管 `chart-section`
- 不要因为图表位于详情页，就允许它脱离共享 HiUI chart baseline 与 color contract

## 自检

- 是否是全页详情而非抽屉
- 是否无描边无阴影
- `summary`、一级分组和媒体区是否仍收口在同一个白底主体内，而不是拆成多张白卡
- `Descriptions` 是否仍是 `vertical + 3 columns`
- `Descriptions` 是否保留真实语义骨架，没有再补页面级 label / `th` 对齐修正
- 若使用 `SchemaDescriptionsBridge`，是否显式写出 `labelPlacement: 'left'` 并清空默认 `labelWidth`
- 一级 body 是否左右 `20`
- 根容器是否没有额外 `padding: 20px`
- 二级标题样式是否正确
- 字段是否仍以 `Descriptions` / `SchemaDescriptionsBridge` 为主表达，而不是灰底字段卡
- 是否没有 `heroCard` / `fieldCard` / `mediaCard` 一类示例外新增主容器
- 图片资源是否为轻量缩略图或真实资源，而不是内联 `data:image`
- `rules-only` 页面是否已补 page contract，并声明 `header / white-body / detail-body` 与 ownership 映射
