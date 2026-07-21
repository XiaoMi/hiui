/* generated from hiui-design certified standard page-component template */
/* template asset: __HIUI_TEMPLATE_PATH__ */
/* runtime bridge profile: __HIUI_RUNTIME_BRIDGE_PROFILE_ID__ */
/* selected component: __HIUI_PAGE_COMPONENT_ID__ */
/* runtime shell source: __HIUI_RUNTIME_COMPONENT_SOURCE__ */
/* bridge rule: keep shell ownership inside the selected standard page component; fill business slots only */

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
      {/* hiui-design shell-inheritance: selected-standard-page-component */}
      {/* hiui-design shell-carrier: __HIUI_RUNTIME_COMPONENT_SOURCE__ */}
      {/* selected standard page component remains the only shell/result asset */}
      {/* replace __HIUI_RUNTIME_COMPONENT_USAGE__ with the certified shell usage resolved from component certification */}
      __HIUI_RUNTIME_COMPONENT_USAGE__
      {/* keep adaptedSlots as the only business-slot input surface */}
      {false ? adaptedSlots : null}
    </>
  )
}
