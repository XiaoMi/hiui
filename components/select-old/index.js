import Select from './Select'
import SelectLegacy from './select-legacy'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'

export default SwitchVersion(Select, SelectLegacy)
