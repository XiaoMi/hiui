# 固定 Dashboard 骨架

## 这份文件负责什么

这份文件用于约束一类高频页面：

- `data-visualization`
- “指标卡 + 图表 + 明细表”
- “指标卡 + 趋势图 + 明细分析”
- 仍然属于业务页，但宿主已经提供稳定 header / outlet / white-body 基座的页面

目标只有一个：

- 把骨架层固定在共享 helper 或宿主基座里
- 让页面源码只填充真实内容 region
- 禁止页面为通过视觉或 contract 再手写一套空 header、额外外边距、第二层 white-body、第二层 main-scroll

## 何时优先使用

满足下面条件时，默认优先使用固定骨架：

- 页面仍命中 `data-visualization` 或同类统计分析页
- 宿主已经有稳定的 header portal、content slot、white-body 节奏和 outlet height chain
- 页面一级结构仍然是“筛选 / 指标 / 图表 / 表格”等内容区组合
- 页面问题主要出在壳层重复，而不是内容区排版策略本身

典型信号：

- DOM 里出现空的 `data-hiui5-region="header"` 占位容器
- 页面局部又声明 `margin: 20px` / `padding: 20px` 的 page inset，和宿主留白叠加
- 页面局部又声明 `background: #fff` + `border-radius`，形成第二层白底
- 页面为了通过 runtime smoke，在入口页重新制造一层滚动壳
- 顶层已挂 `TypicalPageAppFrame`，但业务路由 element 又包了一层 `ExampleAppShell`，或业务页面源码又重建了 `LayoutContentProvider + TypicalPageHostBridge`

## 默认 ownership

固定骨架默认锁定下面 4 个 ownership：

- `content-slot`
- `main-scroll`
- `outer-padding`
- `white-body`

页面源码只负责填充下面内容 region：

- `query-filter`
- `stat-section`
- `chart-section`
- `table`
- `pagination`

若页面仍需要 `header` region，header 应通过 portal 直接写入宿主 slot，不要在页面里再造一个可见白条占位。

## 页面可以做什么

页面源码允许：

- 写业务筛选控件
- 写指标卡内容
- 写图表卡内容
- 写明细表与分页
- 复用 shared `Tag` / status renderer 回答风险、状态与生效态
- 给内容卡、栅格、局部 section 写业务样式
- 在真实内容 region 内组织局部 spacing
- 在图表卡内部追加自适应 chart body 容器，但该容器只能回答图表 body，不得反向升级成新的 page shell
- 让 `outer-padding` 只回答横向留白与底部收口；若页头已走宿主 portal，固定 dashboard 页根默认不再额外承接顶部 `padding`

页面源码不允许：

- 再声明一套页面级 `header` 高度占位
- 把 `data-hiui5-region="header"` 挂在可见 `div/section/header` 白条容器上
- 再声明页面级 `margin: 20px` 外边距
- 再声明 page-level `background: #fff` + `border-radius`
- 再让本地 wrapper 成为第二个 viewport / main scroll owner
- 再把 `white-body` 壳层拆成“宿主白底 + 页面白底”双层结构
- 把 `PageHeader` 根节点 class 改成新的 flex / grid 骨架，再由业务页自己把按钮挤到右边
- 在 `dashboard-control-strip` 里继续渲染“统计维度 / 风险等级 / 业务线 / 排序方式”这类上方字段名；控制条不是字段表单
- 让 `dashboard-control-strip` 在 1440 桌面基线下因为错误容器承载长成异常高条；分段控件与下拉控件应保持同一紧凑控制带
- 在风险等级、状态、生效态上手写 `span + 胶囊背景色`；默认必须复用 `Tag` 或 shared status renderer
- 让图表直接裸挂在普通卡片 children 上，而没有独立 chart body 容器
- 把单序列面积图的 `stroke` 直接写在面积层 `style` 上，导致面积图左右两侧和底部出现闭合描边；描边应落在 `line.style`
- 把 `table` 与 `pagination` 拆成两个松散兄弟 block，而不是同一个 table shell/footer 链
- 直接使用 `Table` 时继续开启 `striped` / `bordered`，或把 row action 写成多枚 line/default 按钮并允许换行
- 在普通数据列里堆 `主标题 + 副标题 + 标签` 复合单元格，除非 contract 已明确批准该列为复合呈现
- 在业务页里直接导入 `TypicalPageHeaderPortal` 依赖包级 fallback；应通过目标项目的严格 host portal 或共享 frame helper 暴露页头
- 在宿主已经提供 header/footer portal 的前提下，再把业务路由或业务页包进 `ExampleAppShell`，或重建第二套 header/footer slot 宿主

