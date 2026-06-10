# 旧宿主下的隔离标准壳交付

## 何时读

- 项目整体仍命中 `legacy-host-compatible`
- 但当前页面明确要求**直接照搬示例页标准壳组件实现**
- 且页面允许交付到独立子应用 / 独立构建产物

## 核心结论

这不是把 legacy 模式放宽成“主树里也能直接导标准壳”，而是：

- **项目模式仍然是** `legacy-host-compatible`
- **页面交付策略切换为** `isolated-standard-shell`
- 标准壳只允许出现在独立子应用里

## 当前项目推荐落点

- 子应用目录：`subapps/typical-page-shell-runtime/`
- vendored 壳包：`.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.1.tgz`
- legacy 主树：`src/**`

约束：

- `src/**` 主树禁止直接新增 `@hiui-design/typical-page-shells` 导入
- 标准壳页面源码只能放进子应用目录
- legacy 宿主只负责打开子应用 URL、iframe 或新标签页

## 读取顺序

1. `rules/page-type-map.md`
2. `figma-page-rules.md`
3. 命中的 `figma-pages/*.md`
4. 本文件

## 页面生成规则

- 可以直接从示例页起步
- 可以直接复用 `StatListPageFrame`、`TablePageFrame`、`ProEditPage`、`ProFormDrawer` 等标准壳组件
- 可以直接引入 `@hiui-design/typical-page-shells/styles.css`
- 仍然要遵守页型专章的结构、分档、region 和 contract 约束

## 当前项目额外要求

- legacy 宿主里的入口按钮不要直接把远程模块挂进当前 React 16 页面树
- 入口按钮应跳到独立 URL，或打开承载子应用的 iframe/new tab
- 若未来确实要把子应用嵌回工作台，必须先确认宿主容器与子应用边界，不得共享 legacy `react` singleton

## 禁止

- 不要把 `@hiui-design/typical-page-shells` 重新导回 `src/views/**`
- 不要因为新增了子应用，就把 `legacy-host-compatible` 误判成 `rules-only`
- 不要让隔离子应用反向依赖 legacy 主树里的页面组件
- 不要把“隔离标准壳”理解成“主仓任意页面都可直接照搬示例”

## 当前项目脚手架

可直接运行：

```bash
npm run typical-page:setup:isolated-shell
```

该命令会生成独立子应用骨架，作为后续直接参照示例页实现的唯一合法落点。
