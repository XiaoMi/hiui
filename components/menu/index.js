import Menu from './Menu'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  ['placement', 'mode'],
  ['collapsed', 'mini'],
  ['showCollapse', 'miniToggle'],
  ['showAllSubMenus', 'fatMenu'],
  ['onCollapse', 'onMiniChange'],
  ['data', 'datas']
])(Menu)
