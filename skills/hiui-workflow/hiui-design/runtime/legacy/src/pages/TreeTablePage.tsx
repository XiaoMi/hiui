import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { TablePageFrame } from '@hiui-design/typical-page-shells/pro-table-page'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'
import { renderListShell, resolveQueryFields, resolveTableColumns, resolveTableData, resolveTreeTableFields } from '../shared/list'

export type TreeTablePageProps = {
  slots: LegacyPageSlots<'tree-table'>
  actionHandlers?: LegacyActionHandlers
}

export function TreeTablePage({ slots, actionHandlers = {} }: TreeTablePageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="tree-table">
      {renderListShell(
        pageSlots,
        <TablePageFrame
          title={resolveTitle(slots)}
          extra={renderActions(pageSlots.headerExtra, actionHandlers)}
          queryFields={resolveQueryFields(pageSlots)}
          tableFields={resolveTreeTableFields(pageSlots, actionHandlers)}
          searchPlaceholder="请输入关键词"
          tableProps={{ data: resolveTableData(pageSlots), columns: resolveTableColumns(pageSlots, actionHandlers) }}
        />
      )}
    </Root>
  )
}

export default TreeTablePage
