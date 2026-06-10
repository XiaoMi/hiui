# 接入模式判定

这份文件只负责 3 件事：

1. 判断项目画像
2. 选择 `host-integration`、`rules-only` 或 `legacy-host-compatible`
3. 明确后续应该扩展读取哪些文档

## 默认判定

- `greenfield` + `react-vite` / `react-vite-router`
  默认走 `host-integration`。
- `existing-system` + `react-vite-custom-layout` / `react-router-custom`
  默认走 `rules-only`。
- `umi` / `next` / 微前端
  默认走 `rules-only`，不要自动覆盖正式宿主。

## 旧宿主兼容模式

若命中下面任一特征，切到 `legacy-host-compatible`：

- `react` 或 `react-dom` 主运行时 `< 18`
- `ahooks` 主运行时 `< 3`
- 保留旧版 `@hi-ui/hiui`，只通过 `hiui5` 等 alias 局部接入 HiUI 5
- Module Federation remote 把旧版 `react` / `react-dom` 作为 singleton 共享

进入该模式后：

- 继续复用典型页页型和结构节奏
- 不直接挂标准 `@hiui-design/typical-page-shells` 页面
- 改为复用目标项目自己的布局、页面容器和 `hiui5` / 本地组件封装
- 额外读取 `docs/generation/legacy-host-compatibility.md`
- 若当前仓库是 `<legacy-host-project>`，再额外读取 `docs/business-lines/<line-id>/<project-id>.md`
- 只放宽运行时与接入方式；**不放宽**页型专章里的 mandatory components、required regions 与 ownership 要求
- 不要把“兼容旧宿主”误解成“可以退回旧搜索壳 / 旧表格页 / 旧抽屉页”

### 旧宿主下的隔离标准壳例外

若目标项目整体仍命中 `legacy-host-compatible`，但同时满足下面条件，可以把**单个页面的交付策略**提升为 `isolated-standard-shell`：

- 标准壳页面运行在独立子应用 / 独立构建产物中
- 独立子应用自己安装 `react@18`、`react-dom@18`、`ahooks@3` 与 `@hiui-design/typical-page-shells`
- 当前 legacy remote 不直接导入 `@hiui-design/typical-page-shells`
- legacy 宿主只负责打开独立页面 URL、iframe 或新标签页，不承载标准壳运行时

命中该例外时：

- **项目模式仍然是** `legacy-host-compatible`
- **页面实现策略**可以写成 `isolated-standard-shell`
- 页面可以直接从示例页起步并照搬标准壳组件实现
- 额外读取 `docs/generation/isolated-standard-shell.md`

补充说明：

- 若业务明确要求“保留旧宿主左侧导航，只切右侧内容区”，则不要把 `isolated-standard-shell` 当成正式交付结果
- 对 `<legacy-host-project>` 这类旧宿主，isolated shell 仅用于 baseline / smoke / screenshot 验证

## 模式边界

- 不要因为同步出了 `src/typical-page-reuse`，就把项目误判成 `existing-system`
- 对已有系统，`host-integration` 只作为 smoke / gallery 联调基线，不直接覆盖正式宿主
- 没有完整 `.local-context/hiui-design/` 目录时，先停止生成，先复制完整 skill 目录

## 模式化输出要求

- 通用输出始终包含：当前模式、页型判断、已读取的 rules/docs、脚本入口与关键结果
- 编码前的固定起手顺序与字段清单，统一看 `../docs/generation/ai-kickoff-template.md`
- 若 kickoff 中要求的关键事实仍是猜测、占位或写不出来，就先停下补事实，不要开始写页面
- `required regions`、ownership 映射与其它 contract 字段，统一看 `contract-regions.md`
- 对表格类页型，还必须显式输出 `QueryFilter` / `FilterDrawer` / `Table.resizable` / `Table.setting` 的可用性结论
- 若命中隔离标准壳例外，再额外输出 `page delivery strategy`
- `host-integration`
  输出宿主接入方式、同步资产落点、doctor 结果和遗留宿主风险
- `rules-only`
  输出唯一 `example path`、唯一 `host archetype path`、`example -> host` 区域映射和 ownership 映射；contract 细则看 `contract-regions.md`
- `legacy-host-compatible`
  输出所复用的宿主基座、未直接依赖标准壳包的说明、兼容限制和待人工确认项

## 退出后的诊断格式

触发退出时，至少输出：

- 当前模式和失败步骤
- 已读取的 rules / docs 文件
- 已确认或未确认的 mandatory components
- 失败信号、冲突详情或缺失基座
- 需要人类决策的最小问题集合

## 下一步

- 模式确定后，继续读 `page-type-map.md`
- 模式确定后，立刻回到 `../docs/generation/ai-kickoff-template.md` 对照固定起手块；不要跳过起手块直接编码
- 需要执行接入动作时，调用 `scripts/setup-for-designers.mjs` 或 `scripts/apply-in-current-project.mjs`
- 需要在旧宿主里准备隔离标准壳子应用时，调用 `scripts/setup-isolated-standard-shell.mjs`
- 需要宿主接入说明时，按需读 `docs/onboarding/install-and-host.md`、`docs/onboarding/host-profiles.md`、`docs/onboarding/integration-modes.md`
