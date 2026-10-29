# 宿主项目画像与自动分流

## 目的

在把典型页能力接入目标项目之前，先判断目标项目是：

- **新项目 / 轻骨架项目**
- **已有系统 / 旧框架 / 定制宿主**

然后再决定：

- 是否可以把典型页面生成所需的宿主基线、source assets 与联调能力接好，并让官方示例继续只由 skill 包内 `preview-runtime/` 承载
- 还是因为需要项目本地兼容桥而降级到 `rules-only`，在目标项目原有框架里接入规则、官方母版起点和壳包

## 自动判型结果

脚本会基于以下信息综合判断项目画像，并据此判断目标项目是否需要项目本地兼容桥：

- `package.json` 依赖
- `vite.config.*` / `next.config.*` / `.umirc.*` / `config/config.*`
- `src/` 下源码规模
- `src/layouts` / `src/components/layout` / `src/features` / `src/pages` / `src/router` / `src/routes.*`
- 是否检测到微前端依赖，如 `qiankun` / `micro-app` / `single-spa`

## 画像与策略

### `greenfield` + `react-vite-router` / `react-vite`

策略：

- 通常更容易承接受管宿主基线与官方 source assets
- 默认优先选择 `host-integration`，先把宿主基线、样式资源、依赖线与 guidance 接好；官方示例统一从 skill 包内 `preview-runtime/` 打开
- 只有明确不需要 preview / smoke / doctor 基线，或已证明宿主桥接、高度链、样式资源、依赖线无法安全接通时，才降级为 `rules-only`
- 首次生成真实业务页时，可额外补首个正式业务导航入口，但不能把示例入口转成正式导航

适用：

- 刚创建的 React + Vite 项目
- 源码量小，尚未形成稳定布局框架

### `existing-system` + `react-vite-custom-layout` / `react-router-custom`

策略：

- 这类项目仍在原生兼容载体范围内；`--mode auto` 默认会落到 `host-integration`
- 无论选哪种 mode，都保留目标项目原布局、原路由、原宿主
- 默认接入受管本地运行时、规则能力和脚本
- 只有当项目明确不需要 preview / smoke / doctor 基线，或团队决定不引入更完整的宿主基线时，才人工改用 `rules-only`

适用：

- 已有后台系统迭代
- 已存在自己的 `layout` / `router` / `features`

### `existing-system` + `umi-max`

策略：

- 这类项目不在原生兼容载体范围内；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 不自动假设 Vite 路由、入口和宿主壳接法
- 优先参考 `host-adapters/umi.md`

### `existing-system` + `next-app-router`

策略：

- 这类项目不在原生兼容载体范围内；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 优先参考 `host-adapters/next-app-router.md`

### `existing-system` + `next-pages-router`

策略：

- 这类项目不在原生兼容载体范围内；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 优先参考 `host-adapters/next-pages-router.md`

### `existing-system` + `micro-frontend`

策略：

- 这类项目不在原生兼容载体范围内；`--mode auto` 默认会落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 优先兼容当前容器
- 重点检查样式隔离、portal 槽位、高度链、包单例
- 优先参考 `host-adapters/micro-frontend.md`

## 重要边界

- **新项目可带业务壳**，但仅限脚本识别为简单 React/Vite 骨架时，且这套壳不应包含典型页面示例入口
- **已有系统通常更需要显式证明受管宿主基线、桥接链路与正式宿主边界**
- `host-integration` 表示项目可以承接更完整的宿主基线与治理能力，不等于“项目内挂了 preview 应用”
- 对已有系统，`host-integration` 只表示项目更适合接入完整宿主基线、source assets 与联调治理能力；它不覆盖正式宿主
- 对已有系统，即使显式选择 `host-integration`，脚本也不应自动把任何示例入口、route tree 或 gallery 挂进正式菜单或主路由树
- 对已有系统，若项目里仍残留 `/__typical-preview`、`typicalPagePreviewRoutes` 或同类 preview route tree，应视为旧流程残留并移除；官方示例改在 skill 包内 `preview-runtime/` 查看
- 项目里保留 `.local-context/hiui-design/examples/host-integration/**` 作为母版、shim 或 formal shell source 是正常的；只有把它们挂成项目内 preview route/tree 时才属于旧流程残留
- 对所有项目，真实业务页都不应与 preview route tree 共用正式菜单树或默认 landing flow
- 如果宿主与页面混用了源码路径和包路径，可能出现两份 host context，导致 header/footer portal 失效

## 推荐动作

### 新项目

1. 默认优先选择 `host-integration`，不要因为只想少改几处接线就先退回 `rules-only`
2. 先通过 skill 包内 `preview-runtime/` 验证官方示例 smoke；不要再把 preview 示例物化进目标项目
3. 再生成真实业务页
4. 若需要补首个正式业务导航入口，确保它不包含典型页面示例入口

### 已有系统

1. 先按自动模式结果接入：原生兼容载体默认 `host-integration`，需要项目本地兼容桥的载体默认 `rules-only`
2. 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
3. 先补宿主兼容层
4. 官方示例统一只从 skill 包内 `preview-runtime/` 打开；不要在目标项目里保留 preview 入口
5. 在目标项目既有目录中生成真实业务页
6. 用真实业务页做 smoke，而不是长期保留 route gallery

## 脚本产物

当执行 `bootstrap-target-project.mjs` 或 `typical-page-doctor.mjs` 时，脚本会在当前模式的输出目录中生成：

- `HOST_ADAPTER_SNIPPET.md`

用途：

- 给当前判型结果输出最小可执行接法
- 标出候选宿主入口文件
- 指向对应框架专用适配文档
- 在 `Umi` / `Next` / 微前端等已知框架下，补最小代码骨架示例
