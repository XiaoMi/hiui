export export interface PaginationProps {
  type?: 'default' | 'simple' | 'shrink'
  defaultCurrent?: number
  current?: number
  max?: number
  pageSize?: number
  total: number
  pageSizeOptions?: number[]
  autoHide?: boolean
  showJumper?: boolean
  style?: React.CSSProperties
  className?: string
  onJump?: (current: number) => void
  onChange?: (currentPage: number, prevPage: number, pageSize: number) => void
  onPageSizeChange?: (changeSize: number, currentPage: number) => void
}
declare const Pagination: React.ComponentType<PaginationProps>
export default Pagination
