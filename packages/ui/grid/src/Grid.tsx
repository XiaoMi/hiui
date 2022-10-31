import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import { useGridContext, GridProvider } from './context'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isNumeric, isObject, isString } from '@hi-ui/type-assertion'
import { GridJustifyEnum, GridResponsiveSize } from './types'

const rowPrefix = getPrefixCls('grid-row')
const gutterNameVar = getPrefixStyleVar('grid-row-gutter')
const columnsNameVar = getPrefixStyleVar('grid-row-columns')
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

    const justifyContentStyle = calcResponsiveGrid({
      name: 'row-justify',
      value: justifyContent,
      defaultValue: 'flex-start',
      allowSet: isString,
      setValue(value) {
        return value
      },
    })

    const style = Object.assign(
      justifyContent
        ? {
            ...styleProp,
            display: 'flex',
            ...justifyContentStyle,
          }
        : { ...styleProp },
      {
        [gutterNameVar]: `${gutter}px`,
        [gapNameVar]: `${rowGap}px`,
        [columnsNameVar]: `${columns}`,
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
  justify?: GridJustifyEnum | GridResponsiveSize<GridJustifyEnum>
  /**
   * Row 里面元素之间是否有外边距，建议使用偶数
   */
  gutter?: boolean | number
  /**
   * 设置栅格列总数，一般是 12 或者 24 或者 48
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
// const spanNameVar = getPrefixStyleVar('grid-col-span')
// const offsetNameVar = getPrefixStyleVar('grid-col-offset')

const getGridStyleVar = (prop: string, size?: string) => {
  if (size) {
    return getPrefixStyleVar('grid-' + prop + '-' + size)
  }
  return getPrefixStyleVar('grid-' + prop)
}

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
      order,
      ...rest
    },
    ref
  ) => {
    const { columns = 24 } = useGridContext()

    const spanStyle = calcResponsiveGrid({
      name: 'col-span',
      value: spanProp,
      noneCallback: (style) => {
        style.flexBasis = 'auto'
        style.maxWidth = '100%'
      },
      allowSet: isNumeric,
      setValue(value) {
        return setGridSpan(value, 0, columns, 'offset')
      },
    })

    const offsetStyle = calcResponsiveGrid({
      name: 'col-offset',
      value: offsetProp,
      defaultValue: 0,
      allowSet: isNumeric,
      setValue(value) {
        return setGridSpan(value, 0, columns, 'offset')
      },
    })

    const orderStyle = calcResponsiveGrid({
      name: 'col-order',
      value: order,
      defaultValue: 0,
      allowSet: isNumeric,
      setValue(value) {
        return Number(value)
      },
    })

    const justifyContentStyle = calcResponsiveGrid({
      name: 'col-justify',
      value: justifyContent,
      defaultValue: 'flex-start',
      allowSet: isString,
      setValue(value) {
        return value
      },
    })

    const style = Object.assign(
      justifyContent
        ? {
            ...styleProp,
            display: 'flex',
            ...justifyContentStyle,
          }
        : { ...styleProp },
      spanStyle,
      offsetStyle,
      orderStyle
      // {
      // [spanNameVar]: span === null ? 'unset' : `calc(${span} / ${columns} * 100%)`,
      // [offsetNameVar]: `calc(${offset} / ${columns} * 100%)`,
      // }
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
  span?: number | GridResponsiveSize<number>
  /**
   *  Col 元素偏移多少个栅格
   */
  offset?: number | GridResponsiveSize<number>
  /**
   * 里面的元素排布方式
   */
  justify?: GridJustifyEnum | GridResponsiveSize<GridJustifyEnum>
  /**
   * Col项重排序，数值越大，越在后面展示
   */
  order?: number | GridResponsiveSize<number>
}

if (__DEV__) {
  Col.displayName = 'Col'
}

const setGridSpan = (value: number | string, min: number, max: number, propName: string) => {
  let nextValue = Number(value)

  if (__DEV__) {
    invariant(
      nextValue >= min && nextValue <= max,
      `Please set ${propName} in the range [${min}, ${max}] When using Grid component.`
    )
  }

  if (nextValue < 0) nextValue = 0
  if (nextValue > max) nextValue = max

  return nextValue
}

const GRID_SIZE_ARRAY = ['xs', 'sm', 'md', 'lg', 'xl']

function calcResponsiveGrid({
  value,
  defaultValue,
  allowSet,
  setValue,
  name,
  noneCallback,
}: {
  value: any
  defaultValue?: React.ReactText
  name: string
  allowSet: (value: any) => boolean
  setValue: (value: any) => any
  noneCallback?: (style: React.CSSProperties) => void
}) {
  const style: React.CSSProperties = {}

  if (isObject(value)) {
    let prevSpan: number | undefined

    GRID_SIZE_ARRAY.forEach((key) => {
      const varName = getGridStyleVar(name, key)
      // @ts-ignore
      const sizeValue = value[key]

      // @ts-ignore
      style[varName] = allowSet(sizeValue) ? setValue(sizeValue) : prevSpan
      // @ts-ignore
      prevSpan = style[varName]
    })
  } else {
    if (allowSet(value)) {
      value = setValue(value)
    } else {
      if (noneCallback) {
        noneCallback(style)
      } else if (typeof defaultValue !== 'undefined') {
        value = defaultValue
      }
    }

    const varName = getGridStyleVar(name)
    // @ts-ignore
    style[varName] = value
  }

  return style
}
