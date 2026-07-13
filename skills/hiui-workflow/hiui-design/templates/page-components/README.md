# Page Component Templates

本目录用于承载 `pageComponent = managed mold implementation` 的模板资产。

页面组件模板必须引用 `rules/page-component-registry.json` 中的 `componentId`，并继承 `baseMoldId` 的 locked regions、editable slots 与 slot manifest。模板不得重新定义页面结构事实。

当前目录只建立资产边界；具体组件模板必须在对应 `componentId` 完成认证流程后再标记为 `certified`。

## Runtime Bridge Assets

`runtime-bridged-page-component` 仍归一到 `page-component`，因此桥接模板也只能是 page-component 的
附属资产，而不是第二套页面模板体系。

- `runtime-bridge/runtime-bridge-wrapper.template.tsx`：薄 wrapper，只绑定宿主 runtime、
  provider、route-navigation、request / response、permission、message、theme 等输入。
- `runtime-bridge/slot-adapter.stub.ts`：薄 slot adapter，只把业务 schema / handlers 映射到标准
  slots 和 Level 1 受控扩展。

这些资产必须遵守：

- 不接管 `shell`、`white-body`、`main-scroll`、`pagination`、`footer`、`route owner`
- 不把标准页面组件翻译成宿主 look-alike primitives
- 不把 example page 当作业务页壳源码
