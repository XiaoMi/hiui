# Umi / Max 宿主适配片段

## 适用范围

- `umi`
- `@umijs/max`

## 默认策略

- Umi / Max 不属于原生兼容载体；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
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
3. 在应用入口引入本地运行时样式 `src/components/hiui-design-runtime/styles.css`
4. 真实业务页继续落在 Umi 原有路由体系中

## 不要做的事

- 不要按 Vite 普通项目假设 `src/main.tsx`
- 不要把 `src/typical-page-preview/routes/config.tsx` 当成正式业务路由长期保留
- 不要直接复制当前项目 layout 覆盖 Umi 现有布局

## 推荐 smoke

- 先挑一个真实业务列表页接典型页壳
- 再验证一个全页编辑页
- 最后验证一个抽屉页
