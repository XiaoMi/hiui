/**
 * 栅格响应式断点
 * - xs: 0px ~ 575px
 * - sm: 576px ~ 767px
 * - md: 768px ~ 991px
 * - lg: 992px ~ 1199px
 * - xl: 1200px ~ Infinity
 */
export const GRID_VIEWPORT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const

export type GridJustifyEnum =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between'

export type GridAlignEnum = 'flex-start' | 'flex-end' | 'center' | 'stretch'

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
