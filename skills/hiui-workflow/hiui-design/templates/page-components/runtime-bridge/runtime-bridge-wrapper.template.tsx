/* generated from hiui-design runtime bridge wrapper template */
/* template asset: __HIUI_TEMPLATE_PATH__ */
/* runtime bridge profile: __HIUI_RUNTIME_BRIDGE_PROFILE_ID__ */
/* selected component: __HIUI_PAGE_COMPONENT_ID__ */
/* runtime shell source: __HIUI_RUNTIME_COMPONENT_SOURCE__ */
/* bridge rule: keep wrapper runtime-only; do not take shell ownership here */

import type { __HIUI_SLOT_ADAPTER_PROPS__ } from './slot-adapter.stub'
import { __HIUI_SLOT_ADAPTER_NAME__ } from './slot-adapter.stub'

export type __HIUI_RUNTIME_BRIDGE_WRAPPER_PROPS__ = __HIUI_SLOT_ADAPTER_PROPS__

export default function __HIUI_RUNTIME_BRIDGE_WRAPPER_NAME__(
  props: __HIUI_RUNTIME_BRIDGE_WRAPPER_PROPS__
) {
  const adaptedSlots = __HIUI_SLOT_ADAPTER_NAME__(props)

  return (
    <>
      {/* source contract markers */}
__HIUI_SOURCE_CONTRACT_MARKERS__
      {/* runtime bridge only: no white-body/main-scroll/pagination/footer ownership here */}
      {/* replace __HIUI_RUNTIME_COMPONENT_USAGE__ with the certified shell usage resolved from component certification */}
      __HIUI_RUNTIME_COMPONENT_USAGE__
      {/* keep adaptedSlots as the only business-slot input surface */}
      {false ? adaptedSlots : null}
    </>
  )
}
