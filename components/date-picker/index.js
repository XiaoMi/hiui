import DatePicker from './DatePicker'
import SwitchVersion from '../_util/SwitchVersion'
import DatepickerLegacy from './datepicker-legacy'
import { dateFormat } from './dateUtil'
import './style/index'

const Component = SwitchVersion(DatePicker, DatepickerLegacy)
Component.format = dateFormat
export default Component
