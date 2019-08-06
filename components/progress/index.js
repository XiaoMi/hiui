import Progress from './Progress'
import { depreactedPropsCompat } from '../_util'
import './style/index'

export default depreactedPropsCompat([
  ['apperance', 'type'],
  ['content', 'text'],
  ['showInfo', 'withOutText'],
  ['type', 'status'],
  ['placement', 'inside', (data) => (data ? 'inside' : 'outside')]
])(Progress)
