import React, { useCallback, useMemo } from 'react'
import { cx } from '@hi-ui/classname'
import { isFunction } from '@hi-ui/type-assertion'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheck } from '@hi-ui/use-check'
import { IconButton } from '@hi-ui/icon-button'
import { PlusSquareOutlined, MinusSquareOutlined } from '@hi-ui/icons'
import { defaultLoadingIcon } from '../icons'
import { TableColumnItem } from '../types'
import { useLatestCallback } from '@hi-ui/use-latest'

/**
 * 行内嵌面板展开
 */
export const useEmbedExpand = ({
  prefixCls,
  columns,
  rowExpandable,
  expandEmbedRowKeys: expandEmbedRowKeysProp,
  onEmbedExpand,
  expandedRender,
}: any) => {
  const [expandEmbedRows, trySetExpandEmbedRows] = useUncontrolledState(
    [],
    expandEmbedRowKeysProp,
    onEmbedExpand
  )

  const [onExpandEmbedRowsChange, isExpandEmbedRows] = useCheck({
    checkedIds: expandEmbedRows,
    onCheck: trySetExpandEmbedRows,
  })

  // 异步展开内嵌面板

  /**
   * 表格列展开折叠操作区
   */
  const getEmbedPanelColumn = useCallback(
    (embedExpandable: any) => {
      const renderSwitcher = ({
        prefixCls,
        rowExpand,
        expanded,
        onNodeExpand,
        expandIcon,
        collapseIcon,
      }: any) => {
        if (React.isValidElement(rowExpand)) {
          return rowExpand
        }

        if (rowExpand) {
          // @ts-ignore
          if (expanded === 'loading') {
            return (
              <IconButton
                className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
                icon={defaultLoadingIcon}
              />
            )
          } else {
            return (
              <IconButton
                tabIndex={-1}
                className={cx(
                  `${prefixCls}__switcher`,
                  expanded ? `${prefixCls}__switcher--expanded` : `${prefixCls}__switcher--collapse`
                )}
                icon={expanded ? expandIcon : collapseIcon}
                onClick={() => onNodeExpand(!expanded)}
              />
            )
          }
        }

        return null
      }

      const embedPanelColumn: TableColumnItem = {
        title: '',
        dataKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        width: 50,
        align: 'center',
        render: (_: any, rowItem: any, index: number) => {
          // const rowKey = getRowKey(rowItem, index)
          const rowKey = rowItem.id
          const rowExpand = isFunction(rowExpandable) ? rowExpandable(rowItem) : rowExpandable
          const expanded = isExpandEmbedRows(rowKey)

          const switcherIcon = renderSwitcher({
            prefixCls,
            rowExpand,
            expanded,
            onNodeExpand: (shouldExpanded: boolean) => {
              onExpandEmbedRowsChange(rowItem, shouldExpanded)
            },
            expandIcon: <MinusSquareOutlined />,
            collapseIcon: <PlusSquareOutlined />,
          })

          return switcherIcon
        },
      }

      return embedPanelColumn
    },
    [prefixCls, isExpandEmbedRows, onExpandEmbedRowsChange, rowExpandable]
  )

  const onEmbedExpandLatest = useLatestCallback(onEmbedExpand)
  const embedExpandable = useMemo(() => {
    if (!isFunction(expandedRender)) return false

    return {
      rowExpandable,
      expandEmbedRowKeys: expandEmbedRowKeysProp,
      onEmbedExpand: onEmbedExpandLatest,
      expandedRender,
    }
  }, [rowExpandable, expandEmbedRowKeysProp, onEmbedExpandLatest, expandedRender])

  const mergedColumns = React.useMemo(() => {
    if (embedExpandable) {
      const embedColumn = getEmbedPanelColumn(embedExpandable)
      return [embedColumn, ...columns]
    }

    return columns
  }, [embedExpandable, getEmbedPanelColumn, columns])

  return { mergedColumns, onExpandEmbedRowsChange, isExpandEmbedRows }
}
