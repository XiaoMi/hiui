import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import VirtualList from 'rc-virtual-list'
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

export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix, emptyContent }, ref) => {
    const {
      columns,
      leafColumns,
      isExpandTreeRows,
      transitionData,
      getColgroupProps,
      bodyTableRef,
      scrollBodyElementRef,
      onTableBodyScroll,
      onTableBodyScrollMock,
      maxHeight,
      canScroll,
      scrollWidth,
      hasAvgColumn,
      avgRow,
      hasSumColumn,
      sumRow,
      colWidths,
      virtual,
      measureRowElementRef,
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

    const [scrollLeft, setScrollLeft] = useState(0)
    const rowWidth = useMemo(() => {
      let tmpWidth = 0
      colWidths.forEach((width) => (tmpWidth += width))
      return tmpWidth
    }, [colWidths])

    const onVirtualContainerScroll = useCallback(
      (evt: any) => {
        setScrollLeft(scrollBodyElementRef?.current?.scrollLeft || 0)
        onTableBodyScroll(evt)
      },
      [scrollBodyElementRef, onTableBodyScroll]
    )

    if (virtual) {
      // TODO： avg和summay row的逻辑

      const realHeight = scrollBodyElementRef.current?.getBoundingClientRect().height
      const vMaxHeight = maxHeight
        ? !isNaN(Number(String(maxHeight).replace(/px/, '')))
          ? Number(maxHeight)
          : realHeight
        : 300

      return (
        <div
          ref={scrollBodyElementRef}
          className={cls}
          onScroll={onVirtualContainerScroll}
          onWheel={onTableBodyScrollMock}
          style={{
            maxHeight: maxHeight !== undefined ? maxHeight : undefined,
            // 表格宽度大于div宽度才出现横向滚动条
            overflowX: canScroll ? 'scroll' : undefined,
          }}
        >
          <div ref={measureRowElementRef} style={{ height: 1, background: 'transparent' }}></div>
          <div
            ref={bodyTableRef}
            style={{ height: 1, background: 'transparent', width: rowWidth }}
          ></div>
          {isArrayNonEmpty(transitionData) ? (
            <div style={{ width: '100%', position: 'sticky', left: 0 }}>
              <VirtualList
                data={transitionData}
                height={vMaxHeight}
                itemHeight={10}
                itemKey="id"
                children={(row, index) => {
                  return (
                    <div style={{ position: 'relative', left: -scrollLeft }}>
                      <TableRow
                        // key={depth + index}
                        key={row.id}
                        // @ts-ignore
                        rowIndex={index}
                        rowData={row}
                        // expandedTree={isExpandTreeRows(row.id)}
                        {...getRequiredProps(row.id)}
                      />
                    </div>
                  )
                }}
              />
            </div>
          ) : (
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
