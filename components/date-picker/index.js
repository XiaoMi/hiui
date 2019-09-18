import DatePicker from './DatePicker'
import { dateFormat } from './dateUtil'
import Provider from '../context'
import './style/index'

// const Component = SwitchVersion(DatePicker, DatepickerLegacy)
DatePicker.format = dateFormat
export default Provider(DatePicker)
