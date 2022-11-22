import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { EmptyState } from '@hi-ui/empty-state'
import { TableRow } from './TableRow'
import { TableRowRequiredProps } from './types'
import { useTableContext } from './context'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableBody
 */
export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix, emptyContent }, ref) => {
    const {
      columns,
      leafColumns,
      measureRowElementRef,
      isExpandTreeRows,
      transitionData,
      getColgroupProps,
      bodyTableRef,
      scrollBodyElementRef,
      onTableBodyScroll,
      maxHeight,
      canScroll,
      scrollWidth,
      hasAvgColumn,
      avgRow,
      hasSumColumn,
      sumRow,
      virtual,
    } = useTableContext()

    const cls = cx(`${prefixCls}-body`)

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

    // 是否使用虚拟滚动
    const showVirtual = virtual && isArrayNonEmpty(transitionData)
    if (showVirtual) {
      return (
        <div
          ref={scrollBodyElementRef}
          className={cls}
          onScroll={onTableBodyScroll}
          style={{
            maxHeight: maxHeight !== undefined ? maxHeight : undefined,
            // maxHeight 小于 table 实际高度才出现纵向滚动条
            overflowY:
              maxHeight !== undefined &&
              bodyTableRef.current &&
              bodyTableRef.current.clientHeight > maxHeight
                ? 'scroll'
                : undefined,
            // 表格宽度大于div宽度才出现横向滚动条
            overflowX: canScroll ? 'scroll' : undefined,
          }}
        >
          <div
            ref={measureRowElementRef}
            className="virtual-measure-width-holder"
            style={{ height: 1, background: 'blue' }}
          ></div>
          {transitionData.map((row, index) => {
            return (
              <TableRow
                // key={depth + index}
                key={row.id}
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
        </div>
      )
    }

    // 外层增加 div 作为滚动容器
    return (
      <div
        ref={scrollBodyElementRef}
        className={cls}
        onScroll={onTableBodyScroll}
        style={{
          maxHeight: maxHeight !== undefined ? maxHeight : undefined,
          // maxHeight 小于 table 实际高度才出现纵向滚动条
          overflowY:
            maxHeight !== undefined &&
            bodyTableRef.current &&
            bodyTableRef.current.clientHeight > maxHeight
              ? 'scroll'
              : undefined,
          // 表格宽度大于div宽度才出现横向滚动条
          overflowX: canScroll ? 'scroll' : undefined,
        }}
      >
        <table
          ref={bodyTableRef}
          style={{ width: canScroll && scrollWidth !== undefined ? scrollWidth : '100%' }}
        >
          <colgroup>
            {leafColumns.map((col: any, idx) => {
              return (
                <col key={idx} className={`${prefixCls}-col`} {...getColgroupProps(col, idx)} />
              )
            })}
          </colgroup>
          <tbody>
            {isArrayNonEmpty(transitionData) ? (
              <>
                {transitionData.map((row, index) => {
                  return (
                    <TableRow
                      ref={index === 0 ? measureRowElementRef : null}
                      // key={depth + index}
                      key={row.id}
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
                scrollBodyWidth: scrollBodyElementRef.current?.clientWidth,
              })
            )}
          </tbody>
        </table>
      </div>
    )
  }
)

export interface TableBodyProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   *  数据为空时的展示内容
   */
  emptyContent?: React.ReactNode
}

if (__DEV__) {
  TableBody.displayName = 'TableBody'
}

/**
 * 负责空状态渲染
 */
const renderEmptyContent = ({
  className,
  colSpan,
  emptyContent,
  scrollBodyWidth,
}: {
  colSpan?: number
  className?: string
  emptyContent: React.ReactNode
  scrollBodyWidth?: number
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
