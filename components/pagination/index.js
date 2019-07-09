import Pagination from './Pagination'
import './style/index'
import SwitchVersion from '../_util/SwitchVersion'
import PaginationLegacy from './pagination-legacy/index'

export default SwitchVersion(Pagination, PaginationLegacy)
