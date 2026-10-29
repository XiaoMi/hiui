# 微前端宿主适配片段

## 适用范围

- `qiankun`
- `micro-app`
- `single-spa`

## 默认策略

- 微前端容器不属于原生兼容载体；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 保留原有主子应用容器结构
- 优先解决宿主高度链、content outlet 合同、portal 槽位和包单例

## 最小接法

1. 确保子应用运行时只加载一份本地运行时路径族，并避免和旧壳包导入混用
2. 在子应用自己的 layout 中提供 header / footer slot
3. 把真实业务页 children 挂到单一 content outlet，而不是挂到任意白色容器
4. 保证 content outlet 高度链满足 `display:flex`、`flex-direction:column`、`flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
5. 保证 content outlet 右侧保留 `16px` 视口留白；若菜单支持收起，收起态也保留左侧 `16px` 间距
6. 明确主滚动 owner，只保留一层业务主滚动，再接入真实业务页

## 最小宿主合同

- `content outlet path`：子应用的真实业务 children 必须有单一路由出口或内容列，不要在多个平级白色容器之间漂移
- `continuous height chain`：从业务 layout 到 routed page root 连续传递 `display:flex`、`flex-direction:column`、`flex:1 1 0%`、`min-height:0`
- `right viewport gutter`：非抽屉页默认要求右侧 `16px` 视口留白
- `scroll owner`：主滚动只能有一个；不要让微前端容器和典型页 shell 同时各自滚动
- `header slot policy`：若保留共享 header slot，必须证明标准典型页未占用时会自动折叠

## 高风险点

- 包被装出多份导致 host context 分裂
- 子应用容器额外滚动导致双滚动
- content outlet 缺少 `16px` gutter，导致白色内容区贴右边
- content outlet 高度链断裂，导致白底不铺底或 footer / pagination 跟内容高度一起漂移
- 全局样式隔离导致 `styles.css` 不生效
- 只做全局 alias 或只覆盖旧壳包包根，导致 `@hi-ui/schema-*`、`@hi-ui/dumb-wrapper`、`@hi-ui/number-range` 仍回落到宿主旧 shared 单例

## Scoped HiUI5 Replacement Bridge

- 这组“宿主共享合同修复”只针对 `existing-system + legacy Module Federation / Camora` 项目；不要把它泛化到 greenfield、非 MF 宿主，或已经完整承接受管 host baseline 的新项目。
- 对 legacy React + Module Federation / Camora 宿主，不要只做整站 alias，也不要只给旧壳包包根打一层 replacement。
- Rspack / Webpack replacement 必须按 issuer scoped 生效，至少覆盖本地运行时目录、`@hi-ui/schema-*`、`@hi-ui/dumb-wrapper`、`@hi-ui/number-range`、`@hi-ui/group`、`@hi-ui/style-inject`、`@hi-ui/use-ref-state`、`@hi-ui/use-subscription` 这条新页面依赖图。
- 官方参考从 `.local-context/hiui-design/examples/host-integration/build/hiui5-peer-replacement-bridge.cjs` 起步，优先使用其中的 `createScopedHiui5PeerReplacementPlugins(...)`。
- 若当前 old host 一边保留 scoped HiUI5 bridge，一边又把旧 `@hi-ui/hiui` 继续作为 Module Federation shared singleton 暴露，运行时仍可能把新典型页依赖链“吸回”老宿主；这时应修宿主 shared contract，而不是继续在业务页源码里打补丁。
- 若 bridge 没有做到 scoped replacement，页面源码即使按 HiUI5 生成，运行时仍可能被旧宿主 shared 单例“吸回去”，控制台常见信号包括：
  - `Version 3.7.1... of shared singleton module @hi-ui/hiui does not satisfy...`
  - `Version 16.13.1... of shared singleton module react does not satisfy...`
  - `Minified React error #130`

## 推荐 smoke

- 优先先跑全页编辑页
- 再跑一张 `table-basic` 或 `table-stat`，确认 content outlet 的 `16px` gutter 和 whiteBody 铺底都成立
- 如果全页编辑和数据统计页同时异常，先查容器和包单例，不要继续生成业务页

## Module Federation / Camora 的人工接入口径

当前对外模式不再提供已下线历史模式。当页面已经在目标项目既有目录中实现，且宿主仍属于 Module Federation / Camora 时，需要人工完成以下步骤：

1. 在当前 remote 项目的 Module Federation `exposes` 中暴露页面组件。
2. 若本次还改了 peer replacement bridge、alias 或 `exposes`，先重新启动 dev server；Camora 代理读取的是实时 `http://localhost:4120/remoteEntry.js`，不是历史 `dist/remoteEntry.js`。最新 `hiui-design apply/bootstrap` 在能识别到本地 Rspack/Webpack devServer 配置时，还会自动补 no-cache response headers，降低新 `remoteEntry.js` 配旧 chunk 的缓存混用概率，但这层配置同样要在重启后才会生效。
3. 先确认宿主画像里的 remote debug 合同确实来自显式 Camora / proxy / `localOrigin` 证据，而不是单纯因为构建配置里出现了 `remoteEntry.js` 文件名。
4. 运行 `node .local-context/hiui-design/scripts/verify-remote-runtime-source.mjs --expose-name <ExposeName> --json`，确认 live `remoteEntry.js` 中能搜索到暴露名，并让 `.local-context/hiui-design/outputs/REMOTE_RUNTIME_SOURCE_STATUS.json` 进入 `pass`。
5. 若当前宿主仍运行 classic JSX runtime，生成页或人工落地页都必须保留显式 `import React from 'react'`。
6. 在宿主按钮、菜单或业务入口中调用 `window.addPage({ path: '@common/<ExposeName>' })`，或使用项目既有跳转封装。
7. 在 Camora 代理页面中打开并检查控制台。

### 验收命令

```bash
node .local-context/hiui-design/scripts/verify-remote-runtime-source.mjs --expose-name <ExposeName> --json
```

### 常见阻塞错误

- `Module "./<ExposeName>" does not exist in container`：通常是 `exposes` 未配置、名称不一致或 dev server 未重启。
- `React is not defined`：当前宿主仍在 classic JSX runtime；页面文件必须显式导入 `React`，不要假设自动 JSX runtime 一定可用。
- `Package subpath './es' is not defined by exports`：新模板不得引入 `@hi-ui/hiui/es/*`；旧代码兼容应放在宿主 shim 层。
- `Version 3.x from common of shared singleton module @hi-ui/hiui does not satisfy...`：说明 scoped HiUI5 replacement bridge 还没把新页面整条依赖图隔离开，不要继续在业务页里打补丁。
- 页面显示“您访问的页面出错了”：先检查远程模块加载、浏览器控制台和 Network，不要把所有错误归因于模板内容。

### 回滚

- 删除新增 `exposes`。
- 删除业务入口按钮或菜单项。
- 删除生成页面目录。
- 保留 `.local-context/hiui-design/` 规则包本身；不要恢复已下线的 source-template 自动生成链路。
