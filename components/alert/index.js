import Alert from './Alert'
import './style/index'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  ['content', 'message'],
  ['duration', 'autoCloseTime']
])(Alert)
