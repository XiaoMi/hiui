import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { TablePageFrame } from '@hiui-design/typical-page-shells/pro-table-page'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'
import { renderListShell, resolveQueryFields, resolveTableColumns, resolveTableData, resolveTableFields } from '../shared/list'

export type TableBasicPageProps = {
  slots: LegacyPageSlots<'table-basic'>
  actionHandlers?: LegacyActionHandlers
}

export function TableBasicPage({ slots, actionHandlers = {} }: TableBasicPageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="table-basic">
      {renderListShell(
        pageSlots,
        <TablePageFrame
          title={resolveTitle(slots)}
          extra={renderActions(pageSlots.headerExtra, actionHandlers)}
          queryFields={resolveQueryFields(pageSlots)}
          tableFields={resolveTableFields(pageSlots, actionHandlers)}
          searchPlaceholder="请输入关键词"
          tableProps={{ data: resolveTableData(pageSlots), columns: resolveTableColumns(pageSlots, actionHandlers) }}
        />
      )}
    </Root>
  )
}

export default TableBasicPage
