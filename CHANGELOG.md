# 更新日志

## 3.2.1

- 修复 `Form` 在页面渲染完成后 调用中 setFieldsValue 无效问题 [#1408](https://github.com/XiaoMi/hiui/issues/1408)
- 修复 `Rate` 组件在快速移动显示异常问题 [#1410](https://github.com/XiaoMi/hiui/issues/1410)
- 修复 `DatePicker` type 不受控问题 [#1401](https://github.com/XiaoMi/hiui/issues/1401)
- 修复 `Select` 下拉框默认选中行显示错误 [#1405](https://github.com/XiaoMi/hiui/issues/1405)

## 3.2.0

- 新增 HiUI 基础样式 css 文件 [#1338](https://github.com/XiaoMi/hiui/issues/1338)
- 新增 `Table` expandedRowKeys，onExpand 扩展内嵌式表格的展开操作 [#1378](https://github.com/XiaoMi/hiui/issues/1378)
- 修复 `List` 组件导出问题 [#1314](https://github.com/XiaoMi/hiui/issues/1314)
- 修复 `Tabs` Tabs.Pane 组件中 tabTitle 属性传入 ReactNode 报错问题 [#1320](https://github.com/XiaoMi/hiui/issues/1320)
- 修复 `Upload` onRemove 的问题 [#1322](https://github.com/XiaoMi/hiui/issues/1322)
- 修复 `DatePicker` 受控无法选中值问题 [#1326](https://github.com/XiaoMi/hiui/issues/1326)
- 修复 `Table` 列操作 icon 丢失问题 [#1336](https://github.com/XiaoMi/hiui/issues/1336)
- 修复 `Table` 表头吸顶层级显示问题 [#1318](https://github.com/XiaoMi/hiui/issues/1318)
- 修复 `Table` 内嵌式设置列宽不正确的问题 [#1325](https://github.com/XiaoMi/hiui/issues/1325)
- 修复 `SelectTree` 下拉选择上滑动显示异常 [#1351](https://github.com/XiaoMi/hiui/issues/1351)
- 修复 `Form` 包裹 Select 设置 searchable 属性时候，显示异常 [#1343](https://github.com/XiaoMi/hiui/issues/1343)
- 修复 `Form` Form.List 和 Form.Item 同一级混用显示异常问题 [#1345](https://github.com/XiaoMi/hiui/issues/1345)
- 修复 `DatePicker` weekOffset 为 1 时 周与日对照显示异常 [#1352](https://github.com/XiaoMi/hiui/issues/1352)
- 修复 `Input` type 等于 amount 时，数据初始化展示问题 [#1346](https://github.com/XiaoMi/hiui/pull/1346)
- 修复 `Input` 添加前后置节点聚焦问题 [#1342](https://github.com/XiaoMi/hiui/pull/1342)
- 修复 `Select` 异步多选下拉数据显示问题 [#1364](https://github.com/XiaoMi/hiui/issues/1364)
- 修复 `SelectTree` 异步加载子节点数据显示位置错误以及国际化适配等问题 [#1386](https://github.com/XiaoMi/hiui/issues/1386)
- 修复 `Progress` placement 为 inside 时，字显示折行问题 [#1385](https://github.com/XiaoMi/hiui/issues/1385)
- 优化 `Select` 下拉框展开收起，输入框内容存在显示差异[#1380](https://github.com/XiaoMi/hiui/issues/1380)
- 修复 `Select` 滚动报错问题[#1390](https://github.com/XiaoMi/hiui/issues/1390)
- 优化 `Search` 后置元素应该收起下拉选项 [#1341](https://github.com/XiaoMi/hiui/issues/1341)
- 优化 `Form` 组件 label 内容显示折行行高以及间距 [#1376](https://github.com/XiaoMi/hiui/issues/1376)
- 优化 `Pagination` 国际化翻译 [#1381](https://github.com/XiaoMi/hiui/issues/1381)
- 修复 `Table` rowSelection 存在时的列冻结异常 [#1393](https://github.com/XiaoMi/hiui/issues/1393)
- 修复 `Table` 国际化问题 [#1397](https://github.com/XiaoMi/hiui/issues/1397)
- 优化 `Table` 树形表格 children 为空数组时的展示问题 [#1370](https://github.com/XiaoMi/hiui/issues/1370)
- 优化 `Tree` 内部计算逻辑，提升多条数据的渲染性能 [#1369](https://github.com/XiaoMi/hiui/issues/1369)
- 优化 `Modal` 当屏幕高度小于 Moadal 高度的交互效果 [#1348](https://github.com/XiaoMi/hiui/issues/1348)

## 3.1.0

- 新增 `Card` bordered 属性配置是否显示边框 [#1296](https://github.com/XiaoMi/hiui/issues/1296)
- 修复 `Input` 在受控状态下，设置 value 为 null 时报错问题 [#1246](https://github.com/XiaoMi/hiui/issues/1246)
- 修复 `Select` 设置 autoload 为 true 时无限的调用接口问题 [#1249](https://github.com/XiaoMi/hiui/issues/1249)
- 修复 `Select` 异步多选，点击清空下拉数据未清空问题 [#1293](https://github.com/XiaoMi/hiui/issues/1293)
- 修复 `Timepicker` 弹出层在页面底部未翻转到上方问题 [#1253](https://github.com/XiaoMi/hiui/issues/1253)
- 优化 `Timepicker` 支持字符串格式的 value [#1245](https://github.com/XiaoMi/hiui/issues/1245)
- 修复 `SelectTree` 弹出层在页面底部不能翻转问题 [#1254](https://github.com/XiaoMi/hiui/issues/1254)
- 修复 `DatePicker` 周范围显示异常问题 [#1267](https://github.com/XiaoMi/hiui/issues/1267)
- 修复 `SelectTree` data 数据中 Children 为空数组报错问题 [#1261](https://github.com/XiaoMi/hiui/issues/1261)
- 修复 `SelectTree` 在 Form 包裹下样式显示异常 [#1310](https://github.com/XiaoMi/hiui/issues/1310)
- 修复 `Tag` 使用 ref 无效问题 [#1262](https://github.com/XiaoMi/hiui/issues/1262)
- 修复 `Table` data 为 undefined 时的报错问题 [#1265](https://github.com/XiaoMi/hiui/issues/1265)
- 修复 `Loading` 显示不正确的问题 [#1265](https://github.com/XiaoMi/hiui/issues/1268)
- 优化 `SelectTree` 样式问题 [#1272](https://github.com/XiaoMi/hiui/issues/1272)
- 修复 `Tag` 闪烁问题 [#1273](https://github.com/XiaoMi/hiui/issues/1273)
- 修复 `Timeline` 折断样式问题 [#1276](https://github.com/XiaoMi/hiui/issues/1276)
- 修复 `Timeline` 只有一条数据时的样式问题 [#1277](https://github.com/XiaoMi/hiui/issues/1277)
- 修复 `SelectTree` 受控问题 [#1283](https://github.com/XiaoMi/hiui/issues/1283)
- 修复 `Popover` 包裹函数组件无法触发问题 [#1282](https://github.com/XiaoMi/hiui/issues/1282)
- 修复 `Pagination` 输入页码后回车键报错的问题 [#1299](https://github.com/XiaoMi/hiui/issues/1299)
- 优化 `Upload` 不同 type 文件类型默认值 [#1286](https://github.com/XiaoMi/hiui/issues/1286)
- 优化 `Filter` 返回值问题 [#1288](https://github.com/XiaoMi/hiui/issues/1288)
- 优化 `Tabs` 线型模式样式 [#1291](https://github.com/XiaoMi/hiui/issues/1291)
- 优化 `Breadcrumb` 渲染方式 [#1303](https://github.com/XiaoMi/hiui/issues/1303)
- 优化 `Form` 组件 Form.Item 宽度设置问题 [#1295](https://github.com/XiaoMi/hiui/issues/1295)

## 3.0.0

- 新增：`Slider` 滑块组件 [#1225](https://github.com/XiaoMi/hiui/issues/1225)
- 新增：`SelectTree` 树形选择器组件 [#1231](https://github.com/XiaoMi/hiui/issues/1231)
- 新增：`List` 列表组件 [#1226](https://github.com/XiaoMi/hiui/issues/1226)
- 新增：`Filter` 筛选组件 [#1227](https://github.com/XiaoMi/hiui/issues/1227)
- 新增：`Search` 搜索组件 [#1228](https://github.com/XiaoMi/hiui/issues/1228)
- 新增：`Drawer` 抽屉组件 [#1229](https://github.com/XiaoMi/hiui/issues/1229)
- 新增：`RichTextEditor` 富文本编辑器 [#1236](https://github.com/XiaoMi/hiui/issues/1236)
- 新增：`CodeEditor` 代码编辑器使用示例
- 新增常见图表样式支持（基于 echarts 封装）[#388](https://github.com/XiaoMi/hiui/issues/388)
- 全新的 `Form` 组件 [#1234](https://github.com/XiaoMi/hiui/issues/1234)
  - 新增 `SchemaForm`，可通过 Schema 配置使用 `Form`。
  - 新增 `useForm`，通过 `Form.useForm` 对表单数据域进行交互。
  - 新增 `Form.List`，方便对表单项进行增加删除
  - 新增 `Submit`、`Reset` 等快捷组件，方便用户重置和提交数据
  - 优化表单中的表单项值的管理，不再由用户进行 `setState`
  - 优化 `Form` 输出数据的内容格式，用户可通过设置 `field` 进行相关格式的设置
  - 优化表单的校验相关功能
- 全新的 `DatePicker` 组件 [#1235](https://github.com/XiaoMi/hiui/issues/1234)
  - 优化快捷选项功能，允许用户自定义快捷选项
  - 优化选择日期相关交互
  - 优化日期面板相关样式
- 全新的 `Icon` 组件 [#1224](https://github.com/XiaoMi/hiui/issues/1224)
  - 内部改为 svg 实现方式
  - 重新调整视觉效果
  - 新增大量图标
- 全新的 `Tree` 组件 [#1232](https://github.com/XiaoMi/hiui/issues/1232)
  - 调整了 Tree 的内部实现，提升了性能
  - 样式进行了优化
  - 优化了 api
- 全新的 `Table` 组件 [#359](https://github.com/XiaoMi/hiui/issues/359)
  - 优化了 api
  - 视觉交互重新调整
  - 支持树形表格
  - 支持列对齐
  - 支持动态控制列宽
  - 支持标准模式
  - 支持控制行高亮
  - 支持控制列高亮
  - 优化了列冻结
  - 优化了表头吸顶
  - 优化了列调整，支持调整列的顺序
- 全新的 `Rate` 组件 [#1237](https://github.com/XiaoMi/hiui/issues/1237)
  - 支持自定义字体图标，文字甚至图片以及评分选中颜色
  - 支持根据评分自定义渲染图标
  - 优化辅助文字显示位置
  - 新增只读形态。
- `Breadcrumb` 组件升级 [#1230](https://github.com/XiaoMi/hiui/issues/1230)
  - 修正最后一级的 hover 时的高亮效果
- `Cascader` 组件升级
  - 修正了受控、非受控模式
- `Dropdown` 组件升级 [#1238](https://github.com/XiaoMi/hiui/issues/1238)
  - 修正选项具有 `href` 属性时点击可跳转
- `Select` 组件升级
  - 新增 `fieldNames` API，方便根据返回数据显示下拉框的内容
  - 新增 `showJustSelected` API，方便快速对下拉选项进行操作
  - 新增下拉数据的**分组**展示形式
  - 优化 `dataSource`，请求数据方式以及支持返回多种类型
  - 修正多选异步数据回显问题
- `Switch` 组件升级
  - 修正了 onChange 的触发时机 [#1223](https://github.com/XiaoMi/hiui/issues/1223)
  - 修正了受控、非受控模式 [#633](https://github.com/XiaoMi/hiui/issues/633)
- `Rate` 组件升级 [#1083](https://github.com/XiaoMi/hiui/issues/1083)
  - 支持自定义辅助文字
  - 支持自定义渲染效果
- `Tabs` 组件升级
  - 可扩展用法增加滚动条模式 [#1222](https://github.com/XiaoMi/hiui/issues/1222)
  - 支持拖拽 [#641](https://github.com/XiaoMi/hiui/issues/641)
- `Card` 组件升级 [#1220](https://github.com/XiaoMi/hiui/issues/1220)
  - 样式调整
  - 废弃 extraType 属性
  - 新增 showHeaderDivider 属性展示卡片头部的分割线
- `Modal` 组件升级 [#1221](https://github.com/XiaoMi/hiui/issues/1221)
  - 进行了样式调整，重点优化了 Modal.confirm 的视觉效果
- `Tag` 组件升级 [#1233](https://github.com/XiaoMi/hiui/issues/1233)
  - 新增圆角形态
  - 新增标签组用法
- 主题配色调整，并使用 css variable 实现主题配色的切换 [#256](https://github.com/XiaoMi/hiui/issues/256)
- 增加 Typescript 类型定义文件 [#181](https://github.com/XiaoMi/hiui/issues/181)

## 2.x

[更新日志汇总](https://github.com/XiaoMi/hiui/blob/master/CHANGELOG.md)

## 1.x

[更新日志汇总](https://github.com/XiaoMi/hiui/blob/stable/1.x/CHANGELOG.md)
