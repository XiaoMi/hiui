import { useMemo } from 'react'
import { DatePickerTypeEnum } from '../types'
import { UseLocaleContext } from '@hi-ui/locale-context'

interface ParsePlaceholderConfig {
  type: DatePickerTypeEnum
  placeholder?: string | string[]
  showTime: boolean
  i18n: UseLocaleContext
}
const parsePlaceholder = (config: ParsePlaceholderConfig) => {
  const { type, placeholder: _placeholder, showTime, i18n } = config
  const placeholdersText = i18n.get('datePicker.placeholders') as any
  const placeholderText = i18n.get('datePicker.placeholder') as any
  const placeholderTimePeriodText = i18n.get('datePicker.placeholderTimePeriod') as any

  const typePlaceholder = placeholdersText[type]
  const tempPlaceholder = showTime
    ? placeholderTimePeriodText
    : typePlaceholder || [placeholderText]

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
  const { type, showTime, placeholder, i18n } = args

  return useMemo(() => parsePlaceholder({ type, showTime, placeholder, i18n }), [
    type,
    showTime,
    placeholder,
    i18n,
  ])
}

export default usePlaceholder
