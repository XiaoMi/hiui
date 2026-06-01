---
"@hi-ui/hiui": patch
"@hi-ui/popover": patch
---

<br>
- fix(popover): 修复设置 visible 后,关闭时没有触发 onClose 问题 (5.0)

- fix(popover): 给 onOpen 方法包裹 useLatestCallback，防止频繁触发 (5.0)

- perf(popover): 优化通过方法调用组件时的渲染和打开方式 (5.0)
