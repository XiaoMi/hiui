import React from 'react'
import Select from './Select'
import SelectLegacy from './select-legacy'
import './style/index'

const SelectWrapper = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? SelectLegacy : Select
  return <WrapperComponent {...props} />
}

export default SelectWrapper
