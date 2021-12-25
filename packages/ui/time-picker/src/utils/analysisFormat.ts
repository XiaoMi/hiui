import { TimePickerFormat, TimePickerSelectorType } from '../@types'

export const analysisFormat = (format: TimePickerFormat): TimePickerSelectorType[] => {
  const searchList = [
    {
      identifier: 'HH',
      type: TimePickerSelectorType.hour,
    },
    {
      identifier: 'mm',
      type: TimePickerSelectorType.minute,
    },
    {
      identifier: 'ss',
      type: TimePickerSelectorType.second,
    },
  ]
  const result: TimePickerSelectorType[] = []

  searchList.forEach(({ identifier, type }) => {
    if (format.includes(identifier)) {
      result.push(type)
    }
  })

  return result
}
