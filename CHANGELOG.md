# 更新日志

## 1.5.22

- 修复 `<Datepicker />` type 为 timeperiod 点击 24 小时，日期显示错误 [#1604](https://github.com/XiaoMi/hiui/issues/1604)
## 1.5.21

- 修复 `<Datepicker />` 某些场景下日期面板定位计算错误的问题 [#908](https://github.com/XiaoMi/hiui/issues/908)

## 1.5.20

- 修复 `<Datepicker />` 范围选择非受控情况下失效的问题 [#906](https://github.com/XiaoMi/hiui/issues/906)

## 1.5.19

- 修复 `<Upload />` pictureCard 模式下点击上传无反应的问题 [#808](https://github.com/XiaoMi/hiui/issues/808)
- 修复 `<Cascader />` 下拉选项不能自适应文字宽度产生折行的问题 [#811](https://github.com/XiaoMi/hiui/issues/811)

## 1.5.18

- 修复 `<Upload />` 上传文件大小超过 maxSize 限制后没有提示反馈的问题 [#764](https://github.com/XiaoMi/hiui/issues/764)

## 1.5.17

- 修复 `<Form />` 动态渲染的时候removeField存在问题 [#636](https://github.com/XiaoMi/hiui/issues/636)

## 1.5.15

- 修复 `<Modal/>` 决定定位采用百分比，导致内部组件随窗口变动布局错误 [#765](https://github.com/XiaoMi/hiui/issues/765)

## 1.5.14

- 修复：`<Upload />` 照片上传、拖拽上传数量达到限制时的展示状态 [#757](https://github.com/XiaoMi/hiui/issues/757)

## 1.5.13

- 修复 `<Button />` target 不起作用 [#747](https://github.com/XiaoMi/hiui/issues/747)

## 1.5.12

- 修复 `<Checkbox />` 改变值不生效的问题 [#743](https://github.com/XiaoMi/hiui/issues/743)

## 1.5.11

- 修复 `<Datepicker />` 选中日期和当日重合是的展示问题 [#732](https://github.com/XiaoMi/hiui/pull/732)

## 1.5.9

- 修复 `<Datepicker />` 清空后起始时间为 1970 的问题 [#720](https://github.com/XiaoMi/hiui/pull/720)

## 1.5.8

- 修复：`<Timepicker />` 在时间列表滚动时引起的日期变化问题 [#499](https://github.com/XiaoMi/hiui/issues/499)
- 修复 `Form.Item` 组件不传 label 属性依旧占位的问题 [#504](https://github.com/XiaoMi/hiui/issues/504)

## 1.5.7

- 修复：`<Form />` Form.Item 丢失的问题 [#472](https://github.com/XiaoMi/hiui/issues/472)

## 1.5.6

- 修复：`<Form />` ref 无法获取 validate 方法的 bug [#469](https://github.com/XiaoMi/hiui/issues/469)

## 1.5.5

- 修复：`<DatePicker />` 范围选择初始值不正确的问题 [#338](https://github.com/XiaoMi/hiui/issues/338)
- 修复：`<Form />` 的横向显示，FormItem 组件不传 label 属性的时候，内容会上移的问题 [#436](https://github.com/XiaoMi/hiui/issues/436)

## 1.5.4

- 修复：`<DatePicker />` 范围选择初始值不正确的问题 [#338](https://github.com/XiaoMi/hiui/issues/338)
- 修复：`<Form />` 的横向显示，FormItem 组件不传 label 属性的时候，内容会上移的问题 [#436](https://github.com/XiaoMi/hiui/issues/436)

## 1.5.3

- 新增：`<Upload />` 组件上传图片后点击展示支持旋转 [#183](https://github.com/XiaoMi/hiui/issues/183)
- 新增：`<Upload />` 组件上传数量限制 [#249](https://github.com/XiaoMi/hiui/issues/249)
- 新增：`<Upload />` 组件样式优化，交互调整 [#274](https://github.com/XiaoMi/hiui/issues/274)[#297](https://github.com/XiaoMi/hiui/issues/297)
- 修复：`<Input />` 组件 `type = amount` 时显示错误的问题 [#409](https://github.com/XiaoMi/hiui/issues/409)
- 修复：`<Button />` 修改按钮逻辑，去除图标与文字间元素，通过内容控制间距。调整行高等逻辑 [#418](https://github.com/XiaoMi/hiui/issues/418)
- 修复：`<Table />` 记忆功能 [#420](https://github.com/XiaoMi/hiui/issues/420)

## 1.5.2

- 修复：`<Upload />` 组件放入 `<Form.Item />` 后 `onChange return false` 无效 [#344](https://github.com/XiaoMi/hiui/issues/344)
- 新增：`<DatePicker />` 组件 `timeperiod` 模式支持自定义时间间隔 [#349](https://github.com/XiaoMi/hiui/issues/349)

## 1.5.1

- 新增：`<Select />` 组件 `onClick` `onBlur` `onFocus` 事件回调函数 [#321](https://github.com/XiaoMi/hiui/issues/321)
- 修复：`<Select />` 组件的对齐问题 [#322](https://github.com/XiaoMi/hiui/issues/322)
- 修复：`<Button />` 组件 `disabled` 仍可触发点击事件的问题 [#324](https://github.com/XiaoMi/hiui/issues/324)
- 修复：`<Form />` 组件 `inline` 模式下顶部不对齐的问题 [#325](https://github.com/XiaoMi/hiui/issues/325)

## 1.5.0

- 新增：`<Select />` 组件 `onChange` 支持获取改变值 [#291](https://github.com/XiaoMi/hiui/issues/291)
- 新增：`<Tree />` 组件 `onCheck` 事件 [#267](https://github.com/XiaoMi/hiui/issues/267)
- 新增：`<Select />` 组件支持控制下拉菜单展示的属性 [#262](https://github.com/XiaoMi/hiui/issues/262)
- 新增：`<Button />` 组件 loading 状态 [#166](https://github.com/XiaoMi/hiui/issues/166)
- 新增：`<Timeline />` 时间轴组件 [#239](https://github.com/XiaoMi/hiui/issues/239)
- 新增：`<Loading />` 组件 UI 样式 [#238](https://github.com/XiaoMi/hiui/issues/238)
- 新增：`<Tooltip />` 组件 api 调用功能 [#240](https://github.com/XiaoMi/hiui/issues/240)
- 新增：`<Transfer />` 穿梭框组件 [#108](https://github.com/XiaoMi/hiui/issues/108)
- 新增：`<Rate />` 评分组件 [#106](https://github.com/XiaoMi/hiui/issues/106)
- 新增：`<Switch />` 开关组件 [#107](https://github.com/XiaoMi/hiui/issues/107)
- 新增：`<Card />` 组件[#113](https://github.com/XiaoMi/hiui/issues/113)
- 优化：`<Datepicker />` 组件，调整新的 UI，增加新的 API [#105](https://github.com/XiaoMi/hiui/issues/105)
- 优化：`<Tree />` 组件，增加搜索、拖拽、编辑功能 [#112](https://github.com/XiaoMi/hiui/issues/112)

## 1.4.6

- 修复：`<Select />` 组件搜索特殊字符造成的崩溃问题 [#294](https://github.com/XiaoMi/hiui/issues/294)
- 修复：`<Form />` 组件 `label` 文字超长时造成的浮动问题 [#295](https://github.com/XiaoMi/hiui/issues/295)
- 修复：`<Form />` 组件验证规则未写 `trigger` 时也会触发验证的问题 [#296](https://github.com/XiaoMi/hiui/issues/296)

## 1.4.5

- 修复：`<Input />` 组件 `textarea` 调整大小时的 UI 展示问题 [#152](https://github.com/XiaoMi/hiui/issues/152)
- 修复：`<Select />` 组件单选、多选高度不一致的问题 [#201](https://github.com/XiaoMi/hiui/issues/201)
- 修复：`<Select />` 组件多选禁用还可以勾选的问题 [#218](https://github.com/XiaoMi/hiui/issues/218)
- 修复：`<Cascader />` 组件 `displayRender` 会触发两次的问题 [#246](https://github.com/XiaoMi/hiui/issues/246)
- 修复： `<Radio />` 组件在 `id === 0` 时回调参数错误的问题 [#259](https://github.com/XiaoMi/hiui/issues/259)
- 修复： `<Input />` 组件前、后缀的内容被带回到实际值的问题 [#282](https://github.com/XiaoMi/hiui/issues/282)

## 1.4.4

- 修复：`<Upload />` 上传组件预览问题 [#200](https://github.com/XiaoMi/hiui/issues/200)
- 新增：`<Tabs />` 切换组件 en-US 文档 [#221](https://github.com/XiaoMi/hiui/issues/221)
- 新增：`<Icon />` 图标 15 个 [#123](https://github.com/XiaoMi/hiui/issues/123)

## 1.4.3

- 修复： `<Upload />` 组件 Ref 引起的图片闪烁问题

## 1.4.2

- 修复： `<Datepicker />` 快捷选择问题
- 修复： `<Cascader />` ref 引起的不能正确渲染的问题
- 修复： `<Cascader />` 面板不能正确关闭的问题
- 修复： `<Upload />` 上传后的错误信息展示问题
- 修复： `<Input />` 组件没有输入时清空按钮的展示问题及 suffix/prefix 下的文本对齐问题
- 修复： `<Counter />` 组件的失焦后的展示 bug 和组件按钮的对齐问题
- 修复： `<Navmenu />` 当只有一个标签时导致的渲染问题

## 1.4.1

- 新增：部分组件测试用例
- 新增：`<Tabs />`组件
- 修改：`<Datepicker />` 可以通过 placeholder 属性传入默认占位符
- 修复： `<Checkbox />` 组件在被销毁时，没有清空已选择项的问题
- 修改： `<Pagination />` 组件
  - 新增两种简单分页样式，分别通过 `simple` | `shrink` 属性控制
  - 修改完整分页的使用说明
- 修改: 部分组件的 BEM 规范
- 新增：HIUI 设计说明 及 模板文档
- 修改：为 HIUI 文档引入了新的 classic-theme
- 新增：Notification 增加 duration 自动关闭时间
- 新增：Tree 增加 withLine 属性
- 其它一些问题修正:
  - Button 传入 icon 时，文字不显示的问题
  - Cascader 点击外部区域的关闭异常问题
  - Cascader value 为数字类型时引起的问题
  - Counter 组件传入的 value/step/min/max 为字符串引起的问题

## 1.3.5

- 新增： `<Datepicker />` 组件可通过 placeholder 自定义占位符
- 新增：`<Select />` 组件支持 JSONP 的 origin 配置
- 新增：`<Table />` 组件功能
  - 可通过 `size`属性指定表格的大小，值：large normal small
  - 可通过 `bordered` 属性指定表格是否显示线框

## 1.3.0

- 新增：`<Select />` 异步请求时增加 loading；
- 修改：优化 `<Form />` 组件横排时的错误文案显示；
- 修改：`<Upload />` 组件；
  - 废弃 `uploadType` 属性，改为 `type`，接收 `normal`、`drag`、`pictureCard`、`avatar`、`photo`；
  - 新增 `width`、`height`，应用于头像上传的裁切框尺寸定义；
  - 废弃 `onUploadSuccess`、`onDeleteSuccess` 事件回调；
  - 废弃 `deleteParam` 属性；
  - 新增 `beforeUpload`、`customUpload`、`onChange`、`onRemove` 钩子函数。
- 修改：`<Table />` 组件；
  - 分页条位置逻辑；
  - 弃用 `scroll` 属性，新增 `scrollX` 属性；
  - `fixTop` 吸顶属性同时兼容 `boolean` 及 `number`。
- 修改：`<Tree />`；
  - 重写内部实现逻辑；
  - 增加半选状态。
- 修改：修复 `<NavMenu />` 组件在某些情况下无法得到父元素的宽度而引起的页面崩溃问题；
- 修改：修复 `<Pagination />` 组件页岁数过多时的样式问题。

## 1.2.0

- 新增：`<Button />` 组件增加图标设置；
- 新增：`<Table />` 组件支持外部设置、求和等操作；
- 新增：`<Input />` 组件增加支持前、后缀元素。
- 修改：修改 `<Layout />` 为 `<Grid />`；
- 修改：优化 `<Form />` 组件结构；
- 修改：优化 `<Modal />` 组件结构；
- 修改：优化 `<Grid />` 组件结构；
- 修改：修改 `<Popover />`、`<Dropdown />`、`<Tooltip />` 组件挂载到 `<body>` 下；
- 修改：修改 `<Popover />`、`<Dropdown />`、`<Tooltip />`、`<Cascader />`、`<Select />` 组件定位问题；
- 修改：重新设定所有浮层组件 z-index。

## 1.1.1

- 修改：修复 `<Button />` 在使用旧版 api 时的样式兼容；
- 修改：修复 `<Checkbox />` 占据整行及点击区域的 bug。

## 1.1.0

- 修改：按钮组件 `<Button />` API 调整，向前兼容；
- 修改：修改 `<Notification />` 回调改为非必填项，关闭按钮可配置；
- 修改：修复 `<Input />` 组件类型为 `textarea` 时高度不自适应的 bug；
- 修改：修复 `<Cascader />` 引用大小写的 bug；
- 修改：修复 `<Counter />` 能低于最小值的 bug；
- 文档：切换 sass-lint 到 style-lint。
- 文档：增加多语言、配色切换文档。

## 1.0.3

- 新增：级联选择器 `<Cascader />` 组件；
- 新增：进度条 `<Progress />` 组件；
- 新增：`<Tree />` 组件增加点击事件；
- 修改：修正 `<NavMenu />` 不动态更新的 bug；
- 修改：修改 `<DatePicker />` 依赖 date-fns，修改范围选择结束时间；
- 修改：修正文档语言切换的 bug；
- 文档：工作流优化，增加 sass-lint，所有组件无需单独引用样式。

## 1.0.2

- 更新：`<Stepper />` 组件，支持主题切换；
- 修改：重构 `<Select />` 支持自定义 option；
- 文档：更新 README；
- 文档：支持主题、语言切换。

## 1.0.0

- 第一个公开版本，发布基本组件；
- 发布 HIUI 首页和文档。

---

## Roadmap

- 增加 `<Switch />` 组件
- 增加 `<Card />` 组件
- 增加 `<Menu />` 组件
- 增加 `<Transfer />` 组件
- 优化 `<DatePicker />` 组件，优化范围选择逻辑
- [More](https://github.com/XiaoMi/hiui/issues)……
