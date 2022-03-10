import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cloneElement, toArray } from './util'
import Row from './Row'

const DESCRIPTIONS_PREFIX = getPrefixCls('descriptions')
export interface DescriptionsProps extends HiBaseHTMLProps<'div'> {
  children?: React.ReactNode
  layout?: 'horizontal' | 'vertical'
  bordered?: boolean
  column?: number
  labelStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  className?: string
  style?: React.CSSProperties
  noBackground?: boolean
}
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
      layout,
      bordered,
      labelStyle,
      contentStyle,
      noBackground,
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      { [`${prefixCls}-bordered`]: !!bordered, [`${prefixCls}-no-background`]: !!noBackground },
      className
    )
    const mergedColumn = computeColumn(column)

    const rows = computeRows(children, mergedColumn)
    return (
      <div ref={ref} role={role} className={cls} {...rest} style={style}>
        <div className={`${prefixCls}-view`}>
          <table>
            <tbody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  index={index}
                  prefixCls={prefixCls}
                  vertical={layout === 'vertical'}
                  bordered={bordered}
                  row={row}
                  rootLabelStyle={labelStyle}
                  rootContentStyle={contentStyle}
                  noBackground={noBackground}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)

if (__DEV__) {
  Descriptions.displayName = 'Descriptions'
}
