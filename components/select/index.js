import React from 'react'
import Select from './Select'
import SelectV1 from './select-legacy/select-v1'
import SelectV2 from './select-legacy/select-v2'
import './style/index'

const SelectWrapper = ({ legacy, legacyV2, ...props }) => {
  let WrapperComponent = legacy ? SelectV1 : Select
  WrapperComponent = legacyV2 ? SelectV2 : WrapperComponent

  return <WrapperComponent {...props} />
}

export default SelectWrapper
