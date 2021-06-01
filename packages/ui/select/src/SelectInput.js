import React, { forwardRef } from "react"
import SingleInput from "./SingleInput"
import MultipleInput from "./MultipleInput"

const InternalSelectInput = (props) => {
  const { mode } = props

  return mode === "multiple" ? <MultipleInput {...props} /> : <SingleInput {...props} />
}
const SelectInput = forwardRef((props, ref) => {
  return <InternalSelectInput {...props} innerRef={ref} />
})
export default SelectInput
