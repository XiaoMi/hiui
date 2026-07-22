# After-Sales Business-Line Examples

这是售后业务线的 host-integration overlay。

它不是一套独立于通用层的新示例库，而是覆盖在 `examples/host-integration/` 之上的差异层：

- 新增 `售后` 路由分组
- 提供 `工单工作台`
- 提供 `售卖管理`

使用时仍需先同步通用层，再通过 `--line after-sales` 叠加本目录。
