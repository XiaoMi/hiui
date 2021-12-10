import { useMemo } from 'react'
import { DatePickerType } from '../types'

interface ParsePlaceholderConfig {
  type: DatePickerType
  placeholder: string | string[]
  showTime: boolean
  localeData: any
}
const parsePlaceholder = (config: ParsePlaceholderConfig) => {
  const { type, placeholder: _placeholder, showTime, localeData } = config
  const typePlaceholder = localeData.datePicker.placeholders[type]
  const tempPlaceholder = showTime
    ? localeData.datePicker.placeholderTimeperiod
    : typePlaceholder || [localeData.datePicker.placeholder]

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

const usePlaceholder = (args: ParsePlaceholderConfig) => {
  const { type, showTime, placeholder, localeData } = args

  return useMemo(() => parsePlaceholder(args), [type, showTime, placeholder, localeData])
}

export default usePlaceholder
