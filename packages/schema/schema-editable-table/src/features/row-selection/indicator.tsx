import React, { useRef } from 'react'
import Space from '@hi-ui/space'
import Switch from '@hi-ui/switch'
import { getPaginationRowModel } from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'
// import { useSubscribe } from '@hi-ui/use-subscription'
import { useEditableSchemaTableCtx } from '../../ctx'
import { cls } from '../../utils'

export type RowSelectionIndicatorOpts = {
  /** 开启仅显示已选功能 */
  enableOnlyShowSelected?: boolean
  /** 格式化已选数量 */
  formatter?: (selectedCount: number) => React.ReactNode
}

const dftFormatter = (selectedCount: number) => `已选 ${selectedCount} 项`

export function RowSelectionIndicator() {
  const { table, propsRef } = useEditableSchemaTableCtx()

  // 经过性能优化，已移除额外订阅
  // 此时保留，反而会导致本组件重复重渲染
  // 保留此处注释，用以后续调整
  // const { rowSelectionState } = useEditableSchemaTableCtx()
  // useSubscribe(rowSelectionState)
  const selectedCount = table.$getRowSelection().selectedRowKeys.length

  const { enableIndicator = {} } = propsRef.current.rowSelection || {}
  const { formatter = dftFormatter, enableOnlyShowSelected } = enableIndicator

  return (
    <div className={cls('row-selection-indicator')}>
      <Space
        wrap={false}
        style={{ whiteSpace: 'nowrap' }}
        separator={
          enableOnlyShowSelected ? <span style={{ color: 'rgba(0, 0, 0, 0.06)' }}>|</span> : null
        }
      >
        <span>{formatter(selectedCount)}</span>

        {enableOnlyShowSelected ? <OnlyShowSelected selectedCount={selectedCount} /> : null}
      </Space>
    </div>
  )
}

function OnlyShowSelected({ selectedCount }: { selectedCount: number }) {
  const { table, subscription, setDynamicOpts } = useEditableSchemaTableCtx()

  const checkedRef = useRef(false)
  // 如果未选中行，且未开启开关，则禁用
  const disabled = selectedCount === 0 && !checkedRef.current

  const prePaginationState = useRef<PaginationState>()
  return (
    <span>
      <Switch
        disabled={disabled}
        content={['开', '关']}
        onChange={(checked) => {
          checkedRef.current = checked

          if (checked) {
            const keys = table.$getRowSelection().selectedRowKeys
            const rowDataList: AnyObject[] = []
            for (const rowId of keys) {
              const data = table.$getRealtimeRowData(rowId) || table.$selectedRowsCache.get(rowId)
              if (data) rowDataList.push(data)
            }
            // 先静默更新内部订阅
            subscription.setValue(rowDataList, { silent: true })

            // 再更新分页状态
            table.setPagination((state) => {
              // 暂存分页状态
              prePaginationState.current = state
              const rowCount = rowDataList.length
              return { ...state, pageIndex: 0, rowCount, $fromCustom: true }
            })
            // 最后换成前端分页
            setDynamicOpts({
              manualPagination: false,
              getPaginationRowModel: getPaginationRowModel(),
            })
          } else {
            // 先恢复内部订阅
            subscription.setValue(subscription.getPrevValue(), { silent: true })

            // 再恢复分页状态
            table.setPagination((state) => {
              const preState = prePaginationState.current as typeof state
              // 清空暂存的分页状态
              prePaginationState.current = undefined
              return { ...preState, $fromCustom: false }
            })
            // 最后恢复成后端分页
            setDynamicOpts({
              manualPagination: true,
              getPaginationRowModel: undefined,
            })
          }
        }}
      />

      <span style={{ position: 'relative', top: 1, marginLeft: 8, userSelect: 'none' }}>
        仅显示已选
      </span>
    </span>
  )
}
