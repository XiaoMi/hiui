import React, { forwardRef } from 'react'
import Provider from '../context'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const WrapperComponent = Provider(({ version, legacy, innerRef, ...props }) => {
    if (legacy === false) {
      return React.createElement(component, Object.assign({}, props, {ref: innerRef}))
    }
    if (legacy === true) {
      return React.createElement(componentLegacy, Object.assign({}, props, {ref: innerRef}))
    }
    if (version < 2) {
      return React.createElement(componentLegacy, Object.assign({}, props, {ref: innerRef}))
    }
    return React.createElement(component, Object.assign({}, props, {ref: innerRef}))
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
