import React from 'react'
import Radio from './Radio'
import RadioLegacy from './radio-legacy/index'
import Group from './Group'
import './style/index'

const VRadio = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? RadioLegacy : Radio
  return <WrapperComponent {...props} />
}

VRadio.Group = Group

export default VRadio
