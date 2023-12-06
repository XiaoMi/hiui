import React, { forwardRef } from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { EmptyState } from '@hi-ui/empty-state'
import { TableRow } from './TableRow'
import { TableRowRequiredProps } from './types'
import { useTableContext } from './context'

const _prefix = getPrefixCls('table-body')

export const TbodyContent = forwardRef<HTMLDivElement | null, TbodyContentProps>(
  ({ prefixCls = _prefix, emptyContent }, ref) => {
    const {
      columns,
      isExpandTreeRows,
      transitionData,
      scrollBodyElementRef,
      hasAvgColumn,
      avgRow,
      hasSumColumn,
      sumRow,
      measureRowElementRef,
      rowClassName,
    } = useTableContext()

    const getRequiredProps = useLatestCallback(
      (id: React.ReactText): TableRowRequiredProps => {
        return {
          // @ts-ignore
          expandedTree: isExpandTreeRows(id),
          // checked: isCheckedId(id),
          // semiChecked: isSemiCheckedId(id),
          // selected: selectedId === id,
          // loading: isLoadingId(id),
          // focused: focusedId === id,
        }
      }
    )

    // 外层增加 div 作为滚动容器
    return (
      <tbody>
        {isArrayNonEmpty(transitionData) ? (
          <>
            {transitionData.map((row, index) => {
              return (
                <TableRow
                  ref={index === 0 ? measureRowElementRef : null}
                  // key={depth + index}
                  key={row.id}
                  className={rowClassName?.(row, index)}
                  // @ts-ignore
                  rowIndex={index}
                  rowData={row}
                  // expandedTree={isExpandTreeRows(row.id)}
                  {...getRequiredProps(row.id)}
                />
              )
            })}
            {hasSumColumn ? (
              <TableRow
                key={sumRow.id}
                rowIndex={transitionData.length}
                rowData={sumRow as any}
                isSumRow
              />
            ) : null}
            {hasAvgColumn ? (
              <TableRow
                key={avgRow.id}
                rowIndex={transitionData.length + 1}
                rowData={avgRow as any}
                isAvgRow
              />
            ) : null}
          </>
        ) : (
          // 空状态，colSpan 占满表格整行
          renderEmptyContent({
            className: `${prefixCls}-empty-content`,
            colSpan: columns.length,
            emptyContent,
            ...(scrollBodyElementRef.current
              ? {
                  scrollBodyWidth: window
                    .getComputedStyle(scrollBodyElementRef.current)
                    .getPropertyValue('width'),
                }
              : {}),
          })
        )}
      </tbody>
    )
  }
)

export interface TbodyContentProps extends HiBaseHTMLProps<'div'> {
  /**
   *  数据为空时的展示内容
   */
  emptyContent?: React.ReactNode
}

if (__DEV__) {
  TbodyContent.displayName = 'TbodyContent'
}

/**
 * 负责空状态渲染
 */
export const renderEmptyContent = ({
  className,
  colSpan,
  emptyContent,
  scrollBodyWidth,
}: {
  colSpan?: number
  className?: string
  emptyContent: React.ReactNode
  scrollBodyWidth?: number | string
}) => {
  return (
    <tr className={className}>
      <td colSpan={colSpan}>
        <div
          style={{
            position: 'sticky',
            left: 0,
            width: scrollBodyWidth ?? '100%',
            overflow: 'hidden',
          }}
        >
          {emptyContent || <EmptyState />}
        </div>
      </td>
    </tr>
  )
}
