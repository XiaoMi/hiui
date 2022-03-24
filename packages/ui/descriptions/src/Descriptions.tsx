import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cloneElement, toArray } from './util'
import { Row } from './Row'

const DESCRIPTIONS_PREFIX = getPrefixCls('descriptions')

/**
 * TODO: What is Descriptions
 */

export const Descriptions = forwardRef<HTMLDivElement | null, DescriptionsProps>(
  (
    {
      prefixCls = DESCRIPTIONS_PREFIX,
      role = 'descriptions',
      className,
      children,
      column = 3,
      placement = 'horizontal',
      appearance = 'unset',
      labelPlacement = 'left',
      labelWidth,
      ...rest
    },
    ref
  ) => {
    const rows = computeRows(children, column)
    const noBackground = appearance === 'unset' && labelPlacement === 'right'

    const vertical = placement === 'vertical'
    const bordered = appearance === 'table' || noBackground

    const cls = cx(
      prefixCls,
      appearance && `${prefixCls}--appearance-${appearance}`,
      !!noBackground && `${prefixCls}--no-background`,
      className
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <table>
          <tbody>
            {rows.map((row, index) => (
              <Row
                key={index}
                index={index}
                prefixCls={prefixCls}
                row={row}
                vertical={vertical}
                bordered={bordered}
                noBackground={noBackground}
                labelPlacement={labelPlacement}
                rootLabelWidth={labelWidth}
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
   * 	 对齐方式，默认'horizontal'
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
  /**
   * 	 label对齐方式
   */
  labelPlacement?: 'left' | 'right'
  /**
   * 	 label宽度
   */
  labelWidth?: string
}

if (__DEV__) {
  Descriptions.displayName = 'Descriptions'
}

function computeRows(children: React.ReactNode, column: number) {
  if (!Array.isArray(children)) return []

  const childrenNodes = toArray(children)

  const rows: React.ReactElement[][] = []

  let rowItems: React.ReactElement[] = []
  let rowRestCol = column

  // 根据 column 计算生成二维表格展示
  childrenNodes.forEach((node: React.ReactElement, index: number) => {
    let span: number = node?.props?.span ?? 1

    if (span < 1) {
      invariant(true, 'The span should be a positive integer in Descriptions component.')
      span = 1
    }

    if (index === children.length - 1) {
      rowItems.push(computeFilledItem(node, undefined, rowRestCol))
      rows.push(rowItems)
      return
    }

    if (span < rowRestCol) {
      rowRestCol -= span
      rowItems.push(node)
    } else {
      rowItems.push(computeFilledItem(node, span, rowRestCol))
      rows.push(rowItems)
      rowRestCol = column
      rowItems = []
    }
  })
  return rows
}

function computeFilledItem(node: React.ReactElement, span: number | undefined, rowRestCol: number) {
  let clone: React.ReactElement = node

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    })
  }

  return clone
}
