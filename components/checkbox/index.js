import React from 'react'
import Checkbox from './Checkbox'
import CheckboxLegacy from './checkbox-legacy/index'
import Group from './Group'
import './style/index'

const VCheckbox = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? CheckboxLegacy : Checkbox
  return <WrapperComponent {...props} />
}

VCheckbox.Group = Group
VCheckbox.displayName = 'Checkbox'

export default VCheckbox
