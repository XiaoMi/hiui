import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cloneElement, toArray } from './util'
import { Row } from './Row'
import {
  DescriptionsAppearanceEnum,
  DescriptionsLabelPlacementEnum,
  DescriptionsPlacementEnum,
} from './types'
import { DescriptionsItem, DescriptionsItemProps } from './DescriptionsItem'

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
      data,
      column = 3,
      placement = 'horizontal',
      appearance = 'unset',
      labelPlacement = 'left',
      labelWidth,
      ...rest
    },
    ref
  ) => {
    const noBackground = appearance === 'unset' && labelPlacement === 'right'
    const vertical = placement === 'vertical'
    const bordered = appearance === 'table' || noBackground

    // 如果配置了data，则使用配置模式渲染，否则取 children
    const computeChildren = data ? computeItems(data) : children
    const rows = computeRows(computeChildren, column)

    const cls = cx(
      prefixCls,
      appearance && `${prefixCls}--appearance-${appearance}`,
      placement && `${prefixCls}--placement-${placement}`,
      labelPlacement && `${prefixCls}--label-placement-${labelPlacement}`,
      className
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <table className={`${prefixCls}__table`}>
          <tbody className={`${prefixCls}__tbody`}>
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
   * 对齐方式，默认'horizontal'
   */
  placement?: DescriptionsPlacementEnum
  /**
   * 描述样式，分为table样式和unset
   */
  appearance?: DescriptionsAppearanceEnum
  /**
   * 列数，表示一行包含DescriptionItems的数量
   */
  column?: number
  /**
   * 提供JS配置化的方式渲染单元模块
   */
  data?: DescriptionsItemProps[]
  /**
   * label对齐方式
   */
  labelPlacement?: DescriptionsLabelPlacementEnum
  /**
   * label宽度
   */
  labelWidth?: React.ReactText
}

if (__DEV__) {
  Descriptions.displayName = 'Descriptions'
}

function computeItems(data?: DescriptionsItemProps[]) {
  return data?.filter(Boolean)?.map(({ children, ...otherItem }, index) => (
    <DescriptionsItem {...otherItem} key={index}>
      {otherItem.value}
    </DescriptionsItem>
  ))
}

function computeRows(children: React.ReactNode, column: number) {
  if (!Array.isArray(children)) return []

  const childrenNodes = toArray(children).filter(Boolean)

  const rows: React.ReactElement[][] = []

  let rowItems: React.ReactElement[] = []
  let rowRestCol = column
  let nextColumn = column

  // 根据 column 计算生成二维表格展示
  childrenNodes.forEach((node: React.ReactElement, index: number) => {
    let colSpan = getColSpan(node)
    const rowSpan = node?.props?.rowSpan ?? 1

    if (rowSpan > 1) {
      nextColumn -= colSpan
    }

    if (colSpan < 1) {
      invariant(false, 'The colSpan should be a positive integer in Descriptions component.')
      colSpan = 1
    }

    if (index === childrenNodes.length - 1) {
      rowItems.push(computeFilledItem(node, undefined, rowRestCol))
      rows.push(rowItems)
      return
    }

    if (colSpan < rowRestCol) {
      rowRestCol -= colSpan
      rowItems.push(node)
    } else {
      rowItems.push(computeFilledItem(node, colSpan, rowRestCol))
      rows.push(rowItems)
      rowRestCol = nextColumn
      nextColumn = column
      rowItems = []
    }
  })
  return rows
}

function computeFilledItem(
  node: React.ReactElement,
  colSpan: number | undefined,
  rowRestCol: number
) {
  let clone: React.ReactElement = node

  if (colSpan === undefined || colSpan > rowRestCol) {
    clone = cloneElement(node, {
      colSpan: rowRestCol,
    })
  }

  return clone
}

const getColSpan = (node: React.ReactElement) => {
  const span = node?.props?.span
  let colSpan = node?.props?.colSpan

  if (typeof span === 'number') {
    if (typeof colSpan !== 'number') {
      colSpan = span
    }

    invariant(false, 'Please use `colSpan` prop instead of `span` in Descriptions.')
  }

  return colSpan ?? 1
}
