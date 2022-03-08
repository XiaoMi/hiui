import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cloneElement } from './util'
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

function getFilledItem(
  node: React.ReactElement,
  span: number | undefined,
  rowRestCol: number
): React.ReactElement {
  let clone = node

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    })
    console.warn(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.'
    )
  }

  return clone
}
function getColumn(column: DescriptionsProps['column']): number {
  if (typeof column === 'number') {
    return column
  }
  return 3
}

function getRows(children: React.ReactNode, column: number) {
  if (!Array.isArray(children)) return []
  const rows: React.ReactElement[][] = []

  let tmpRow: React.ReactElement[] = []
  let rowRestCol = column

  children.forEach((node: React.ReactElement, index: number) => {
    const span: number | undefined = node?.props?.span
    const mergedSpan = span || 1

    if (index === children.length - 1) {
      tmpRow.push(getFilledItem(node, span, rowRestCol))
      rows.push(tmpRow)
      return
    }

    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan
      tmpRow.push(node)
    } else {
      tmpRow.push(getFilledItem(node, mergedSpan, rowRestCol))
      rows.push(tmpRow)
      rowRestCol = column
      tmpRow = []
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
    const mergedColumn = getColumn(column)

    const rows = getRows(children, mergedColumn)
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
