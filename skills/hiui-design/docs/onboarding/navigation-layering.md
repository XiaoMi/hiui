# 导航能力分层方案

## 目标

明确“典型页面能力”与“宿主导航能力”的边界，避免把左侧导航、顶部导航、菜单权限和路由系统误并入典型页主包，导致外部项目接入时出现双导航、双宿主或布局冲突。

## 结论

- `@hiui-design/typical-page-shells` 默认**不包含导航**
- 左侧导航、顶部导航、面包屑、菜单权限、菜单折叠、路由注册、用户态信息都属于**宿主项目能力**
- 新项目若需要“开箱即用”的导航和宿主壳，只能通过 **可选宿主层** 提供，不能反向污染 `@hiui-design/typical-page-shells`
- 一级菜单 icon 属于宿主导航信息架构的一部分，必须随业务域语义选择，不属于典型页主包或示例页模板的可复制装饰

## 三层职责

### 1. `@hiui-design/typical-page-shells`

职责：

- 典型页运行时壳组件
- 页面样式
- header / footer portal 能力
- 表格页、统计页、抽屉页、全页页壳

不负责：

- 左侧导航
- 顶部导航
- 路由树
- 权限菜单
- 业务菜单结构
- 面包屑体系

原则：

- 对所有宿主项目保持最小耦合
- 只消费 `TypicalPageHostProvider` 等宿主注入能力
- 不预设任何导航数据结构

### 2. `host-integration`

职责：

- 提供一套**最小宿主示例**
- 提供 smoke gallery
- 给新项目或轻骨架项目提供联调基线

可选包含：

- 最小导航 wiring
- 示例路由结构
- 示例宿主壳

边界：

- 仅作为示例和接入基线
- 不等于运行时主包能力
- 对已有系统不能默认整包覆盖

### 3. `starter-shell`（建议中的可选宿主包）

如果后续确实需要让新项目“带导航开箱即用”，建议新增一个可选宿主层，例如：

- `@hiui-design/typical-page-starter-shell`

它的职责可以是：

- 最小左侧导航
- 顶部区
- 路由基础 wiring
- 典型页宿主壳
- 与 `@hiui-design/typical-page-shells` 的标准接法

但它必须满足：

- 只服务新项目 / 轻骨架项目
- 不要求已有系统接入
- 不影响 `@hiui-design/typical-page-shells` 的纯页面壳定位

## 推荐策略

### 新项目 / 轻骨架项目

允许：

- 使用 `host-integration`
- 或未来使用 `starter-shell`

目标：

- 快速得到一套可运行的导航 + 宿主壳 + 典型页基线

注意：

- 这套导航仍属于宿主层，不是 `@hiui-design/typical-page-shells` 主包默认能力

### 已有系统 / 旧项目 / 微前端 / 定制宿主

固定策略：

- 继续走 `rules-only`

要求：

- 保留原有左侧导航
- 保留原有 layout / router / header / footer
- 只引入规则能力和 `@hiui-design/typical-page-shells`

禁止：

- 自动带导航覆盖原有系统
- 把示例导航当成正式宿主替换到业务系统里

## 为什么不能把导航塞进主包

如果把导航默认并入 `@hiui-design/typical-page-shells`，会直接带来这些问题：

- 已有系统容易出现双导航
- 菜单权限模型和目标项目不一致
- Umi / Next / React Router / 微前端路由模型差异过大
- 菜单样式、面包屑、折叠逻辑强依赖宿主
- 主包会从“页面壳”退化成“后台应用脚手架”

这会破坏当前最重要的复用目标：

- 典型页可以跨项目复用
- 但不强行接管项目宿主

## 对外发送时的统一口径

对外统一说明应为：

- 当前典型页面能力包默认不包含左侧导航
- 左侧导航由目标项目宿主提供
- 一级菜单 icon 由目标项目宿主按菜单域提供语义化 `@hi-ui/icons` 面型图标；`AppStoreFilled` 只保留给 `示例` gallery
- 新项目若需要带导航的最小壳，只能使用 `host-integration` 或未来的 `starter-shell`
- 已有系统默认保持原导航和原 layout，不允许自动覆盖

## 一级菜单 icon 分层规则

- `host-integration` 只能提供 `示例` gallery 的默认 icon；它不能替业务系统决定 `业务` / `项目` / `订单` / `工单` 等真实域的 icon
- 页面生成任务若需要新增宿主一级菜单，必须同时声明 route ownership 和 icon ownership，不能只把页面挂到最近的示例路由里
- 一级菜单统一使用 `Filled` 变体；线型 icon、缺失 icon、多个一级菜单复用同一个占位 icon 都属于宿主导航契约失败
- 真实业务一级菜单不得使用 `AppStoreFilled`。这个 icon 的语义是“应用/示例集合”，保留给 `示例` smoke/gallery 入口
- 验收时以 `typical-page:doctor` 的 `top-level-menu-icon-semantics` 为机器 gate，人工 review 只补充业务域是否选得足够准确

## 落地建议

当前阶段建议维持以下边界：

1. `@hiui-design/typical-page-shells`
   不包含导航
2. `.local-context/hiui-design/examples/host-integration/`
   可继续保留最小导航 / 路由示例能力
3. `rules-only`
   明确禁止把导航示例同步进已有系统
4. 如果后续要产品化
   单独新增 `starter-shell`，不要扩主包职责
