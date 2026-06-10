# Next Pages Router 宿主适配片段

## 适用范围

- `next` 且存在 `pages/_app.tsx`

## 默认策略

- 默认使用 `rules-only`
- 保留 Pages Router 现有 `_app` / 页面路由结构
- 典型页壳只作为页面层能力接入

## 先找接入点

优先检查：

- `pages/_app.tsx`
- `src/pages/_app.tsx`

## 最小接法

1. 在 `_app` 或共享 layout 中引入 `@hiui-design/typical-page-shells/styles.css`
2. 在共享 layout 中提供 header / footer slot
3. 在共享 layout 中挂 `TypicalPageHostProvider`
4. 业务页继续使用原有 pages 路由

## 不要做的事

- 不要按 Vite 项目去找 `src/main.tsx`
- 不要复制当前项目侧栏和路由示例覆盖 Next 现有页面结构
- 不要把典型页示例 gallery 当成正式路由长期保留

## 推荐 smoke

- 验证一个典型列表页
- 验证一个抽屉页
- 验证一个全页编辑页
