# Runtime Bridge Page-Component Assets

本目录承载 `legacy-host-compatible` 下 `runtime-bridged-page-component` 的通用薄桥层资产。

原则：

- 真实交付资产仍是 selected certified page component 或 project-certified carrier
- wrapper 只负责 runtime bridge，不负责页面结构所有权
- slot adapter 只负责业务槽位绑定，不负责重写 shell / region
- runtime shell 来源必须从 component certification 的 `certificationInputs.componentShell` 解析
- example page 只作语义和结构参考

目录说明：

- `runtime-bridge-wrapper.template.tsx`：通用 wrapper 模板
- `slot-adapter.stub.ts`：通用 slot adapter stub
