# Next App Router 宿主适配片段

## 适用范围

- `next` 且存在 `app/layout.tsx`

## 默认策略

- 默认使用 `rules-only`
- 保留 Next App Router 的 layout 层级
- 典型页页面按 client component 方式嵌入原有业务页面

## 先找接入点

优先检查：

- `app/layout.tsx`
- `src/app/layout.tsx`

## 最小接法

1. 在根或业务 layout 中预留 header / footer slot
2. 在 client boundary 内提供 `TypicalPageHostProvider`
3. 在允许的入口引入 `@hiui-design/typical-page-shells/styles.css`
4. 典型页组件所在页面标记为 client component

## 不要做的事

- 不要把当前项目的 route gallery 原样搬进 App Router
- 不要把依赖 browser API 的典型页直接当 server component 渲染
- 不要假设存在 `react-router-dom` 路由文件

## 推荐 smoke

- 先验证一个列表页是否能正常 portal 页头
- 再验证一个全页编辑页的底栏和滚动
