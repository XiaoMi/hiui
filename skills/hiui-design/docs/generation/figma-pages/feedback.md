# 异常反馈页

## 何时使用

- 页面主目标是表达反馈状态，而不是展示业务数据
- 命中空状态、加载失败、页面不存在、暂无权限、页面建设中、网络异常、未连接内网等场景
- 主体内容应收口在一个居中的反馈面板里

## 示例起点

- 默认起点：`examples/host-integration/src/pages/empty-state.tsx`
- 同组参考：
  - `examples/host-integration/src/pages/load-fail.tsx`
  - `examples/host-integration/src/pages/page-not-found.tsx`
  - `examples/host-integration/src/pages/no-permission.tsx`
  - `examples/host-integration/src/pages/under-construction.tsx`
  - `examples/host-integration/src/pages/network-error.tsx`
  - `examples/host-integration/src/pages/intranet-offline.tsx`

## 壳层

- 固定结构：`宿主适配页头 portal + PageHeader + 单一白底反馈面板 + EmptyState`
- 不要误用表格页、表单页、详情页壳层

## 结构 P0

- 保留页头
- 主体区只有一个白底反馈面板
- 反馈图示、标题、说明和主次操作都收口在反馈面板内部
- 若页头存在 `extra`，其动作只承接返回、帮助、文档、全局导航等页级动作；解决当前反馈状态的主 CTA 仍必须留在反馈面板内
- 如果只是切换反馈状态，优先替换同组示例页，不要重建页面骨架

## 禁止项

- 不要套查询区、表格区、详情区或表单区
- 不要把反馈面板再嵌进第二层大白卡
- 不要把反馈图示改成临时纯文本占位
- 不要把解决当前反馈状态的主操作移到页头右侧，让面板只剩说明文案
- 不要在页头 `extra` 重复放置与反馈面板同语义的主 CTA；页头动作默认只能是页级全局动作

## 自检

- 反馈图示资源正常加载
- 面板仍然居中，白底主体关系稳定
- 主操作与次操作都留在反馈面板内
- 若存在 `PageHeader extra`，其动作仍是页级全局动作，不与反馈面板主 CTA 重复