## 推荐实现

优先把骨架写进共享 helper，例如：

- `src/typical-page-reuse/components/managed-page/fixed-dashboard-page-frame.tsx`
- `src/typical-page-reuse/components/managed-page/data-visualization-primitives.tsx`
- `examples/host-integration/src/components/managed-page/fixed-dashboard-page-frame.tsx`
- `examples/host-integration/src/components/managed-page/data-visualization-primitives.tsx`
- `reference/host-integration/src/components/managed-page/fixed-dashboard-page-frame.tsx`
- `reference/host-integration/src/components/managed-page/data-visualization-primitives.tsx`

页面入口只保留 source marker 与业务 region：

```jsx
import { FixedDashboardPageFrame } from '../components/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  ManagedSurfaceCard,
  SectionBlock,
} from '../components/managed-page/data-visualization-primitives'

export function BusinessPage() {
  return (
    <>
      {/* hiui-design example alignment */}
      {/* hiui-design page-type: data-visualization */}
      <FixedDashboardPageFrame
        pageRootProps={{
          'data-hiui5-example': 'examples/host-integration/src/pages/data-visualization.tsx',
          'data-hiui5-page-type': 'data-visualization',
          'data-hiui5-archetype': 'data-visualization-core',
          'data-hiui5-shell': 'StatListPageFrame',
          'data-hiui5-scroll-strategy': 'page-scroll',
          'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
        }}
        title="业务规模"
        whiteBodyProps={{ 'data-hiui5-owner-white-body': 'true' }}
      >
        <SectionBlock region="stat-section" title="顶部总览">
          <ManagedCardGrid minItemWidth={180}>
            <ManagedMetricCard label="当前排队" value="128" />
          </ManagedCardGrid>
        </SectionBlock>
        <DashboardControlStrip leading={<>filters</>} trailing={<>actions</>} />
        <SectionBlock region="chart-section" title="趋势分析">
          <ManagedCardGrid minItemWidth={320}>
            <ManagedChartCard body={<div />} title="排队趋势" />
          </ManagedCardGrid>
        </SectionBlock>
        <SectionBlock title="风险业务线">
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>risk cards</ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>
        <JoinedTableSection
          pagination={<div>pagination</div>}
          table={<div>table</div>}
          title="业务线监控表"
        />
      </FixedDashboardPageFrame>
    </>
  )
}
```

`typical-page:start-page` 在命中 `data-visualization` 且已具备标准宿主骨架时，默认就应该生成这一套 shared-shell scaffold，而不是再回退成页面里手写 `PageHeader + white-body + control strip + chart card + table shell` 的自由拼装版本。

对这类页面，起手说明里还必须显式写出三条继承边界：

- `shared component inheritance`：至少列出 `FixedDashboardPageFrame`、`DashboardControlStrip`、`JoinedTableSection`、`ManagedChartCard`、`Tag`
- `style inheritance contract`：至少回答 header/outer-padding/white-body/table shell/chart body 的 owner，以及页面禁止覆写哪些骨架层 style
- `interaction inheritance contract`：至少回答 `PageHeader.extra` 右停靠、dashboard control strip 无外部字段名、row action 默认 link + 单行、pagination 仍在 joined table shell 内

