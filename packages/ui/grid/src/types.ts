export type GridJustifyEnum =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between'

export interface GridResponsiveSize<T> {
  /**
   * 设置屏幕 < 576px 时响应式栅格数
   */
  xs?: T
  /**
   * 设置屏幕 >= 576px 时响应式栅格数
   */
  sm?: T
  /**
   * 设置屏幕 >= 768px 时响应式栅格数
   */
  md?: T
  /**
   * 设置屏幕 >= 992px 时响应式栅格数
   */
  lg?: T
  /**
   * 设置屏幕 >= 1200px 时响应式栅格数
   */
  xl?: T
}
