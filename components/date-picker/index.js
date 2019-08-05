import DatePicker from './DatePicker'
import SwitchVersion from '../_util/SwitchVersion'
import DatepickerLegacy from './datepicker-legacy'
import './style/index'

export default SwitchVersion(DatePicker, DatepickerLegacy)
