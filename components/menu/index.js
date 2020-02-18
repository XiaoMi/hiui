import Menu from './Menu'
import { depreactedPropsCompat } from '../_util'
import Provider from '../context'

export default depreactedPropsCompat([
  ['placement', 'mode'],
  ['collapsed', 'mini'],
  ['showCollapse', 'miniToggle'],
  ['showAllSubMenus', 'fatMenu'],
  ['onCollapse', 'onMiniChange'],
  ['data', 'datas']
])(Provider(Menu))
export { Menu }
