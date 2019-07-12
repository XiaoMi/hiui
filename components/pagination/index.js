import Pagination from './Pagination'
import './style/index'
import { depreactedPropsCompat } from '../_util'

export default depreactedPropsCompat([
  ['type', 'mode'],
  ['max', 'pageBufferSize'],
  ['autoHide', 'hideOnSinglePage'],
  ['showJumper', 'showQuickJumper'],
  ['onPageSizeChange', 'sizeChangeEvent']
])(Pagination)
