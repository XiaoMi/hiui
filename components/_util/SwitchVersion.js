import React, { forwardRef } from 'react'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const WrapperComponent = forwardRef(({ legacy, ...props }, ref) => {
    const InnerComponent = legacy === true ? componentLegacy : component
    for (const staticProp in InnerComponent) {
      WrapperComponent[staticProp] = InnerComponent[staticProp]
    }
    return <InnerComponent {...{ ...props, ref }} />
  })
  return WrapperComponent
}

export default SwitchVersion
