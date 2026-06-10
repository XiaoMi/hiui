# HiUI 典型页国际化基线

## 这份文件负责什么

这份文件用于把 HiUI 典型页的国际化约束前置到 `hiui-design` 规则层。

它解决的是：

- 受管页面生成时默认具备多语言、RTL 与本地化格式适配能力
- 不同业务线在进入真实翻译接入前，先统一页面层的 i18n 设计与源码边界
- 让国际化问题优先按“结构 / 组件 / formatter / 文案来源”处理，而不是后期补丁

它不替代：

- 业务线自己的翻译平台、术语库与发布流程
- 具体项目对 `react-intl-universal`、`i18next`、`react-intl` 或其他 runtime 的选型
- 页型专章中的结构、视觉、交互硬门槛

发生冲突时，优先级如下：

1. `figma-pages/*.md`
2. `figma-pages/forms-shared.md` / `figma-pages/table-shared.md`
3. `rules/generation-rules.md`
4. 本文件

## 何时读

- 任何存在用户可见文案的页面都要读
- 任何包含日期、时间、数字、金额、百分比、排序或图表文本的页面都要读
- 任何需要支持阿拉伯语 RTL 或西文长文本适配的页面都要读

## 默认支持语言

| 语言 | Locale | 膨胀系数 | RTL | 备注 |
| --- | --- | --- | --- | --- |
| 简体中文 | `zh-CN` | `1.0x` | 否 | 基准语言 |
| 繁体中文 | `zh-TW` | `1.0x` | 否 | CJK |
| 英语 | `en-US` | `1.5x` | 否 | 默认西文基线 |
| 印尼语 | `id-ID` | `1.5x` | 否 | 词长接近英语 |
| 泰语 | `th-TH` | `2.0x` | 否 | 无空格分词，行高需抬高 |
| 德语 | `de-DE` | `2.5x` | 否 | 复合词极长 |
| 阿拉伯语 | `ar-SA` | `2.0x` | 是 | 页面需整体 RTL |

默认生成与验收按以上 7 种语言准备。若业务线只上线其中一部分，可在结果中写明实际交付语言，但页面结构不得破坏这套基线。

## 编码前阻断输出

开始写页面代码前，除页型与壳层阻断项外，还必须额外写出：

- `i18n strategy`

其中 `i18n strategy` 至少包含：

- `supported locales`
- `message runtime`
- `message source`
- `formatter strategy`
- `direction strategy`
- `text expansion strategy`

默认口径：

- `supported locales`：至少说明是否覆盖 `zh-CN,en-US,id-ID,zh-TW,th-TH,de-DE,ar-SA`
- `message runtime`：项目已有 i18n runtime 则复用；没有时可默认接到 `react-intl-universal` 或等价 bridge
- `message source`：业务文案来自 locale 资源，而不是页面内硬编码
- `fallback policy`：`zh-TW` 默认回退到 `zh-CN`；非中文语种默认回退到 `en-US`；若当前 locale 条目缺失、等于 key、或仍残留中文占位，页面层 bridge 应优先使用 fallback 结果
- `formatter strategy`：日期、时间、数字、金额、百分比统一走 `Intl` 或上游统一 formatter
- `direction strategy`：`ar-SA` 通过根节点 `dir="rtl"` 与顶层 Provider 同步方向
- `text expansion strategy`：说明页面如何处理西文/泰文/阿拉伯语的文本膨胀与换行

未明确 `i18n strategy` 前，不要继续写业务文案、列标题、按钮文案、图表标题、反馈文案或 mock 数据展示文本。

## 硬门槛

### 1. 用户可见文案不得硬编码

- 受管页面的标题、按钮、列标题、字段 label、placeholder、Tag 文案、空状态 / 错误态 / 权限态文案、图表标题、tooltip 标题、legend 文案都必须来自可国际化资源或上游 bridge
- 允许中文原文作为 key，例如 `intl.get('导出')`；不允许把中文原文直接写成 JSX 文本或属性值
- 不允许把“先写中文，后面再替换”当作完成状态

### 2. 禁止字符串拼接式国际化

- 不要用 `` `${count} items` ``、`'¥' + amount`、`month + '/' + day` 这类拼接表达用户可见文本
- 复数、插值、带单位文本默认使用 ICU MessageFormat 或等价 runtime 能力
- 大小写转换默认使用 locale-aware API，例如 `toLocaleUpperCase(locale)`

