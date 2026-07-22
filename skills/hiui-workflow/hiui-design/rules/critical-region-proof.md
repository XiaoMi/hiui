# Critical Region Proof

`criticalRegionProof` 是受管页治理的一部分，唯一入口由 `rules/page-governance.md` 引用。它解决的不是某个页型的单点规则，而是所有典型页共同的伪合规风险：页面声明了关键 region，却没有证明该 region 由符合 HiUI 规范的 carrier 承担。

## 证明边界

- `data-hiui5-region` 只用于定位 region，不是合规证明。
- 注释 marker 只用于 trace，不是合规证明。
- contract 字段只表达 claim，不是实现证明。
- `hiui5` primitive 可以作为叶子组件使用，但不能裸承担 carrier-critical region。
- 关键 region 必须由 managed shell、managed component、certified adapter、upstream host carrier，或带 owner / expiry / replacement evidence 的 governed waiver 证明。

## 分级

- `carrier-critical`：证明关键区域由谁承载。默认静态必跑，hard profile 下失败阻断完成态。
- `behavior-critical`：证明滚动、sticky、resize、分页挂载等关键行为。静态不确定时输出 inconclusive，并由计划触发 runtime。
- `visual-critical`：证明密度、对齐、留白等视觉表现。仅视觉优化、截图 / URL / Figma 对齐等任务中阻断。
- `leaf`：普通叶子组件，不做 proof gate。

机器矩阵维护在 `rules/critical-region-capabilities.json`。文档、脚本和 fixture 不得各自维护第二套页型能力表。

## 无效证明

- `markerOnly`
- `commentOnly`
- `contractOnly`
- `agentAssertionOnly`
- `styleOnly`
- `manualDomOnly`
- `rawPrimitiveOnly`

## 与现有报告的关系

本规则不引入新的 v2 报告。静态检查结果进入 `hiui-page-governance-report.v1` / managed source guard；`preflight-report.v1` 只汇总治理结果，顶层状态仍保持 `passed | failed | invalid`。
