import { SelectorItem } from '../Selector'
import {
  TimePickerSelectorType,
  TimePickerStep,
  TimePickerFilter,
  TimePickerPanelType,
} from '../@types'

export const generateSelectorData = (info: {
  type: TimePickerSelectorType
  filter: Required<TimePickerFilter>
  step: Required<TimePickerStep>
  separateValue: number[]
  selectorTypes: TimePickerSelectorType[]
  panelType: TimePickerPanelType
}) => {
  const { type, filter, step, separateValue, panelType, selectorTypes } = info
  const result: SelectorItem[] = []

  const getMatchTypeValue = (selectorType: TimePickerSelectorType) => {
    const matchIndex = selectorTypes.indexOf(selectorType)
    return matchIndex >= 0 ? separateValue[matchIndex] : -1
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
  const disabledNumbers = disabledMap[type]()

  const rangeMap = {
    [TimePickerSelectorType.hour]: [0, 23],
    [TimePickerSelectorType.minute]: [0, 59],
    [TimePickerSelectorType.second]: [0, 59],
  }
  const range = rangeMap[type]

  const stepMap = {
    [TimePickerSelectorType.hour]: step.hourStep,
    [TimePickerSelectorType.minute]: step.minuteStep,
    [TimePickerSelectorType.second]: step.secondStep,
  }

  for (let index = range[0]; index <= range[1]; index += stepMap[type]) {
    result.push({
      title: String(index).padStart(2, '0'),
      disabled: disabledNumbers.includes(index),
      id: String(index),
    })
  }

  return result
}
