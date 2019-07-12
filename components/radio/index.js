import Radio from './Radio'
import RadioLegacy from './radio-legacy/index'
import Group from './Group'
import SwitchVersion from '../_util/SwitchVersion'
import './style/index'

const VRadio = SwitchVersion(Radio, RadioLegacy)
const VGroup = SwitchVersion(Group, undefined)

VRadio.Group = VGroup

export default VRadio
