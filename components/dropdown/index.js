import Dropdown from './Dropdown'
import DropdownLegacy from './dropdown-legacy'
import './style/index'
import { depreactedPropsCompat, SwitchVersion } from '../_util'

export const prefixCls = 'hi-dropdown'

export default SwitchVersion(
  depreactedPropsCompat([['data', 'list']])(Dropdown),
  DropdownLegacy
)
