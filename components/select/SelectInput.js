import React, { forwardRef } from 'react'
import SingleInput from './singleInput'
import MultipleInput from './MultipleInput'

const InternalSelectInput = props => {
  const { mode, handleKeyDown } = props

  return mode === 'multiple' ? (
    <MultipleInput {...props} handleKeyDown={handleKeyDown} />
  ) : (
    <SingleInput {...props} handleKeyDown={handleKeyDown} />
  )
}
const SelectInput = forwardRef((props, ref) => {
  return <InternalSelectInput {...props} innerRef={ref} />
})
export default SelectInput
