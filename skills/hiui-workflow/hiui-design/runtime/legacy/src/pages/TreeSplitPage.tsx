import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { TreeSplitPageFrame } from '@hiui-design/typical-page-shells/pro-tree-split-page'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'
import { renderListShell, renderTree, resolveQueryFields, resolveTableColumns, resolveTableData, resolveTableFields } from '../shared/list'

export type TreeSplitPageProps = {
  slots: LegacyPageSlots<'tree-split'>
  actionHandlers?: LegacyActionHandlers
}

export function TreeSplitPage({ slots, actionHandlers = {} }: TreeSplitPageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="tree-split">
      {renderListShell(
        pageSlots,
        <TreeSplitPageFrame
          title={resolveTitle(slots)}
          extra={renderActions(pageSlots.headerExtra, actionHandlers)}
          queryFields={resolveQueryFields(pageSlots)}
          tableFields={resolveTableFields(pageSlots, actionHandlers)}
          searchPlaceholder="请输入关键词"
          leftPane={renderTree(pageSlots.treeFields)}
          tableProps={{ data: resolveTableData(pageSlots), columns: resolveTableColumns(pageSlots, actionHandlers) }}
        />
      )}
    </Root>
  )
}

export default TreeSplitPage
