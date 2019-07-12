import Cascader from './Cascader'
import './style/index'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  ['data', 'options'],
  ['emptyContent', 'noFoundTip'],
  ['fieldNames', 'fieldNames']
])(Cascader)
