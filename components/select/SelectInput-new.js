import React, { forwardRef } from 'react'
import SingleInput from './singleInput'
const InternalSelectInput = props => {
  let { mode } = props

  // 多选显示内容
  const renderMultiple = () => {
    return 123
  }

  return mode === 'multiple' ? renderMultiple() : <SingleInput {...props} />
}
const SelectInput = forwardRef((props, ref) => {
  return <InternalSelectInput {...props} innerRef={ref} />
})
export default SelectInput
