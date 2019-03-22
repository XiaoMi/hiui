# 更新日志

## 1.4.0
- 新增：部分组件测试用例
- 新增：`<Tabs />`组件
- 修改：`<Datepicker />` 可以通过placeholder属性传入默认占位符
- 修复： `<Checkbox />` 组件在被销毁时，没有清空已选择项的问题
- 修改： `<Pagination />` 组件
  - 新增两种简单分页样式，分别通过 `simple` | `shrink` 属性控制
  - 修改完整分页的使用说明
- 修改: 部分组件的 BEM 规范
- 新增：HIUI 设计说明 及 模板文档
- 修改：为 HIUI 文档引入了新的 classic-theme
- 其它一些问题修正

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
