import Checkbox from './Checkbox'
import CheckboxLegacy from './checkbox-legacy/index'
import Group from './Group'
import SwitchVersion from '../_util/SwitchVersion'
import './style/index'

const VGroup = SwitchVersion(Group, undefined)
const VCheckbox = SwitchVersion(Checkbox, CheckboxLegacy)

VCheckbox.Group = VGroup
VCheckbox.displayName = 'Checkbox'

export default VCheckbox
