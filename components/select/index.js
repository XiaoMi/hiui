import Select from './Select'
import Option from './Option'
import SelectLegacy from './select-legacy'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'

Select.Option = Option

export default SwitchVersion(Select, SelectLegacy)
