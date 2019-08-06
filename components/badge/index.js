import Badge from './Badge'
import './style/index'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  ['content', 'value'],
  ['type', 'dot', (data) => (data ? 'dot' : 'bubble')],
  ['visible', 'hidden', (data) => !data]
])(Badge)
