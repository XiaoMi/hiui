import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { StatListPageFrame } from '@hiui-design/typical-page-shells/pro-stat-page'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'
import { renderListShell, renderMetricSection, resolveQueryFields, resolveTableColumns, resolveTableData, resolveTableFields } from '../shared/list'

export type TableStatPageProps = {
  slots: LegacyPageSlots<'table-stat'>
  actionHandlers?: LegacyActionHandlers
}

export function TableStatPage({ slots, actionHandlers = {} }: TableStatPageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="table-stat">
      {renderListShell(
        pageSlots,
        <StatListPageFrame
          title={resolveTitle(slots)}
          extra={renderActions(pageSlots.headerExtra, actionHandlers)}
          queryFields={resolveQueryFields(pageSlots)}
          tableFields={resolveTableFields(pageSlots, actionHandlers)}
          searchPlaceholder="请输入关键词"
          statSection={renderMetricSection(pageSlots.statItems)}
          tableProps={{ data: resolveTableData(pageSlots), columns: resolveTableColumns(pageSlots, actionHandlers) }}
        />
      )}
    </Root>
  )
}

export default TableStatPage
