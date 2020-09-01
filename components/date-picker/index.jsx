import BasePicker from './BasePicker'
import TimePicker from './TimePicker'
import moment from 'moment'
BasePicker.format = (date, format) => {
  return moment(date).format(format)
}
export default BasePicker
export { TimePicker }
