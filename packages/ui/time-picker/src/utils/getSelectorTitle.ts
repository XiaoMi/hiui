import { TimePickerSelectorType } from '../@types'

export const getSelectorTitle = (type: TimePickerSelectorType) => {
  const titleMap = {
    [TimePickerSelectorType.hour]: '时',
    [TimePickerSelectorType.minute]: '分',
    [TimePickerSelectorType.second]: '秒',
  }

  return titleMap[type]
}
