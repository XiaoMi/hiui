import React, { forwardRef } from 'react'
import SingleInput from './singleInput'
import MultipleInput from './MultipleInput'

const InternalSelectInput = props => {
  const { mode, onEnterSelect, moveFocusedIndex } = props

  // 按键操作
  const handleKeyDown = evt => {
    if (evt.keyCode === 13) {
      onEnterSelect()
    }

    if (evt.keyCode === 38) {
      evt.preventDefault()
      moveFocusedIndex('up')
    }
    if (evt.keyCode === 40) {
      evt.preventDefault()
      moveFocusedIndex('down')
    }
  }
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
