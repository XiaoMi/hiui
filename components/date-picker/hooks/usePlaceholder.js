import { useState, useEffect } from 'react'

const parsePlaceholder = ({ type, placeholder: _placeholder, showTime, localeDatas }) => {
  const typePlaceholder = localeDatas.datePicker.placeholders[type]
  const tempPlaceholder = showTime ? localeDatas.datePicker.placeholderTimeperiod : typePlaceholder || [localeDatas.datePicker.placeholder]

  let leftPlaceholder = tempPlaceholder[0]
  let rightPlaceholder = tempPlaceholder[1]

  if (_placeholder instanceof Array) {
    leftPlaceholder = _placeholder[0]
    rightPlaceholder = _placeholder[1] || _placeholder[0]
  } else if (typeof placeholder === 'string') {
    leftPlaceholder = _placeholder
    rightPlaceholder = _placeholder
  }
  return [leftPlaceholder, rightPlaceholder]
}
const usePlaceholder = (args) => {
  const [placeholders, setPlaceholders] = useState([])

  useEffect(() => {
    setPlaceholders(parsePlaceholder(args))
  }, [])

  return [placeholders]
}

export default usePlaceholder
