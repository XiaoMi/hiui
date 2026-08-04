# Audit 风险台账

## 目的

`npm audit` 输出用于发布风险治理，不用于自动改写 `hiui-design` 运行时依赖树。任何 semver-major、`overrides` 或 `resolutions` 修复，都必须证明不会破坏 HiUI 5 experimental、schema 4.x experimental 和 `@hiui-design/typical-page-shells` 的运行时契约。

## 当前已知风险分类

| 风险来源 | 常见表现 | 默认处置 |
| --- | --- | --- |
| `@hiui-design/typical-page-shells` transitive deps | audit 把壳包标红 | 记录为标准运行时上游风险，等待统一兼容升级 |
| `@hi-ui/schema-*` 链路 | 多个漏洞被级联放大 | 不在业务项目里私自强升 schema 依赖 |
| `immer@8.x` | 常见于 schema table extension 链路 | 跟踪上游修复；没有兼容版本前不强行 override |
| dev-only build deps | 只影响本地构建或预览 | 标记为开发依赖风险，按团队发布门槛评估 |

## 禁止动作

- 不要直接执行 `npm audit fix --force`。
- 不要为了清空 audit 私自升级 `@hi-ui/schema-*` 或 `@hiui-design/typical-page-shells` 的主版本。
- 不要把上游 experimental 运行时告警描述成当前业务页面源码独立引入的漏洞。

## 必填处置记录

每个保留风险至少记录：

- 触发包与版本。
- 运行依赖还是开发依赖。
- 是否存在兼容修复版本。
- 若使用 override/resolution，已跑过的 doctor、build、runtime-smoke 和页面级 preflight 证据。
- 发布责任人与接受期限。
