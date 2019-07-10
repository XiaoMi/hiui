import Pagination from './Pagination'
import './style/index'
import { depreactedPropsCompat } from '../_util'
import SwitchVersion from '../_util/SwitchVersion'
import PaginationLegacy from './pagination-legacy/index'

export default depreactedPropsCompat([
  ['type', 'mode'],
  ['max', 'pageBufferSize'],
  ['autoHide', 'hideOnSinglePage'],
  ['showJumper', 'showQuickJumper'],
  ['onPageSizeChange', 'sizeChangeEvent']
])(Pagination)
