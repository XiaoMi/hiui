import React, { useMemo, useRef, useImperativeHandle } from 'react'
import VirtualList, { ListRef } from 'rc-virtual-list'
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

export const TableBody = ({ prefixCls = _prefix, emptyContent }: TableBodyProps) => {
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
    scrollLeft,
    innerRef,
    rowClassName,
    stretchHeight,
  } = useTableContext()
  const virtualListRef = useRef(null)
  const listRef = useRef<ListRef>(null)

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

  const rowWidth = useMemo(() => {
    let tmpWidth = 0
    colWidths.forEach((width) => (tmpWidth += width))
    return tmpWidth
  }, [colWidths])

  useImperativeHandle(innerRef, () => ({
    scrollTo: listRef.current?.scrollTo,
  }))

  const [virtualListHeight, setVirtualListHeight] = React.useState(300)

  React.useEffect(() => {
    const virtualListWrapper = scrollBodyElementRef.current
    if (!virtualListWrapper) return
    const newHeight = virtualListWrapper.clientHeight
    setVirtualListHeight(newHeight)

    // 虚拟列表且开启拉伸高度时，监听虚拟列表高度变化
    if (virtual && stretchHeight) {
      const observer = new ResizeObserver(() => {
        const newHeight = virtualListWrapper.clientHeight

        // 只在高度真正变化时才更新状态，避免循环
        setVirtualListHeight((prevHeight) => {
          // 添加一个小的阈值（如1px）来避免浮点数精度问题导致的循环
          if (Math.abs(prevHeight - newHeight) > 1) {
            return newHeight
          }
          return prevHeight
        })
      })

      observer.observe(virtualListWrapper)

      return () => {
        observer.disconnect()
      }
    }
  }, [scrollBodyElementRef, stretchHeight, virtual])

  if (virtual) {
    // TODO： avg和summay row的逻辑
    const maxHeightNumStr = String(maxHeight).replace(/px$/, '')
    const vMaxHeight = maxHeight
      ? !isNaN(Number(maxHeightNumStr))
        ? Number(maxHeightNumStr)
        : virtualListHeight
      : virtualListHeight

    return (
      <div
        ref={scrollBodyElementRef}
        className={cls}
        onScroll={onTableBodyScroll}
        onWheel={onTableBodyScrollMock}
        style={{
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
          style={{ height: 2, marginTop: -1, background: 'transparent', width: rowWidth }}
        ></div>
        {isArrayNonEmpty(transitionData) ? (
          <div
            ref={virtualListRef}
            style={{ width: '100%', position: 'sticky', left: 0, maxHeight }}
          >
            <VirtualList
              ref={listRef}
              prefixCls={`${cls}--virtual`}
              data={transitionData}
              height={vMaxHeight}
              fullHeight={false}
              itemHeight={10}
              itemKey="id"
              onVisibleChange={(...args) => {
                isObject(virtual) &&
                  typeof virtual?.onVisibleChange === 'function' &&
                  virtual?.onVisibleChange(...args)
              }}
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
                      className={rowClassName?.(row, index)}
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
      <TbodyContent emptyContent={emptyContent} />
    </table>
  )

  const scrollBodyProps = {
    ref: scrollBodyElementRef,
    onScroll: onTableBodyScroll,
    style: {
      maxHeight,
    },
  }

  return !scrollbar ? (
    <div className={cls} {...scrollBodyProps}>
      {bodyContent}
    </div>
  ) : (
    <div className={cls}>
      <Scrollbar {...scrollBodyProps} {...(isObject(scrollbar) ? scrollbar : null)}>
        {bodyContent}
      </Scrollbar>
    </div>
  )
}

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