## 与 source contract 的关系

固定骨架成立后，contract 里的 region / ownership 仍然必须可验证。

当前默认口径：

- 允许入口页通过本地导入的共享 helper 提供这些 marker / ownership 容器
- `managed-page-source-guard` 会继续校验这些容器是否真实存在
- `finalize-page` 会直接对当前页面快照做 source contract 校验，而不是误用 diff 型 `source-gate`

这意味着：

- 页面可以不再把所有壳层 DOM 重复写回入口页
- 但共享 helper 仍必须保持 machine-checkable source contract
- 对统计 / 可视化页，推荐再显式补：
  - `data-hiui5-shell-inheritance`
  - `data-hiui5-shell-carrier`
  - `data-hiui5-chart-card`
  - `data-hiui5-chart-body`
  - `data-hiui5-table-shell="joined"`

## runtime smoke 口径

`data-visualization + page-scroll` 仍然要跑 runtime smoke。

固定骨架下允许两种 PASS：

- 页面确实可滚动
- 页面已完整落在一个 viewport 内，无需人为制造滚动距离

不允许为了让 smoke “有滚动”而故意增加空白高度、补 filler block 或加无意义外边距。

## 验收清单

命中固定骨架时，至少确认下面几点：

- 没有空的 header 白条容器
- 没有 page-level 双重外边距
- 没有第二层 white-body / second surface
- 没有第二层 main-scroll / viewport shell
- 页头下方没有额外顶部空白带；`outer-padding` 没有把页头与白底主体再拉开一层
- `PageHeader extra` 在运行时真实贴右，而不是紧挨标题
- `dashboard-control-strip` 没有额外一排字段名
- `dashboard-control-strip` 在 1440 桌面基线下保持紧凑，不会异常增高或把两个下拉强行堆成高耸的双层结构
- 风险/状态标签仍走 `Tag` / shared status renderer，而不是业务页手写胶囊 span
- 图表卡里的 chart body 会随卡片尺寸收口，不是裸图表直接挂在卡片 children
- 单序列面积图保持“line.style 描边 + style 填充”，不会出现左右两侧与底部闭合描边
- 表格内容和分页仍在同一个 table shell 内，而不是视觉上像在一体、结构上已拆开
- 直接使用 `Table` 时已显式保持 `striped=false`、`bordered=false`
- 普通数据列保持单行；若存在复合单元格、状态列自定义 renderer 或多按钮操作列，已有书面批准依据
- 没有业务路由级第二宿主：顶层 `TypicalPageAppFrame` 存在时，业务页不再额外经过 `ExampleAppShell`
- 页面源码只在真实内容 region 内写业务样式
- `preflight`、`runtime smoke`、`finalize-page`、`doctor` 都基于最新源码重新通过

## 失败信号

出现任一项时，按固定骨架落地失败处理：

- 灰底宿主里又包一张完整大白卡
- 标题下方出现大块空白
- `outer-padding` 和 `white-body` 同时拥有 16px+ page inset
- 页面为了过 contract，又在入口页补回一整套骨架 DOM
- 页面为了过 smoke，人为制造滚动或额外白边
- 顶层 `TypicalPageAppFrame` 已存在，但业务路由/业务页又套了 `ExampleAppShell` 或第二套 `LayoutContentProvider + TypicalPageHostBridge`

## 与非典型页面的关系

固定骨架不是新的 `page type`，也不是新的 `layout archetype`。

它只回答一个问题：

- 当宿主壳已经稳定时，统计分析类页面的 page shell 该由谁拥有

因此它可以与下面判断同时成立：

- `page type = data-visualization`
- `layout strategy = linear-stack | parallel-sections | primary-secondary`
- `layout archetype = none`

若页面已经进入真正的双栏主从骨架，再回到 `context-main-split` 等非典型骨架判断，不要把两者混用。
