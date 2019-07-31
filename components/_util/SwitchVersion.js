import React, { forwardRef } from 'react'
import Provider from '../context'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const WrapperComponent = Provider(({ version, legacy, innerRef, ...props }) => {
    const innerComponent = (legacy === false || version < 2) ? component : componentLegacy
    return React.createElement(innerComponent, Object.assign({}, props, {ref: innerRef}))
  })
  if (component.format || componentLegacy.format) {
    WrapperComponent.format = component.format || componentLegacy.format
  }
  return forwardRef((props, ref) => {
    return (
      <WrapperComponent {...props} ref={ref} />
    )
  })
}

export default SwitchVersion
