---
"@hi-ui/date-picker": patch
"@hi-ui/hiui": patch
---

<br>
- fix(date-picker): 加强 valueAdapter 逻辑处理，当值是数组并且是范围类型时，再做转换 (5.0)

- perf(date-picker): 优化 contained 模式下的点击事件交互&范围选择的交互优化 (5.0)

- fix(date-picker): footerRender 中的 onPick 参数支持 Date 类型 (5.0)

- fix(date-picker): 修复 onSelect 回调没有处理 utcOffset 的问题 (5.0)

- fix(date-picker): 修复在 showTime 模式下，选择时间后没有触发 onSelect 回调的问题 (5.0)

- fix(date-picker): 修复周选择模式下 2026 年第一周显示为 2025-W53 问题 (5.0)

- perf(date-picker): 优化跨月范围选择交互体验，选择跨月日期时，自动切换面板月份 (5.0)

- fix(date-picker): 修复 weekOffset 设置不为 0 的值时会选中 2 周的问题 (5.0)

- fix(date-picker): 修复 weekOffset 设置为 3、4、5、6 时显示 2 周选中的问题 (5.0)
