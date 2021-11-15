import {
  TimePickerFilter,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerSelectorType,
  TimePickerStep,
} from '../@types'
import { analysisFormat } from './analysisFormat'

export const valueChecker = (info: {
  value: string
  format: TimePickerFormat
  filter: Required<TimePickerFilter>
  step: Required<TimePickerStep>
  panelType: TimePickerPanelType
}) => {
  const { value, format, filter, panelType, step } = info
  const selectorTypes = analysisFormat(format)
  const checkerMap = {
    [TimePickerSelectorType.hour]: (e: number) => e >= 0 && e <= 23,
    [TimePickerSelectorType.minute]: (e: number) => e >= 0 && e <= 59,
    [TimePickerSelectorType.second]: (e: number) => e >= 0 && e <= 59,
  }
  // 允许为空的情况
  if (value === '') {
    return true
  }
  if (!value) {
    return false
  }

  const separateParts = value
    .split(':')
    .filter((item) => !!item && item.length === 2)
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

  const stepMap = {
    [TimePickerSelectorType.hour]: step.hourStep,
    [TimePickerSelectorType.minute]: step.minuteStep,
    [TimePickerSelectorType.second]: step.secondStep,
  }

  for (let counter = 0; counter < separateParts.length; counter++) {
    const type = selectorTypes[counter]
    const stepNumber = stepMap[type]
    const disabledNumbers = disabledMap[type]()
    const checker = checkerMap[type]
    const checkNumber = separateParts[counter]
    // 不符合要求的数字
    // 被禁用的数字
    // 不符合 step 的数字
    if (
      !checker(checkNumber) ||
      disabledNumbers.includes(checkNumber) ||
      checkNumber % stepNumber !== 0
    ) {
      return false
    }
  }

  return true
}