### 3. 日期 / 数字 / 金额必须走 formatter

- 日期 / 时间：`Intl.DateTimeFormat(locale, options)` 或上游统一 formatter
- 数字 / 百分比：`Intl.NumberFormat(locale, options)` 或上游统一 formatter
- 货币：`Intl.NumberFormat(locale, { style: 'currency' })`
- 排序：`Intl.Collator(locale)`
- 不要在页面局部直接用 `.toFixed()`、`getMonth()` 拼接、美元符号前缀、硬编码千分位去回答用户可见格式

### 4. RTL 与逻辑方向必须可适配

- 阿拉伯语场景必须同步根节点 `dir="rtl"`
- 顶层 Provider / LocaleContext 必须把语言与方向统一传给组件层
- 浮层、抽屉、页头、图表 tooltip、表格操作列都要接受方向切换
- 物理方向属性默认禁止进入受管页面样式：`margin-left/right`、`padding-left/right`、`border-left/right`、`left/right`、`text-align: left/right`
- 必须优先使用逻辑属性：`margin-inline-*`、`padding-inline-*`、`border-inline-*`、`inset-inline-*`、`text-align: start/end`

### 5. 文本容器必须具备膨胀容错

- `zh-CN/zh-TW` 作为基准布局
- `en-US/id-ID` 默认按 `1.5x` 文本膨胀预留
- `th-TH/ar-SA` 默认按 `2.0x` 文本膨胀与更高行高预留
- `de-DE` 默认按 `2.5x` 文本膨胀预留
- 任何页头、按钮、导航、表头、指标名称、字段 label、抽屉字段管理项，都不得因为切换语言直接撑破布局

### 6. 行高与字体回退必须覆盖 Tall script

- CJK 默认保持当前 HiUI 典型页基线
- 非 CJK 默认行高不得低于 `1.5`
- `th-TH` / `ar-SA` 等 Tall script 默认行高不得低于 `1.6`
- 字体栈不得只写西文字体；至少保留 CJK / 阿拉伯语 / 泰语的系统回退

### 7. 语言切换器遵循单入口约束

- 语言切换器默认只有一个入口按钮
- 展开内容走浮层 / 下拉菜单，不参与主布局
- 不允许在页头平铺多个语言按钮
- 语言项默认用本地名纯文本，不用国旗 emoji
- 当前语言高亮，切换后立即生效
- 切换器不得挤压主操作按钮

## 页面级适配规则

### 页头 / 导航

- 一级导航最多 2 行；超出 `ellipsis + tooltip`
- 二级 / 三级菜单单行截断；超出 `ellipsis + tooltip`
- 页头标题与右侧操作默认保持单一主线；长文本时优先保结构，不新增第二排自由文案

### 按钮

- 中文允许较短语义文案
- 非中文若文案过长，优先使用 icon + 通用短词，或缩减为更稳定的动作语义
- 不要把中文短词逐字硬翻后继续塞进固定窄按钮

### 表格

- 表头最多 2 行；超出 `ellipsis + tooltip`
- 文本列默认单行省略 + tooltip
- 非中文表格列宽默认按中文基线放大，优先使用内容感知列宽；不要把中文窄列直接硬搬到德语/泰语
- 字段管理项默认 1 行；非中文可放宽到最多 2 行，超出仍省略 + tooltip

### 表单

- 表单布局默认以宿主内容槽宽度判断，而不是粗暴按 viewport
- `de-DE / th-TH / ar-SA` 在 `<=1366px` 默认优先降为 2 列；`>=1440px` 可回到 3 列
- 非中文 label 默认不要写死窄宽度；优先用上方标签、内容 padding 与 auto layout 消化长度
- 业务文案较长时，不要靠常态 `overflow-x: auto` 掩盖

### 抽屉详情 / 全页详情

- `Descriptions` 继续保持 `placement: 'vertical'`，并在 detail-shell 中显式冻结 left label 起点；不要额外覆写 label / `th` CSS 对齐
- 非中文默认优先接受上下分布，不要强把长 label 压回左右紧贴的窄结构
- 关键信息最多 2 行，超出 `ellipsis + tooltip`
- 不要为了追求紧凑把长字段值截成不可读碎片

