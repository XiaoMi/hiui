import { TimePickerFormat, TimePickerSelectorType } from '../@types'
import { analysisFormat } from './analysisFormat'

export const getNowString = (formatString: TimePickerFormat) => {
  const format = analysisFormat(formatString)

  const now = new Date()
  const timeMap = {
    [TimePickerSelectorType.hour]: String(now.getHours()).padStart(2, '0'),
    [TimePickerSelectorType.minute]: String(now.getMinutes()).padStart(2, '0'),
    [TimePickerSelectorType.second]: String(now.getSeconds()).padStart(2, '0'),
  }
  return format.map((item) => timeMap[item]).join(':')
}
