import React, { forwardRef } from 'react'
import { Row, Col } from '../Grid'
import type { RowProps, ColProps } from '../Grid'
import { DEFAULT_COLUMN_COUNT } from './use-column-count'
import { isInvalidGridEl, getGridElSpan } from './utils'
import { __DEV__ } from '@hi-ui/env'

const DEFAULT_COLUMNS = 24

export interface AutoGridNodeType {
  key: React.Key
  elem: React.ReactElement | null
  props?: ColProps | ((ctx: { columns: number; columnCount: number }) => ColProps)
}

export type AutoGridProps = RowProps & {
  /** 列元素清单 */
  nodes?: AutoGridNodeType[]
  /**
   * 子元素清单
   * - 存在子元素时，会自动按照默认的配置增加网格包裹
   * - 如需控制子元素占据的网格数，请在元素上增加 span 或者 data-span 属性
   */
  children?: React.ReactNode[]
  /** 列数 */
  columnCount?: number
}

export const AutoGrid = forwardRef<HTMLDivElement | null, AutoGridProps>(
  (
    {
      nodes,
      children,
      columnCount: columnCountProp = DEFAULT_COLUMN_COUNT,
      columns = DEFAULT_COLUMNS,
      gutter = true,
      rowGap = 0,
      ...restRowProps
    },
    ref
  ) => {
    const rowProps: RowProps = {
      columns,
      gutter,
      rowGap,
      ...restRowProps,
    }

    const validColumns = rowProps.columns ?? DEFAULT_COLUMNS
    const colSpan = Math.floor(validColumns / columnCountProp)

    // 存在 children 时，自动按照默认的配置增加网格配置
    if (children != null) {
      const validChildren = React.Children.toArray(children).filter((child) =>
        React.isValidElement(child)
      )
      if (validChildren.length === 0) return null

      return (
        <Row ref={ref} {...rowProps}>
          {validChildren.map((child, index) => {
            const span = getGridElSpan(child) ?? colSpan
            return (
              <Col key={(child as React.ReactElement).key ?? index} span={span}>
                {child}
              </Col>
            )
          })}
        </Row>
      )
    }

    if (!nodes?.length) return null
    return (
      <Row ref={ref} {...rowProps}>
        {nodes.map((col, index) => {
          const baseColProps = { span: colSpan }
          const resolvedProps =
            typeof col.props === 'function'
              ? col.props({ columns: validColumns, columnCount: columnCountProp })
              : col.props
          const colProps = { ...baseColProps, ...resolvedProps }

          if (isInvalidGridEl(col.elem)) return null
          return (
            <Col key={col.key ?? index} {...colProps}>
              {col.elem}
            </Col>
          )
        })}
      </Row>
    )
  }
)

if (__DEV__) {
  AutoGrid.displayName = 'AutoGrid'
}
