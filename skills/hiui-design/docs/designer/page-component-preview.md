# Page Component Preview for Designers

页面组件预览用于让设计师理解“标准 HiUI 典型页如何落到当前接入模式”。它不是新设计稿，也不是业务页截图替代品。

## 预览应展示

- 使用的 `pageType` 与 `baseMoldId`。
- 使用的 `pageComponent`、mode、adapter。
- 可用组件清单与认证状态：来自 `typical-page:capabilities --json` 的 `assets.pageComponents` / `assets.pageComponentMatrix`，或 `typical-page:list-assets --type page-components --json`。
- 锁定区域：例如 header、white-body、query-filter、table、pagination、main-scroll。
- 可编辑业务槽位：标题、筛选字段、表格列、行操作、mock / API。
- 受控扩展槽位：例如 `topNotice`、`toolbarSupplement`。
- 不能修改的结构：额外白底、额外滚动、分页归属、壳层 carrier。

## 原型 / 旧系统升级说明

预览报告必须区分：

- `preserved`：保留的业务事实。
- `normalized`：按 HiUI 规范化的旧结构。
- `discarded`：明确丢弃的旧页面噪声或重复结构。
- `unmappedSourceElements`：无法放入标准槽位或受控扩展的内容。
- `needsDesignerConfirmation`：需要设计确认的语义或结构差异。
