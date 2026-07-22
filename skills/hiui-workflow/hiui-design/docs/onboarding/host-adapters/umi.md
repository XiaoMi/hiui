# Umi / Max 宿主适配片段

## 适用范围

- `umi`
- `@umijs/max`

## 默认策略

- 默认使用 `rules-only`
- 不把当前项目的宿主壳整包同步进目标项目
- 在 Umi 现有布局内补 `TypicalPageHostProvider`

## 先找接入点

优先检查：

- `src/layouts/index.tsx`
- `src/app.tsx`
- `config/config.ts` 或 `.umirc.ts`

## 最小接法

1. 在宿主布局层提供 header / footer 挂载点
2. 在布局层包一层 `TypicalPageHostProvider`
3. 在应用入口引入 `@hiui-design/typical-page-shells/styles.css`
4. 真实业务页继续落在 Umi 原有路由体系中

## 不要做的事

- 不要按 Vite 普通项目假设 `src/main.tsx`
- 不要把 `src/typical-page-reuse/routes/config.tsx` 当成正式业务路由长期保留
- 不要直接复制当前项目 layout 覆盖 Umi 现有布局

## 推荐 smoke

- 先挑一个真实业务列表页接典型页壳
- 再验证一个全页编辑页
- 最后验证一个抽屉页
