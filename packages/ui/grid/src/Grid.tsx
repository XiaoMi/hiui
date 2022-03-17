import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useGridContext, GridProvider } from './context'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isNumeric } from '@hi-ui/type-assertion'

const rowPrefix = getPrefixCls('grid-row')
const gutterNameVar = getPrefixStyleVar('grid-row-gutter')
const gapNameVar = getPrefixStyleVar('grid-row-gap')

// Row 与 Row 默认间距
const DEFAULT_ROW_GAP = 16
// Row 内每项 Col 默认间距
const DEFAULT_GUTTER_GAP = 16

/**
 * TODO: What is Grid Row
 */
export const Row = forwardRef<HTMLDivElement | null, RowProps>(
  (
    {
      prefixCls = rowPrefix,
      className,
      children,
      style: styleProp,
      justify: justifyContent,
      columns = 24,
      rowGap = DEFAULT_ROW_GAP,
      gutter: gutterProp = false,
      ...rest
    },
    ref
  ) => {
    const gutter = useMemo(() => {
      if (typeof gutterProp === 'boolean') {
        return gutterProp ? DEFAULT_GUTTER_GAP : 0
      }

      if (isNumeric(gutterProp)) {
        let gap = Number(gutterProp)
        if (gap < 0) {
          console.info('Warning: The gutter should be a positive number.')
          gap = DEFAULT_GUTTER_GAP
        }
        return gap
      }

      return 0
    }, [gutterProp])

    const style = Object.assign(
      justifyContent
        ? {
            display: 'flex',
            justifyContent,
          }
        : {},
      styleProp,
      {
        [gutterNameVar]: `${gutter}px`,
        [gapNameVar]: `${rowGap}px`,
      }
    )

    const cls = cx(prefixCls, className)

    const providedContext = useMemo(() => ({ columns }), [columns])

    return (
      <GridProvider value={providedContext}>
        <div ref={ref} className={cls} style={style} {...rest}>
          {children}
        </div>
      </GridProvider>
    )
  }
)

export interface RowProps extends HiBaseHTMLProps<'div'> {
  /**
   * 里面的元素排布方式
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between'
  /**
   * Row 里面元素之间是否有外边距，建议使用偶数
   */
  gutter?: boolean | number
  /**
   * 设置栅格列总数，一般是 24 或者 48。暂不对外暴露
   * @private
   */
  columns?: number
  /**
   * Row 与 Row 之间的距离
   */
  rowGap?: number
}

if (__DEV__) {
  Row.displayName = 'Row'
}

const colPrefix = getPrefixCls('grid-col')
const spanNameVar = getPrefixStyleVar('grid-col-span')
const offsetNameVar = getPrefixStyleVar('grid-col-offset')

/**
 * TODO: What is Grid Col
 */
export const Col = forwardRef<HTMLDivElement | null, ColProps>(
  (
    {
      prefixCls = colPrefix,
      className,
      children,
      style: styleProp,
      span: spanProp,
      offset: offsetProp = 0,
      justify: justifyContent,
      ...rest
    },
    ref
  ) => {
    const { columns = 24 } = useGridContext()

    // 需要 warning 不合法
    const span = isNumeric(spanProp) && spanProp >= 0 && spanProp <= columns ? spanProp : null
    const offset = isNumeric(offsetProp) && offsetProp >= 0 && offsetProp < columns ? offsetProp : 0

    const style = Object.assign(
      justifyContent
        ? {
            ...styleProp,
            display: 'flex',
            justifyContent,
          }
        : {},
      styleProp,
      {
        [spanNameVar]: span === null ? 'unset' : `calc(${span} / ${columns} * 100%)`,
        [offsetNameVar]: `calc(${offset} / ${columns} * 100%)`,
      }
    )

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} className={cls} style={style} {...rest}>
        {children}
      </div>
    )
  }
)

export interface ColProps extends HiBaseHTMLProps<'div'> {
  /**
   *  Col 元素占多少个栅格
   */
  span?: number
  /**
   *  Col 元素偏移多少个栅格
   */
  offset?: number
  /**
   * 里面的元素排布方式
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between'
}

if (__DEV__) {
  Col.displayName = 'Col'
}

const brPrefix = getPrefixCls('grid-br')

/**
 * TODO: What is Grid Br
 */
export const Br = forwardRef<HTMLDivElement | null, BrProps>(
  ({ prefixCls = brPrefix, className, style: styleProp, height, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    const style = height ? { ...styleProp, height } : styleProp

    return <div ref={ref} className={cls} style={style} {...rest}></div>
  }
)

export interface BrProps extends HiBaseHTMLProps<'div'> {
  /**
   *  换行符高度
   */
  height?: number
}

if (__DEV__) {
  Br.displayName = 'Br'
}
