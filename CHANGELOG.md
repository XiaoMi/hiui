# 更新日志

## 2.14.0

- 优化 `<Menu />` 垂直模式收起后没有配置 icon 的展示效果 [#1167](https://github.com/XiaoMi/hiui/issues/1167)
- 修复 `<Progress />` 环形边框颜色问题 [#1165](https://github.com/XiaoMi/hiui/issues/1165)
- 新增 `<Transfer />` onDragStart/onDragEnd/onDrop 回调函数 [#1162](https://github.com/XiaoMi/hiui/issues/1162)

## 2.13.0

- 修复 `<Checkbox />` 行高不正确问题 [#1061](https://github.com/XiaoMi/hiui/issues/1061)
- 修复 `<Select />` title 为 nubmer 类型时的问题 [#1077](https://github.com/XiaoMi/hiui/issues/1077)
- 修复 `<Select />` 在单选情况下受控时清空报错的问题 [#1070](https://github.com/XiaoMi/hiui/issues/1070)
- 修复 `<Select />` 优化弹窗位置计算触发机制 [#1072](https://github.com/XiaoMi/hiui/issues/1072)
- 修复 `<Select />` 受控模式的异步多选,默认选项消失的问题 [#1047](https://github.com/XiaoMi/hiui/issues/1047)
- 修复 `<Form />` validate 验证不通过回调函数没有调用的问题 [#1059](https://github.com/XiaoMi/hiui/issues/1059)
- 修复 `<Form />` 校验不通过时的样式问题 [#1042](https://github.com/XiaoMi/hiui/issues/1042) [#1036](https://github.com/XiaoMi/hiui/issues/1036)
- 修复 `<Cascader />` 高度不正确问题 [#1053](https://github.com/XiaoMi/hiui/issues/1053)
- 修复 `<Cascader />` 同时展开多个的问题 [#1066](https://github.com/XiaoMi/hiui/issues/1066)
- 修复 `<Notification />`、`<Message />` 白色背景的问题 [#1049](https://github.com/XiaoMi/hiui/issues/1049)
- 修复 `<Upload />` 上传过程中 maxCount 不起作用的问题 [#1032](https://github.com/XiaoMi/hiui/issues/1032)
- 修复 `<Upload />` 拖拽上传时，tips 展示不正确的问题 [#1041](https://github.com/XiaoMi/hiui/issues/1041)
- 修复 `<DatePicker />` 点击每月 31 号，输入框显示异常的问题 [#1039](https://github.com/XiaoMi/hiui/issues/1039)
- 修复 `<DatePicker />` 在 type 为 date 时执行了农历方法的问题 [#1050](https://github.com/XiaoMi/hiui/issues/1050)
- 修复 `<DatePicker />` 切换月异常的问题 [#1079](https://github.com/XiaoMi/hiui/issues/1079)
- 修复 `<Select />` 异步多选受控时，选中项会重复添加的问题 [#1044](https://github.com/XiaoMi/hiui/issues/1044)
- 修复 `<Tabs />` 嵌套使用 type 不生效的问题 [#1046](https://github.com/XiaoMi/hiui/issues/1046)
- 修复 `<Menu />` activeId 发生改变时展开选中项 [#1029](https://github.com/XiaoMi/hiui/issues/1029)
- 修复 `<Menu />` 异步获取数据时，activeId 失效的问题 [#1027](https://github.com/XiaoMi/hiui/issues/1027)
- 修复 `<Tree />` editable 和 searchable 不同同时使用的问题 [#1023](https://github.com/XiaoMi/hiui/issues/1023)
- 优化 `<WaterMark />` 展示效果 [#1024](https://github.com/XiaoMi/hiui/issues/1024)
- 优化 `<Timeline />` 展示效果 [#1086](https://github.com/XiaoMi/hiui/issues/1086)[#1048](https://github.com/XiaoMi/hiui/issues/1048)
- 优化 `<Tree />` 拖拽性能 [#1087](https://github.com/XiaoMi/hiui/issues/1087)
- 新增 `<Tree />` onBeforeSave onBeforeDelete 函数 [#1093](https://github.com/XiaoMi/hiui/issues/1093)
- 新增 `<Tag />` 普通模式配色 [#1060](https://github.com/XiaoMi/hiui/issues/1060)
- 新增 `<Tabs />` 线性模式 [#1088](https://github.com/XiaoMi/hiui/issues/1088)
- 新增 `<Menu />` 支持单独选中父级菜单 [#1038](https://github.com/XiaoMi/hiui/issues/1038)
- 新增 `<Modal />` confirm 调用方式 [#1090](https://github.com/XiaoMi/hiui/issues/1090)
- 新增 `<Datepicker />` 支持宽度调整 [#1033](https://github.com/XiaoMi/hiui/issues/1033)
- 新增 `<Datepicker />` 增加月范围选择和年范围选择面板 [#1074](https://github.com/XiaoMi/hiui/issues/1074)
- 新增 `<Datepicker />` 快捷方式「近半年」 [#1063](https://github.com/XiaoMi/hiui/issues/1063)
- 新增 `<Cascader />` trigger 属性配置选项展开的触发方式 [#1092](https://github.com/XiaoMi/hiui/issues/1092)
- 新增 `<Pagination />` onPageSizeChange 可通过返回 false 来防止触发 onChange [#1091](https://github.com/XiaoMi/hiui/issues/1091)
- 新增 `<Stepper />` 支持通过 icon 配置 HiUI icon [#1064](https://github.com/XiaoMi/hiui/issues/1064)
- 新增 `<Tree />` contextMenu 增加层级回调参数 [#1021](https://github.com/XiaoMi/hiui/issues/1021)
- 新增多语言繁体支持 [#1062](https://github.com/XiaoMi/hiui/issues/1062)

## 2.12.0

- 新增 `<Watermark />` 水印组件 [#121](https://github.com/XiaoMi/hiui/issues/121)
- 修复 `<Tree />` 多选模式下在禁用状态复选框样式异常的问题 [#1014](https://github.com/XiaoMi/hiui/issues/1014)
- 修复 `<Select />` DataSource 配置 headers 参数无效的问题 [#1011](https://github.com/XiaoMi/hiui/issues/1011)

## 2.11.1

- 修复打包印度节假日数据问题

## 2.11.0

- 新增 `<DatePicker />` altCalendarPreset 预设历法信息（支持中国农历和印度节假日），altCalendar 自定义日期显示，dateMarkRender 自定义日期右上角显示标志，dateMarkPreset 预设右上角显示标志「班」和「休」 [#902](https://github.com/XiaoMi/hiui/issues/902)[#992](https://github.com/XiaoMi/hiui/issues/992)
- 修复 `<Menu />` 高亮、展开对应菜单项不正确的问题 [#993](https://github.com/XiaoMi/hiui/issues/993)
- 优化若干视觉还原问题：[#990](https://github.com/XiaoMi/hiui/issues/990) [#991](https://github.com/XiaoMi/hiui/issues/991) [#998](https://github.com/XiaoMi/hiui/issues/998) [#1000](https://github.com/XiaoMi/hiui/issues/1000) [#954](https://github.com/XiaoMi/hiui/issues/954) [#1001](https://github.com/XiaoMi/hiui/issues/1001) [#1002](https://github.com/XiaoMi/hiui/issues/1002) [#1003](https://github.com/XiaoMi/hiui/issues/1003) [#1004](https://github.com/XiaoMi/hiui/issues/1004) [#1005](https://github.com/XiaoMi/hiui/issues/1005)

## 2.10.0

- 新增 `<Upload />` onDownload 点击上传成功文件的回调 [#613](https://github.com/XiaoMi/hiui/issues/613)
- 优化 `<Select />` 可搜索模式下自动获取输入框焦点 [#925](https://github.com/XiaoMi/hiui/issues/925)
- 优化 `<Carousel />` 轮播定位交互，并新增 showPages 是否显示页码指示器 [#925](https://github.com/XiaoMi/hiui/issues/925)
- 修复 `<Select />` 异步模式下有默认值不能正常使用的问题 [#962](https://github.com/XiaoMi/hiui/issues/962)
- 优化若干视觉还原问题：[#952](https://github.com/XiaoMi/hiui/issues/952) [#958](https://github.com/XiaoMi/hiui/issues/958) [#971](https://github.com/XiaoMi/hiui/issues/971) [#973](https://github.com/XiaoMi/hiui/issues/973) [#975](https://github.com/XiaoMi/hiui/issues/975) [#976](https://github.com/XiaoMi/hiui/issues/976) [#977](https://github.com/XiaoMi/hiui/issues/977) [#983](https://github.com/XiaoMi/hiui/issues/983)[#987](https://github.com/XiaoMi/hiui/issues/987)

## 2.9.0

- 新增 `<Progress />` active 属性展示加载动效 [#941](https://github.com/XiaoMi/hiui/issues/941)
- 新增 `<Upload />` 拖拽用法支持多选上传 [#942](https://github.com/XiaoMi/hiui/issues/942)
- 新增 `<DatePicker />` disabledDate 属性自定义日期禁选 [#943](https://github.com/XiaoMi/hiui/issues/943)
- 优化 `<Collapse />` 视觉效果 [#937](https://github.com/XiaoMi/hiui/issues/937)
- 修复 `<Dropdown />` 点击外部区域不能正常隐藏菜单的问题 [#947](https://github.com/XiaoMi/hiui/issues/947)
- 修复`<Upload />`同时上传多个文件的展示问题 [#948](https://github.com/XiaoMi/hiui/issues/948)
- 修复 `<Upload />` 上传过程中点击取消功能无效的问题 [#938](https://github.com/XiaoMi/hiui/issues/938)
- 修复部分组件国际化适配不完全的问题 [#951](https://github.com/XiaoMi/hiui/issues/951)

## 2.8.0

- 新增 `<Tree />` 默认高亮 [#915](https://github.com/XiaoMi/hiui/issues/915)
- 新增 `<Table />` withCredentials 属性 [#922](https://github.com/XiaoMi/hiui/issues/922)
- 修复 `<Transfer />` 单选模式下 targetLimit 无效的问题 [#919](https://github.com/XiaoMi/hiui/issues/919)
- 修复 `<Select />` 多选出现双滚动条的样式问题 [#920](https://github.com/XiaoMi/hiui/issues/920)
- 修复 `<Button />` 链接用法样式问题 [#923](https://github.com/XiaoMi/hiui/issues/923)
- 修复 `<Dropdown />` 按钮样式 icon 边距问题 [#927](https://github.com/XiaoMi/hiui/issues/927)
- 修复主题配色适配组件不完全的问题 [#733](https://github.com/XiaoMi/hiui/issues/733)

## 2.7.0

- 新增 `<Checkbox />` 垂直样式 [#883](https://github.com/XiaoMi/hiui/issues/883)
- 新增 `<Dropdown />` placement 可选项 'bottom-end' 和 'top-end' [#891](https://github.com/XiaoMi/hiui/issues/891)
- 新增 `<Upload />` withCredentials 属性 [#905](https://github.com/XiaoMi/hiui/issues/905)
- 新增 `<Tree />` 文件夹样式 [#913](https://github.com/XiaoMi/hiui/issues/913)
- 优化 `<Menu />` 水平模式交互 [#884](https://github.com/XiaoMi/hiui/issues/884)
- 优化 `<Select />` 异步单选和异步多选交互模式 [#903](https://github.com/XiaoMi/hiui/issues/903)
- 优化 `<Upload />` 预览交互 [#893](https://github.com/XiaoMi/hiui/issues/893)
- 优化 `<Transfer />` 可搜索时清除按钮的出现交互 [#890](https://github.com/XiaoMi/hiui/issues/890)
- 优化 `<Tree />` 编辑节点的交互，输入为空时不可保存 [#889](https://github.com/XiaoMi/hiui/issues/889)
- 优化 `<Transfer />` 多选未选中时的展示效果 [#888](https://github.com/XiaoMi/hiui/issues/888)
- 优化若干视觉还原问题：[#841](https://github.com/XiaoMi/hiui/issues/841) [#842](https://github.com/XiaoMi/hiui/issues/842) [#843](https://github.com/XiaoMi/hiui/issues/843) [#844](https://github.com/XiaoMi/hiui/issues/844) [#845](https://github.com/XiaoMi/hiui/issues/845) [#848](https://github.com/XiaoMi/hiui/issues/848) [#851](https://github.com/XiaoMi/hiui/issues/851) [#852](https://github.com/XiaoMi/hiui/issues/852) [#853](https://github.com/XiaoMi/hiui/issues/853) [#854](https://github.com/XiaoMi/hiui/issues/854) [#855](https://github.com/XiaoMi/hiui/issues/855) [#856](https://github.com/XiaoMi/hiui/issues/856) [#857](https://github.com/XiaoMi/hiui/issues/857) [#858](https://github.com/XiaoMi/hiui/issues/858) [#859](https://github.com/XiaoMi/hiui/issues/859) [#862](https://github.com/XiaoMi/hiui/issues/862) [#869](https://github.com/XiaoMi/hiui/issues/869) [#871](https://github.com/XiaoMi/hiui/issues/871) [#872](https://github.com/XiaoMi/hiui/issues/872) [#873](https://github.com/XiaoMi/hiui/issues/873) [#874](https://github.com/XiaoMi/hiui/issues/874) [#875](https://github.com/XiaoMi/hiui/issues/875) [#876](https://github.com/XiaoMi/hiui/issues/876) [#886](https://github.com/XiaoMi/hiui/issues/886) [#895](https://github.com/XiaoMi/hiui/issues/895) [#896](https://github.com/XiaoMi/hiui/issues/896) [#897](https://github.com/XiaoMi/hiui/issues/897) [#898](https://github.com/XiaoMi/hiui/issues/898) [#899](https://github.com/XiaoMi/hiui/issues/899) [#900](https://github.com/XiaoMi/hiui/issues/900) [#901](https://github.com/XiaoMi/hiui/issues/901)

## 2.6.4

- 修复 `<Table />` 多级表头和多选同时使用的问题 [#867](https://github.com/XiaoMi/hiui/issues/867)
- 修复 `<Tree />` onSave 入参不正确的问题 [#850](https://github.com/XiaoMi/hiui/issues/850)

## 2.6.3

- 修复 `<Button />` target 属性不起作用的问题 [#837](https://github.com/XiaoMi/hiui/issues/837)
- 优化 `<Tabs />` 设置 max 后选中的展示问题 [#838](https://github.com/XiaoMi/hiui/issues/838)

## 2.6.2

- 修复 `<Form />` labelPosition 兼容属性不生效的问题 [#828](https://github.com/XiaoMi/hiui/issues/828)
- 修复 `<Transfer />` type 的问题 [#821](https://github.com/XiaoMi/hiui/issues/821)
- 修复 `<Counter />` step 为负值，max 和 min 不起作用的问题 [#799](https://github.com/XiaoMi/hiui/issues/799)
- 优化 `<Cascader />` filterOption [#832](https://github.com/XiaoMi/hiui/issues/832)
- 修复 `<Cascader />` 受控问题 [#830](https://github.com/XiaoMi/hiui/issues/830)

## 2.6.1

- 修复 `<Cascader />` 不能正确通过搜索过滤选项的问题 [#812](https://github.com/XiaoMi/hiui/issues/812)
- 修复 `<Cascader />` 下拉选项不能自适应文字宽度产生折行的问题 [#811](https://github.com/XiaoMi/hiui/issues/811)
- 修复 `<Transfer />` 全选状态不能正确展示的问题 [#799](https://github.com/XiaoMi/hiui/issues/799)

## 2.6.0

- 新增 `<Tree />` 右键菜单允许自定义内容[#217](https://github.com/XiaoMi/hiui/issues/217)
- 新增 `<Tree />` 异步加载时的加载状态 [#744](https://github.com/XiaoMi/hiui/issues/744)
- 新增 `<DatePicker />` daterange / weekrange 类型下，可直接选择年份/月份 [#801](https://github.com/XiaoMi/hiui/issues/801)
- 新增 `<Transfer />` onChange 函数入参 dir（穿梭方向）、movedItems（穿梭数据项） [#793](https://github.com/XiaoMi/hiui/issues/793)
- 新增 `<Transfer />` targetSortType 解决穿梭项的排序问题 [#792](https://github.com/XiaoMi/hiui/issues/792)
- 修复 `<DatePicker />` daterange 类型日期选择器展开时间与面板展示时间不一致的问题 [#794](https://github.com/XiaoMi/hiui/issues/794)

## 2.5.4

- 优化 `<Select />` 异步多选的交互，支持多次搜索选择 [#774](https://github.com/XiaoMi/hiui/issues/774)
- 修复 `<Select />` dataSource 不能根据搜索项动态调整请求参数的问题 [#781](https://github.com/XiaoMi/hiui/issues/781)
- 修复 `<Upload />` 上传文件大小超过 maxSize 限制后，缺少反馈信息的问题 [#764](https://github.com/XiaoMi/hiui/issues/764)
- 修复 `<Cascader />` filterOption 属性不能按预期过滤选项的问题 [#770](https://github.com/XiaoMi/hiui/issues/770)
- 修复 `<Cascader />` value 控制组件显示失效的问题 [#784](https://github.com/XiaoMi/hiui/issues/784)
- 修复 `<DatePicker />` 日期范围选择器选择时间后，面板仅展示日期的问题 [#785](https://github.com/XiaoMi/hiui/issues/785)

## 2.5.3

- 修复 `<Select />` 异步多选在输入关键字时会清除已选择项的问题 [#746](https://github.com/XiaoMi/hiui/issues/746)
- 修复 `<Loading />` 在某些情况下导致页面布局发生变化的问题 [#749](https://github.com/XiaoMi/hiui/issues/749)
- 修改 `<Upload />` photo 模式、drag 模式下超出数量限制的展现形式 [#756](https://github.com/XiaoMi/hiui/issues/756)
- 修复 `<Rate />` 组件的控制台警告 [#760](https://github.com/XiaoMi/hiui/issues/760)

## 2.5.2

- 修复 `<Tabs />` 编辑模式下删除最后一个 tab 报错的问题 [#735](https://github.com/XiaoMi/hiui/issues/735)
- 修复 `<Select />` value 解析不正确的问题 [#737](https://github.com/XiaoMi/hiui/issues/737)
- 修复 `<Cascader />` 搜索后结果展示宽度太窄的问题 [#721](https://github.com/XiaoMi/hiui/issues/721)

## 2.5.1

- 修复 `<Input />` defaultValue 设置无效的问题 [#717](https://github.com/XiaoMi/hiui/issues/717)
- 修复 `<Upload />` 拖拽上传场景下，删除文件不正确的问题 [#705](https://github.com/XiaoMi/hiui/issues/705)
- 修复 `<Menu />` showAllSubMenus 对传入 data 的容错问题 [#687](https://github.com/XiaoMi/hiui/issues/687)
- 修复 `<DatePicker />` format 后格式不符合预期的问题 [#712](https://github.com/XiaoMi/hiui/issues/712)
- 修复 `<TimePicker />` 清空后再次打开面板清空无效的问题 [#722](https://github.com/XiaoMi/hiui/issues/722)
- 修复 `<Popover />` 在某些场景下显示、隐藏的顺序不正确的问题 [#706](https://github.com/XiaoMi/hiui/issues/706)
- 修复 `<Tree />` 国际化支持不完全的问题 [#729](https://github.com/XiaoMi/hiui/issues/729)
- 修复 `<Dropdown />` 数据项 href 仅点击文字才能跳转的问题 [#726](https://github.com/XiaoMi/hiui/issues/726)

## 2.5.0

- 新增 `<Cascader />` filterOption 属性支持自定义搜索 [#704](https://github.com/XiaoMi/hiui/issues/704)
- 修复 `<Cascader />` 刷新后 value 不能正确显示的问题 [#667](https://github.com/XiaoMi/hiui/issues/667)
- 修复 `<Pagination />` pageSizeOptions 写法兼容性问题 [#703](https://github.com/XiaoMi/hiui/issues/703)
- 修复 `<Carousel />` 第一张图向前翻页跳转不正确的问题 [#696](https://github.com/XiaoMi/hiui/issues/696)
- 修复 兼容属性 legacy 造成的组件污染问题 [#708](https://github.com/XiaoMi/hiui/issues/708)
- 修复 `<DatePicker />` 传入字符串值时控制台抛出的警告问题 [#709](https://github.com/XiaoMi/hiui/issues/709)

## 2.4.1

- 修复 `<Table />` 多选失效的问题 [#699](https://github.com/XiaoMi/hiui/issues/699)

## 2.4.0

- 修复 `<Select />` 没有适配主题色的问题 [#257](https://github.com/XiaoMi/hiui/issues/257)
- 修复 `<Tabs />` 空状态下报错的问题 [#674](https://github.com/XiaoMi/hiui/issues/674)
- 修复 `<Radio />` 非受控状态下切换失效的问题 [#683](https://github.com/XiaoMi/hiui/issues/683)
- 修复 `<Cascader />` 清空搜索展示不正确的问题 [#333](https://github.com/XiaoMi/hiui/issues/333)
- 修复 `<Collpase />` disabled 没有样式区分的问题 [#483](https://github.com/XiaoMi/hiui/issues/483)
- 修复 `<Checkbox />` 非受控情况下 onChange 参数不全的问题 [#688](https://github.com/XiaoMi/hiui/issues/688)
- 修复 `<Table />` 多选的显示问题 [#685](https://github.com/XiaoMi/hiui/issues/685)
- 修复 `<Pagination />` 每页大小切换无效的问题 [#691](https://github.com/XiaoMi/hiui/issues/691)
- 新增 `<Upload />` 增加 loading 状态 [#680](https://github.com/XiaoMi/hiui/issues/680)
- 新增 `<Upload />` 增加照片墙预览提示 icon [#490](https://github.com/XiaoMi/hiui/issues/490)
- 新增 `<Select />` filterOption 属性支持自定义搜索 [#673](https://github.com/XiaoMi/hiui/issues/673)

## 2.3.0

- 修复 `<Checkbox />` 同时渲染多个 context provider 的问题 [#649](https://github.com/XiaoMi/hiui/issues/649)
- 修复 `<Select />` 同等宽度下，多选和单选的 placeholder 和展开箭头没有对齐的问题 [#661](https://github.com/XiaoMi/hiui/issues/661)
- 修复 `<Table />` 表头渲染不正确的问题 [#625](https://github.com/XiaoMi/hiui/issues/625)
- 修复 `<Popover />` 初次 hover 触发时移入气泡框，气泡框会消失的问题 [#650](https://github.com/XiaoMi/hiui/issues/650)
- 修复 `<Counter />` 部分情况下展示不正确的问题 [#593](https://github.com/XiaoMi/hiui/issues/593)
- 修复 `<Pagination />` 关于 "javascript:void(0)" 的警告 [#656](https://github.com/XiaoMi/hiui/issues/656)
- 修复 `<TimePicker />` 层级太低的问题 [#637](https://github.com/XiaoMi/hiui/issues/637)
- 新增 `<TimePicker />` 配置支持 [#638](https://github.com/XiaoMi/hiui/issues/638)
- 新增 `<Dropdown />` 多级数据支持 [#594](https://github.com/XiaoMi/hiui/issues/594)
- 新增 `<Dropdown />` 自定义展开项宽度支持 [#444](https://github.com/XiaoMi/hiui/issues/444)
- 新增 `<Form />` Form.Item label 支持 ReactNode [#664](https://github.com/XiaoMi/hiui/issues/664)

## 2.2.1

- 修复 `<Select />` 多选时历史数据污染的问题 [#606](https://github.com/XiaoMi/hiui/issues/606)
- 修复 `<Checkbox />` data 无法更新的问题 [#603](https://github.com/XiaoMi/hiui/issues/603)
- 修复 `<Radio />` data 无法更新的问题 [#607](https://github.com/XiaoMi/hiui/issues/607)
- 修复 `<Notification />` 组件销毁没有清空定时器的问题 [#624](https://github.com/XiaoMi/hiui/issues/624)
- 修复 `<Notification />` onClose 失效的问题 [#627](https://github.com/XiaoMi/hiui/issues/627)
- 修复 `<DatePicker />` 长度不够展示时间被遮挡的问题 [#615](https://github.com/XiaoMi/hiui/issues/615)
- 修复 `<Form />` 动态渲染的时候 removeField 数量不正确的问题 [#636](https://github.com/XiaoMi/hiui/issues/636)

## 2.2.0

- 新增 `<Carousel />` 走马灯组件 [#115](https://github.com/XiaoMi/hiui/issues/115)
- 新增 `<DatePicker />` clearable 属性控制是否可清空 [#590](https://github.com/XiaoMi/hiui/issues/590)
- 新增 `<Tooltip />` visible 属性手动控制显示或隐藏 [#589](https://github.com/XiaoMi/hiui/issues/589)
- 新增 `<Popover />` visible 属性手动控制显示或隐藏 [#588](https://github.com/XiaoMi/hiui/issues/588)
- 修复 `<Select />` 异步用法 params 不生效的问题 [#587](https://github.com/XiaoMi/hiui/issues/587)
- 修复 `<Tooltip />` 包裹禁用按钮时不能隐藏的问题 [#583](https://github.com/XiaoMi/hiui/issues/583)
- 修复 `<Popover />` 中含输入项时失焦造成的问题 [#581](https://github.com/XiaoMi/hiui/issues/581)
- 修复 `<Tree />` 清空搜索条件后无法收起的问题 [#561](https://github.com/XiaoMi/hiui/issues/561)

## 2.1.2

- 修复 `<Input />` clearable 不生效的问题 [#580](https://github.com/XiaoMi/hiui/issues/580)
- 修复 `<Upload />` 中的自定义上传结合 maxCount 不能上传的问题 [#582](https://github.com/XiaoMi/hiui/issues/582)
- 修复 `<Input />` type 为 textarea 时的底部的样式问题 [#584](https://github.com/XiaoMi/hiui/issues/584)

## 2.1.0

- 新增 `<Breadcrumb />` 面包屑组件 [#573](https://github.com/XiaoMi/hiui/issues/573)
- 新增 `<Tree />` 线型展示模式 [#541](https://github.com/XiaoMi/hiui/issues/541)
- 修复 `<Upload />` 中的自定义上传同一个文件失败的问题 [#567](https://github.com/XiaoMi/hiui/issues/567)
- 修复 `<Switch />` 重复渲染问题 [#565](https://github.com/XiaoMi/hiui/issues/565)
- 修复 `<Collapse />` activeId 无效的问题 [#560](https://github.com/XiaoMi/hiui/issues/560)

## 2.0.5

- 修复 `<Tooltip />` hover 的闪烁问题 [#522](https://github.com/XiaoMi/hiui/issues/522)
- 修复 `<Upload />` maxCount 结合 onChange return false 的计算错误问题 [#549](https://github.com/XiaoMi/hiui/issues/549)
- 修复 `<Dropdown />` 部分区域点击无效的问题 [#555](https://github.com/XiaoMi/hiui/issues/555)
- 修复 `<Menu />` 高亮项计算错误的问题 [#556](https://github.com/XiaoMi/hiui/issues/556)

## 2.0.4

- 修复：`DatePicker.format` 方法丢失的问题 [#540](https://github.com/XiaoMi/hiui/issues/540)
- 修复：`<Radio />` 垂直布局的问题 [#545](https://github.com/XiaoMi/hiui/issues/545)
- 修复：`<Card />` 增加默认背景色 [#546](https://github.com/XiaoMi/hiui/issues/546)
- 优化：过滤`<Input />` 、 `<Counter />` 无关属性 [#547](https://github.com/XiaoMi/hiui/issues/547)

## 2.0.2

- 修复：`<Menu />` 组件未传入图标时收起的显示问题 [#529](https://github.com/XiaoMi/hiui/issues/529)

## 2.0.1

- 修复：`<Table />` 组件服务端表格分页和错误请求处理的问题 [#519](https://github.com/XiaoMi/hiui/issues/519)
- 修复：`<Tag />` 、`<Message />` 组件的导出问题 [#516](https://github.com/XiaoMi/hiui/issues/516)
- 修复：`<Upload/>` 组件 onchange 返回 boolean 无效的问题 [#514](https://github.com/XiaoMi/hiui/issues/514)

## 2.0.0

- 修改：`<Dropdown />`
  - 废弃 `list` 属性，使用 `data` 属性代替
- 修改：`<Pagination />` 组件
  - 废弃 `mode` 属性，使用 `type` 属性代替
  - 新增 `current` 受控属性
  - 新增 `max` 最大页数属性
  - 废弃`hideOnSinglePage` 属性，使用 `autoHide` 属性代替
  - 废弃`sizeChangeEvent` 属性，使用`onPageSizeChange` 属性代替
  - 废弃`showQuickJumper` 属性，使用`showJumper`属性代替
- 修改：`<Stepper />` 组件
  - 废弃`id`属性
  - 废弃 `list` 属性，使用`data` 属性代替
  - 废弃`vertical` 属性，使用`placement` 属性代替
  - 废弃`up` 属性，使用`itemLayout` 属性代替
- 修改：`<Menu />` 组件
  - 废弃`mode` 属性，使用`placement` 属性代替
  - 废弃`mini` 属性，使用`collapsed` 属性代替
  - 废弃`miniToggle` 属性，使用`showCollpse` 属性代替
  - 废弃`onMiniChange` 属性，使用`onCollapse` 属性代替
- 修改：`<Form />` 组件
  - 废弃`labelPosition` 属性，使用`labelPlacement` 属性代替
  - 废弃`inline` 属性，使用`placement` 属性代替
- 修改：`<Select />` 组件
  - 废弃`mode` 属性，使用`type` 属性代替
  - 废弃`multipleMode` 属性
  - 废弃`list` 属性，使用`data` 属性代替
  - 废弃`origin` 属性，使用`dataSource` 属性代替
  - 废弃`noFoundTip` 属性，使用`emptyContent` 属性代替
  - 新增`render` 属性
- 修改：`<Cascader />` 组件
  - 废弃`options` 属性，使用`data` 属性代替
  - 废弃`noFoundTip` 属性，使用`emptyContent` 属性代替
  - 废弃`origin` 属性，使用`dataSource` 属性代替
  - 废弃`noFoundTip` 属性，使用`emptyContent` 属性代替
  - 新增`render` 属性
- 修改：`<Radio />` 组件
  - 废弃`list` 属性，使用`data` 属性代替
  - 废弃`name` 属性
  - 废弃`align` 属性
  - 废弃`layout` 属性，使用`placement` 属性代替
  - 废弃`mode` 属性，使用`type` 属性代替
  - 新增`autoFocus` 属性
- 修改：`<Checkbox />` 组件
  - 废弃`name` 属性
  - 废弃`align` 属性
  - 废弃`all` 属性
  - 废弃`list` 属性
  - 新增`autoFocus` 属性
  - 新增`defaultChecked` 属性
  - 新增`indeterminate` 属性
  - 新增`<Checkbox.Group />` 组件
- 修改：`<Switch />` 组件
  - 废弃`size` 属性
- 修改：`<Datepicker />` 组件
  - 废弃`minDate` 属性，使用`min` 属性代替
  - 废弃`maxDate` 属性，使用`max` 属性代替
  - 新增`defaultValue` 属性
- 修改：`<Upload />` 组件
  - 废弃`width` `height` 属性
  - 废弃`buttonIcon` 属性
  - 废弃`buttonText` 属性，使用`content` 属性代替
  - 废弃`param` 属性，使用`params` 属性代替
  - 新增`maxSize` 属性
  - 新增`maxCount` 属性
  - 新增`tips` 属性
- 修改：`<Rate />` 组件
  - 废弃`allowClear` 属性，使用`clearable` 属性代替
- 修改：`<Collapse />` 组件
  - 废弃`activeKey` 属性，使用`activeId` 属性代替
  - 废弃`arrow` 属性，使用`arrowPlacement` 属性代替
  - 新增`showArrow` 属性
  - 废弃`type` 属性
- 修改：`<Tooltip />` 组件
  - 重写 Tooltip.open 方法
- 修改：`<Progress />` 组件
  - 废弃原`type` 属性，使用`apperance` 属性代替
  - 废弃`text` 属性，使用`content` 属性代替
  - 废弃`withOutText` 属性，使用`showInfo` 属性代替
  - 废弃原`status` 属性，使用`type` 属性代替
  - 废弃`inside` 属性，使用`placement` 属性代替
  - 新增`width` `height` 属性
- 修改：`<Card />` 组件
  - 废弃`extraShow` 属性，使用`extraType` 属性代替
  - 废弃`description` 属性，使用`content` 属性代替
  - 废弃`cover` 属性，使用`coverUrl` 属性代替
- 修改：`<Timeline />` 组件
  - 废弃`layout` 属性，使用`type` 属性代替
  - 废弃`list` 属性，使用`data` 属性代替
  - 修改`data`中的 `description`属性为 `content`
  - 修改`data`中的 `dot`属性为 `icon`
- 修改：`<Modal />` 组件
  - 废弃`backDrop` 属性，使用`maskCloseable` 属性代替
  - 废弃`footers` 属性，使用`footer` 属性代替
  - 废弃`closeBtn` 属性，使用`closeable` 属性代替
- 修改：`<Notification />` 组件
  - 废弃`message` 属性，使用`content` 属性代替
  - 新增`key` 属性
  - 废弃`showClose` 属性，使用`closeable` 属性代替
  - 新增`confirmText` 属性
  - 新增`duration` 属性
- 修改：`<Alert />` 组件
  - 废弃`message` 属性，使用`content` 属性代替
  - 新增`key` 属性
  - 废弃`autoClose` `autoCloseTime` 属性，使用`duration` 属性代替
- 修改：`<Badge />` 组件
  - 废弃`value` 属性，使用`content` 属性代替
  - 废弃`dot` 属性，使用`type` 属性代替
  - 废弃`hidden` 属性，使用`visible` 属性代替
  - 新增`color` 属性
- 修改：`<Loading />` 组件
  - 废弃`tip` 属性，使用`content` 属性代替
  - 废弃`show` 属性，使用`visible` 属性代替
  - 废弃`target` 属性
- 修改：`<Tabs />` 组件
  - 废弃`defaultActiveKey` 属性，使用`defaultActiveId` 属性代替
  - 废弃`showTabsNum` 属性，使用`max` 属性代替
  - 新增`activeId` 属性

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
- 修复：`<Table />` 吸顶后的 bug [#429](https://github.com/XiaoMi/hiui/issues/429)

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
