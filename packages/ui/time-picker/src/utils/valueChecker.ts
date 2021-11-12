import {
  TimePickerFilter,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerSelectorType,
} from '../@types'
import { analysisFormat } from './analysisFormat'

export const valueChecker = (info: {
  value: string
  format: TimePickerFormat
  filter: Required<TimePickerFilter>
  panelType: TimePickerPanelType
}) => {
  const { value, format, filter, panelType } = info
  const selectorTypes = analysisFormat(format)
  const checkerMap = {
    [TimePickerSelectorType.hour]: (e: number) => e >= 0 && e <= 23,
    [TimePickerSelectorType.minute]: (e: number) => e >= 0 && e <= 59,
    [TimePickerSelectorType.second]: (e: number) => e >= 0 && e <= 59,
  }

  if (!value) {
    return false
  }

  const separateParts = value
    .split(':')
    .filter((item) => !!item)
    .map((item) => Number(item))

  if (separateParts.length !== selectorTypes.length) {
    return false
  }

  const getMatchTypeValue = (selectorType: TimePickerSelectorType) => {
    const matchIndex = selectorTypes.indexOf(selectorType)
    return matchIndex >= 0 ? separateParts[matchIndex] : -1
  }

  const disabledMap = {
    [TimePickerSelectorType.hour]: () => filter.disabledHours(panelType),
    [TimePickerSelectorType.minute]: () =>
      filter.disabledMinutes(getMatchTypeValue(TimePickerSelectorType.hour), panelType),
    [TimePickerSelectorType.second]: () =>
      filter.disabledSeconds(
        getMatchTypeValue(TimePickerSelectorType.hour),
        getMatchTypeValue(TimePickerSelectorType.minute),
        panelType
      ),
  }

  for (let counter = 0; counter < separateParts.length; counter++) {
    const type = selectorTypes[counter]
    const disabledNumbers = disabledMap[type]()
    const checker = checkerMap[type]
    // 不符合要求的数字
    // 被禁用的数字
    if (!checker(separateParts[counter]) || disabledNumbers.includes(separateParts[counter])) {
      return false
    }
  }

  return true
}
