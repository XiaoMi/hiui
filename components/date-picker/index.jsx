// import Datepicker from './DatePicker'
// import MonthPicker from './MonthPicker'
// import YearPicker from './YearPicker'
// import WeekPicker from './WeekPicker'
// import RangePicker from './RangePicker'
import BasePicker from './BasePicker'
import TimePicker from './TimePicker'
import moment from 'moment'
BasePicker.format = (date, format) => {
  return moment(date).format(format)
}
export default BasePicker
export {
  TimePicker
}
// export  {
//     MonthPicker,
//     YearPicker,
//     WeekPicker,
//     RangePicker
// }
