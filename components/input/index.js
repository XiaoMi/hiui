import React, { forwardRef } from 'react'

import Input from './Input'
import './style/index'
import InputLegacy from './input-legacy'
import Provider from '../context'

function SwitchVersion (component = {}, componentLegacy = {}) {
  return forwardRef((props, ref) => {
    const InnerComponent = props.legacy === true ? componentLegacy : component
    return <InnerComponent {...props} ref={ref} />
  })
}

export default SwitchVersion(Provider(Input), InputLegacy)

export {Input}
