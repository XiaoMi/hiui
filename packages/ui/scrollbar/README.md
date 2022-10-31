# Scrollbar 滚动条

滚动条用于跨系统统一滚动视觉样式、行为，便捷监听滚动事件

## 何时使用

需要统一滚动条视觉样式，或者需要监听某些特殊滚动事件，比如滚动到底部、滚动到顶部

## 使用示例

<!-- Inject Stories -->

## Props

| 参数              | 说明                                              | 类型                     | 可选值                                                                                                                                 | 默认值     |
| ----------------- | ------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| position          | 容器 css position                                 | string                   | "-moz-initial" \| "inherit" \| "initial" \| "revert" \| "unset" \| "-webkit-sticky" \| "absolute" \| "fixed" \| "relative" \| "sticky" | 'relative' |
| axes              | 开启功能的轴                                      | string                   | "both" \| "x" \| "y" \| "none"                                                                                                         | 'both'     |
| keepVisible       | 轴一直保持可视状态(优先级高于`onlyScrollVisible`) | boolean                  | -                                                                                                                                      | false      |
| onlyScrollVisible | 只有滚动的时候才会展示滚动条                      | boolean                  | -                                                                                                                                      | false      |
| onScrollY         | y 轴滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onScrollX         | x 轴滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onScrollUp        | 向上滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onScrollDown      | 向下滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onScrollLeft      | 向左滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onScrollRight     | 向右滚动                                          | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onYReachStart     | y 轴抵达最开始                                    | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onYReachEnd       | y 轴抵达最后                                      | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onXReachStart     | x 轴抵达最开始                                    | (e: CustomEvent) => void | -                                                                                                                                      | -          |
| onXReachEnd       | x 轴抵达最后                                      | (e: CustomEvent) => void | -                                                                                                                                      | -          |
