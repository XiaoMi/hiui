import React from 'react'
import Provider from '../context'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const wrapperComponent = Provider(({ version, legacy, ...props }) => {
    if (legacy === false) {
      return React.createElement(component, props)
    }
    if (legacy === true) {
      return React.createElement(componentLegacy, props)
    }
    if (version < 2) {
      return React.createElement(componentLegacy, props)
    }
    return React.createElement(component, props)
  })
  if (component.format || componentLegacy.format) {
    wrapperComponent.format = component.format || componentLegacy.format
  }
  return wrapperComponent
}

export default SwitchVersion
