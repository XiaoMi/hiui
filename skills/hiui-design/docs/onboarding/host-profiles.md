# 宿主项目画像与自动分流

## 目的

在把典型页能力接入目标项目之前，先判断目标项目是：

- **新项目 / 轻骨架项目**
- **已有系统 / 旧框架 / 定制宿主**

然后再决定：

- 是否可以把当前项目的宿主壳、示例页和 smoke gallery 一起带进去
- 还是只引入规则能力和壳包，在目标项目原有框架里做兼容

## 自动判型结果

脚本会基于以下信息综合判断：

- `package.json` 依赖
- `vite.config.*` / `next.config.*` / `.umirc.*` / `config/config.*`
- `src/` 下源码规模
- `src/layouts` / `src/components/layout` / `src/features` / `src/pages` / `src/router` / `src/routes.*`
- 是否检测到微前端依赖，如 `qiankun` / `micro-app` / `single-spa`

## 画像与策略

### `greenfield` + `react-vite-router` / `react-vite`

策略：

- 默认 **`host-integration`**
- 可以把当前项目的宿主壳、示例页、route gallery、smoke 页面一起接入

适用：

- 刚创建的 React + Vite 项目
- 源码量小，尚未形成稳定布局框架

### `existing-system` + `react-vite-custom-layout` / `react-router-custom`

策略：

- 默认 **`rules-only`**
- 保留目标项目原布局、原路由、原宿主
- 仅安装 `@hiui-design/typical-page-shells`、规则能力和脚本

适用：

- 已有后台系统迭代
- 已存在自己的 `layout` / `router` / `features`

### `existing-system` + `legacy-host-compatible`

策略：

- 默认 **`legacy-host-compatible`**
- 保留目标项目原布局、原路由、原宿主
- 不把标准 `@hiui-design/typical-page-shells` 运行时作为 legacy 主树的默认接入前提
- 只复用页型语义、结构节奏、reference-only 示例页与 contract/doctor 约束

适用：

- React 16/17 宿主
- 旧版 `@hi-ui/hiui` 与 `hiui5` alias 混用宿主
- Module Federation remote 或其它被旧运行时强绑定的项目

### `existing-system` + `umi-max`

策略：

- 默认 **`rules-only`**
- 不自动假设 Vite 路由、入口和宿主壳接法
- 优先参考 `host-adapters/umi.md`

### `existing-system` + `next-app-router`

策略：

- 默认 **`rules-only`**
- 优先参考 `host-adapters/next-app-router.md`

### `existing-system` + `next-pages-router`

策略：

- 默认 **`rules-only`**
- 优先参考 `host-adapters/next-pages-router.md`

### `existing-system` + `micro-frontend`

策略：

- 默认 **`rules-only`**
- 优先兼容当前容器
- 重点检查样式隔离、portal 槽位、高度链、包单例
- 优先参考 `host-adapters/micro-frontend.md`

## 重要边界

- **新项目可带壳**，但仅限脚本识别为简单 React/Vite 骨架时
- **已有系统默认不带壳覆盖**
- 对已有系统，`host-integration` 只应作为显式 smoke gallery 或联调页，不应覆盖正式宿主
- 对已有系统，即使显式选择 `host-integration`，脚本也不应自动把 smoke/gallery 路由挂进正式菜单或主路由树
- 如果宿主与页面混用了源码路径和包路径，可能出现两份 host context，导致 header/footer portal 失效

## 推荐动作

### 新项目

1. 允许脚本自动选择 `host-integration`
2. 先验证示例页 smoke
3. 再生成真实业务页
4. 不要把 route gallery 长期保留为默认首页；正式交付时优先让真实业务路由接管默认入口
5. 若暂时保留示例 gallery，确保示例页采用路由级懒加载，避免把图表页和全部示例页一起打进主 chunk

### 已有系统

1. 允许脚本自动选择 `rules-only`
2. 若 doctor / bootstrap 检测到旧宿主不兼容运行时，则接受自动提升到 `legacy-host-compatible`
3. 先补宿主兼容层
4. 在目标项目既有目录中生成真实业务页
5. 用真实业务页做 smoke，而不是长期保留 route gallery
6. 若安全审计对生产门槛严格，把 `@hiui-design/typical-page-shells` 与 `@hi-ui/schema-*` 的 audit 告警视为标准运行时上游风险单独评估，不要把它们误判成当前业务页新增的本地漏洞

## 脚本产物

当执行 `bootstrap-target-project.mjs` 或 `typical-page-doctor.mjs` 时，脚本会在当前模式的输出目录中生成：

- `HOST_ADAPTER_SNIPPET.md`

用途：

- 给当前判型结果输出最小可执行接法
- 标出候选宿主入口文件
- 指向对应框架专用适配文档
- 在 `Umi` / `Next` / 微前端等已知框架下，补最小代码骨架示例
