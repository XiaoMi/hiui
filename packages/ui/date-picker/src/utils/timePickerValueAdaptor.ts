import moment from 'moment'
import _ from 'lodash'
import { TimePickerFormat } from '@hi-ui/time-picker'
export const timePickerValueAdaptor = (config: {
  timePickerValue: string[]
  data: moment.Moment[]
  isRange: boolean
  format: TimePickerFormat
}) => {
  const { timePickerValue, data, isRange, format } = config
  const result = _.cloneDeep(data)

  const setKeyMap = {
    hh: 'hours',
    mm: 'minutes',
    ss: 'seconds',
  } as any
  const setKeys = format.split(':').map((item) => setKeyMap[item.toLowerCase()] as string)

  const adaptor = (from: string, to: moment.Moment) => {
    const values = from.split(':').map((item) => Number(item))
    setKeys.forEach((item, index) => to.set(item as any, values[index]))
  }

  adaptor(timePickerValue[0], result[0])
  if (isRange) {
    adaptor(timePickerValue[1], result[1])
  }

  return result
}
