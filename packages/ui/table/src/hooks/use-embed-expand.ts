import React, { useCallback, useMemo } from 'react'
import { isFunction, isPromise } from '@hi-ui/type-assertion'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheck } from '@hi-ui/use-check'
import { useCheckState } from '@hi-ui/use-check-state'
import { TableColumnItem, FlattedTableRowData } from './../types'

const DEFAULT_EXPAND_EMBED_ROW_KEYS = [] as []

/**
 * 行内嵌面板展开
 */
export const useEmbedExpand = ({
  rowExpandable = true,
  defaultExpandEmbedRowKeys = DEFAULT_EXPAND_EMBED_ROW_KEYS,
  expandEmbedRowKeys: expandEmbedRowKeysProp,
  onEmbedExpand,
  expandedRender,
}: UseEmbedExpandProps) => {
  /**
   * 收敛行内嵌面板配置开关
   */
  const embedExpandable = useMemo(() => {
    if (!rowExpandable) return false
    // 不传入 render 方法，则不开启内嵌面板
    if (!isFunction(expandedRender)) return false

    return {
      rowExpandable,
      expandedRender,
    }
  }, [rowExpandable, expandedRender])

  /**
   * 是否展开状态控制
   */
  const [expandEmbedRows, trySetExpandEmbedRows] = useUncontrolledState(
    defaultExpandEmbedRowKeys,
    expandEmbedRowKeysProp,
    onEmbedExpand
  )

  const [onExpandEmbedRowsChange, isExpandEmbedRows] = useCheck({
    checkedIds: expandEmbedRows,
    onCheck: trySetExpandEmbedRows,
  })

  /**
   * 异步展开中状态控制
   */
  const { add: addLoadingIds, remove: removeLoadingIds, has: isLoadingId } = useCheckState<
    React.ReactText
  >()

  /**
   * 内嵌面板数据
   * 结构：{ [id]: 内嵌数据 }
   */
  const [embedPanelRecord, setEmbedPanelRecord] = React.useState<Record<React.ReactText, any>>({})

  const getEmbedPanelById = useCallback(
    (id: React.ReactText) => {
      return embedPanelRecord[id] || null
    },
    [embedPanelRecord]
  )

  /**
   * 异步展开逻辑处理
   */
  const onEmbedSwitch = useCallback(
    async (node: FlattedTableRowData, rowIndex: number) => {
      if (!embedExpandable) return

      const embedContentMaybePromise = embedExpandable.expandedRender(node.raw, rowIndex)

      // TODO： 复用 use-dataSource 逻辑
      if (isPromise(embedContentMaybePromise)) {
        addLoadingIds(node.id)

        embedContentMaybePromise
          .then((jsxElement: any) => {
            removeLoadingIds(node.id)

            if (typeof jsxElement === 'undefined') return

            setEmbedPanelRecord((prev) => {
              return {
                ...prev,
                [node.id]: jsxElement,
              }
            })
          })
          .catch((jsxElement: any) => {
            removeLoadingIds(node.id)

            if (typeof jsxElement === 'undefined') return

            setEmbedPanelRecord((prev) => {
              return {
                ...prev,
                [node.id]: jsxElement,
              }
            })
          })
      } else {
        if (typeof embedContentMaybePromise === 'undefined') return

        setEmbedPanelRecord((prev) => {
          return {
            ...prev,
            [node.id]: embedContentMaybePromise,
          }
        })
      }
    },
    [embedExpandable, addLoadingIds, removeLoadingIds]
  )

  return {
    embedExpandable,
    onEmbedSwitch,
    getEmbedPanelById,
    isEmbedLoadingId: isLoadingId,
    isExpandEmbedRows,
    onExpandEmbedRowsChange,
  }
}

export interface UseEmbedExpandProps {
  /**
   *  内嵌式表格展开的行（受控）
   */
  expandEmbedRowKeys?: React.ReactText[]
  /**
   *  内嵌式表格默认展开的行
   */
  defaultExpandEmbedRowKeys?: React.ReactText[]
  /**
   *  内嵌式表格展开时的回调函数
   */
  onEmbedExpand?: (
    expandedIds: React.ReactText[],
    targetRow: Record<string, any>,
    shouldExpanded: boolean
  ) => void
  /**
   *  表格展开项
   */
  expandedRender?: (
    row: Record<string, any>,
    index: number
  ) => React.ReactNode | Promise<React.ReactNode | void>
  /**
   *  设置是否允许行展开
   */
  rowExpandable?: boolean | ((row: TableColumnItem) => React.ReactNode | boolean)
}

export type UseEmbedExpandReturn = ReturnType<typeof useEmbedExpand>