### 数据可视化

- 图表标题、坐标轴、tooltip、legend、空态文案、时间维度文案都要走 locale 资源或 formatter
- 金额、百分比、数值缩写、时间范围一律走统一 formatter
- `chart-section` 的 i18n 口径必须和页面正文保持一致；不要让图表继续吃库默认英文文案
- 涨跌颜色若业务确实要求随地区习惯变化，必须通过 locale 或市场配置显式切换；不要把红涨绿跌写死在页面局部

## 默认实现策略

### 项目已有 i18n runtime

- 优先复用目标项目已有 runtime / Provider / locale store
- `hiui-design` 生成页只补页面层 bridge 与 formatter，不重造项目级 i18n 基座
- 若宿主已有统一 `t()` / `intl.get()` / `formatMessage()` 能力，继续沿用
- 若上游组件库 locale 只原生提供 `zh-CN/en-US`，则宿主入口需在挂载前对 `id-ID / th-TH / de-DE / ar-SA` 合并 `en-US` 组件文案基线，再让页面层 bridge 负责业务词条本地化；不要把组件库默认英文误判成页面切换失效

### 项目没有现成 i18n runtime

- 可以默认接入 `react-intl-universal` 或等价 runtime
- `setup-for-designers.mjs`、`apply-in-current-project.mjs` 与 `bootstrap-target-project.mjs` 默认会自动补齐 `src/translation/*` 基线
- 若目标项目尚未建立翻译目录，或后续需要重同步 locale 文件，可执行 `pnpm typical-page:i18n:init` 或 `npm run typical-page:i18n:init`
- 默认语言资源可按下述结构组织：

```text
src/translation/
  index.ts
  zh-CN.json
  zh-TW.json
  en-US.json
  id-ID.json
  th-TH.json
  de-DE.json
  ar-SA.json
```

- 默认允许中文原文作为 key；新增翻译时保持同一风格
- `typical-page:i18n:init` 默认会补或重同步 `index.ts`、`messages.ts`、`zh-CN/en-US` seed、其余 locale fallback 文件，以及本地 `i18n:sync`
- 同步出来的 `src/translation/demo-overrides.ts` 只是空白 scaffold，用于承接当前项目自己的业务词条兜底；`hiui-design` 基线不会把某个 demo 项目的业务词库整体下发到新项目
- 若业务线后续已有统一翻译平台，可在不改页面结构契约的前提下替换 runtime
- 这里的“自动补齐基线”只负责建立语言切换、locale store、formatter、RTL 与 fallback 规则，不负责自动翻译新业务文案；新增页面若引入新的标题、按钮、列头、placeholder、反馈文案或 mock 展示值，仍需同步补齐 locale 资源

### 明确禁止

- 禁止在 `.ts` / `.tsx` 模块顶层提前求值 `t()` / `intl.get()` 并把结果固化成静态字符串
- 禁止把 locale 相关 formatter 写死在单个页型里
- 禁止在受管页面里因为国际化改写壳层结构、ownership 或 mandatory components

## 验收口径

默认至少验证：

- 切换 `zh-CN / en-US / de-DE / th-TH / ar-SA` 时页面无报错
- `de-DE / th-TH / ar-SA` 的长文本不会撑坏页头、表头、按钮、字段管理项与详情主信息
- `ar-SA` 下页面整体方向、抽屉方向、浮层对齐和文本顺序正确
- 日期、数字、金额、百分比格式随 locale 变化
- 页面无国旗 emoji 语言选择器
- 页面未继续使用物理方向属性

## 常见陷阱

- 把中文原文直接写进 JSX，而不是作为 i18n key
- 用 `.toFixed()`、字符串拼接或手写货币符号输出可见格式
- 只修文案，不修表头 / 按钮 / 抽屉 / tooltip 的文本膨胀
- 只切换翻译，不同步 `dir="rtl"`
- 在样式里继续使用 `margin-left/right` 一类物理属性
- 在模块顶层提前执行 `t()` / `intl.get()`，导致切换语言后页面不刷新
- 误以为“页面已接入 i18n runtime”就等于“新业务文案会自动翻译”；受管页新增的可见文案若没有进入 locale 资源，只会触发 fallback，不会凭空生成正确翻译
