import { useMemo } from 'react'

const parsePlaceholder = ({ type, placeholder: _placeholder, showTime, localeDatas }) => {
  const typePlaceholder = localeDatas.datePicker.placeholders[type]
  const tempPlaceholder = showTime
    ? localeDatas.datePicker.placeholderTimeperiod
    : typePlaceholder || [localeDatas.datePicker.placeholder]

  let leftPlaceholder = tempPlaceholder[0]
  let rightPlaceholder = tempPlaceholder[1] || leftPlaceholder

  if (_placeholder instanceof Array) {
    leftPlaceholder = _placeholder[0]
    rightPlaceholder = _placeholder[1] || _placeholder[0]
  } else if (typeof _placeholder !== 'undefined') {
    leftPlaceholder = _placeholder
    rightPlaceholder = _placeholder
  }
  return [leftPlaceholder, rightPlaceholder]
}
const usePlaceholder = (args) => {
  const { type, showTime, placeholder, localeDatas } = args

  const placeholders = useMemo(() => parsePlaceholder(args), [type, showTime, placeholder, localeDatas])
  return placeholders
}

export default usePlaceholder
