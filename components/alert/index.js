import Alert from './Alert'
import './style/index'
import { depreactedPropsCompat } from '../_util'
import Provider from '../context'

export default depreactedPropsCompat([
  ['content', 'message'],
  ['duration', 'autoCloseTime']
])(Provider(Alert))
