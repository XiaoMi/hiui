import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cloneElement, toArray } from './util'
import { Row } from './Row'

const DESCRIPTIONS_PREFIX = getPrefixCls('descriptions')

/**
 * TODO: What is Descriptions
 */

function computeFilledItem(
  node: React.ReactElement,
  span: number | undefined,
  rowRestCol: number
): React.ReactElement {
  let clone = node

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    })
  }

  return clone
}

function computeColumn(column: DescriptionsProps['column']): number {
  if (typeof column === 'number') {
    return column
  }
  return 3
}

function computeRows(children: React.ReactNode, column: number) {
  if (!Array.isArray(children)) return []
  const childrenNodes = toArray(children)
  const rows: React.ReactElement[][] = []

  let rowItems: React.ReactElement[] = []
  let rowRestCol = column

  childrenNodes.forEach((node: React.ReactElement, index: number) => {
    const span: number | undefined = node?.props?.span
    const mergedSpan = span || 1

    if (index === children.length - 1) {
      rowItems.push(computeFilledItem(node, span, rowRestCol))
      rows.push(rowItems)
      return
    }

    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan
      rowItems.push(node)
    } else {
      rowItems.push(computeFilledItem(node, mergedSpan, rowRestCol))
      rows.push(rowItems)
      rowRestCol = column
      rowItems = []
    }
  })
  return rows
}

export const Descriptions = forwardRef<HTMLDivElement | null, DescriptionsProps>(
  (
    {
      prefixCls = DESCRIPTIONS_PREFIX,
      role = 'descriptions',
      className,
      style,
      children,
      column = 3,
      placement,
      appearance,
      noBackground,
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      {
        [`${prefixCls}-bordered`]: appearance === 'table',
        [`${prefixCls}-no-background`]: !!noBackground,
      },
      className
    )
    const mergedColumn = computeColumn(column)

    const rows = computeRows(children, mergedColumn)
    return (
      <div ref={ref} role={role} className={cls} {...rest} style={style}>
        <table>
          <tbody>
            {rows.map((row, index) => (
              <Row
                key={index}
                index={index}
                prefixCls={prefixCls}
                vertical={placement === 'vertical'}
                bordered={appearance === 'table'}
                row={row}
                noBackground={noBackground}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

export interface DescriptionsProps extends HiBaseHTMLProps<'div'> {
  /**
   * 	children
   */
  children?: React.ReactNode
  /**
   * 	 布局方式，默认'horizontal'
   */
  placement?: 'horizontal' | 'vertical'
  /**
   * 	 描述样式，分为table样式和unset
   */
  appearance?: 'table' | 'unset'
  /**
   * 	 列数，表示一行包含DescriptionItems的数量
   */
  column?: number
  className?: string
  style?: React.CSSProperties
  noBackground?: boolean
}

if (__DEV__) {
  Descriptions.displayName = 'Descriptions'
}
