import Radio from './Radio'
import RadioLegacy from './radio-legacy/index'
import Group from './Group'
import SwitchVersion from '../_util/SwitchVersion'
import './style/index'

Radio.Group = Group

export default SwitchVersion(Radio, RadioLegacy)
