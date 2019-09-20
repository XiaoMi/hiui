import React, { forwardRef } from 'react'

function SwitchVersion (component = {}, componentLegacy = {}) {
  const WrapperComponent = ({ legacy, innerRef, ...props }) => {
    const innerComponent = legacy === true ? componentLegacy : component
    return React.createElement(
      innerComponent,
      Object.assign({}, props, { ref: innerRef })
    )
  }
  return forwardRef((props, ref) => {
    return <WrapperComponent {...props} ref={ref} />
  })
}

export default SwitchVersion
