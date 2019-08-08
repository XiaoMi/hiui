import React, { forwardRef } from 'react'
import Provider from '../context'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const WrapperComponent = Provider(({ version, legacy, innerRef, ...props }) => {
    const innerComponent = legacy === true || version < 2 ? componentLegacy : component
    return React.createElement(innerComponent, Object.assign({}, props, { ref: innerRef }))
  })
  return forwardRef((props, ref) => {
    return <WrapperComponent {...props} ref={ref} />
  })
}

export default SwitchVersion
