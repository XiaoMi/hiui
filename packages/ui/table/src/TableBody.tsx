import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import VirtualList from 'rc-virtual-list'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isArrayNonEmpty, isObject } from '@hi-ui/type-assertion'
import Scrollbar from '@hi-ui/scrollbar'
import { TableRow } from './TableRow'
import { TableRowRequiredProps } from './types'
import { useTableContext } from './context'
import { ColGroupContent } from './ColGroupContent'
import { TbodyContent, renderEmptyContent } from './TbodyContent'

const _role = 'table'
const _prefix = getPrefixCls(_role)

export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix, emptyContent }, ref) => {
    const {
      columns,
      isExpandTreeRows,
      transitionData,
      bodyTableRef,
      scrollBodyElementRef,
      onTableBodyScroll,
      onTableBodyScrollMock,
      maxHeight,
      canScroll,
      scrollWidth,
      colWidths,
      virtual,
      measureRowElementRef,
      scrollbar,
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
            overflowY: 'hidden',
          }}
        >
          <div
            ref={measureRowElementRef}
            style={{ height: 1, marginTop: -1, background: 'transparent' }}
          ></div>
          <div
            ref={bodyTableRef}
            style={{ height: 1, marginTop: -1, background: 'transparent', width: rowWidth }}
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
                    <div
                      className={`${prefixCls}-virtual-row`}
                      style={{ position: 'relative', left: -scrollLeft }}
                    >
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

    const bodyContent = (
      <table
        ref={bodyTableRef}
        style={{ width: canScroll && scrollWidth !== undefined ? scrollWidth : '100%' }}
      >
        <ColGroupContent />
        <TbodyContent />
      </table>
    )

    const scrollBodyProps = {
      ref: scrollBodyElementRef,
      className: cls,
      onScroll: onTableBodyScroll,
      style: {
        maxHeight,
      },
    }

    // 外层增加 div 作为滚动容器
    return !scrollbar ? (
      <div {...scrollBodyProps}>{bodyContent}</div>
    ) : (
      <Scrollbar {...scrollBodyProps} {...(isObject(scrollbar) ? scrollbar : null)}>
        {bodyContent}
      </Scrollbar>
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
