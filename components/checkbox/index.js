import Checkbox from './Checkbox'
import CheckboxLegacy from './checkbox-legacy/index'
import Group from './Group'
import SwitchVersion from '../_util/SwitchVersion'
import './style/index'

Checkbox.Group = Group

export default SwitchVersion(Checkbox, CheckboxLegacy)
