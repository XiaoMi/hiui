/* generated from hiui-design runtime bridge slot adapter template */
/* template asset: __HIUI_TEMPLATE_PATH__ */
/* runtime bridge profile: __HIUI_RUNTIME_BRIDGE_PROFILE_ID__ */
/* selected component: __HIUI_PAGE_COMPONENT_ID__ */
/* bridge rule: slot adapter may bind business slots only; do not translate managed regions */

export type __HIUI_SLOT_ADAPTER_PROPS__ = {
  businessSlots: Record<string, unknown>
  controlledExtensions?: Record<string, unknown>
  runtimeBridge: {
    request?: unknown
    response?: unknown
    message?: unknown
    i18n?: unknown
    permission?: unknown
    routeNavigation?: unknown
    theme?: unknown
    modalRoot?: unknown
    dictionaries?: unknown
  }
}

export function __HIUI_SLOT_ADAPTER_NAME__({
  businessSlots,
  controlledExtensions = {},
  runtimeBridge,
}: __HIUI_SLOT_ADAPTER_PROPS__) {
  return {
    businessSlots,
    controlledExtensions,
    runtimeBridge,
  }
}

export default __HIUI_SLOT_ADAPTER_NAME__
