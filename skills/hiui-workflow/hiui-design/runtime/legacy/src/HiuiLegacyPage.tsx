import React from 'react'
import type { LegacyActionHandlers, LegacyPageSlots, LegacyPageType } from './types'
import { DrawerDetailPage } from './pages/DrawerDetailPage'
import { DrawerFormPage } from './pages/DrawerFormPage'
import { FeedbackStatusPage } from './pages/FeedbackStatusPage'
import { FullPageDetailPage } from './pages/FullPageDetailPage'
import { FullPageEditPage } from './pages/FullPageEditPage'
import { TableBasicPage } from './pages/TableBasicPage'
import { TableStatPage } from './pages/TableStatPage'
import { TreeSplitPage } from './pages/TreeSplitPage'
import { TreeTablePage } from './pages/TreeTablePage'

export type HiuiLegacyPageProps<TPageType extends LegacyPageType = LegacyPageType> = {
  pageType: TPageType
  slots: LegacyPageSlots<TPageType>
  actionHandlers?: LegacyActionHandlers
}

export function HiuiLegacyPage<TPageType extends LegacyPageType>({ pageType, slots, actionHandlers = {} }: HiuiLegacyPageProps<TPageType>) {
  if (pageType === 'table-stat') return <TableStatPage slots={slots as LegacyPageSlots<'table-stat'>} actionHandlers={actionHandlers} />
  if (pageType === 'table-basic') return <TableBasicPage slots={slots as LegacyPageSlots<'table-basic'>} actionHandlers={actionHandlers} />
  if (pageType === 'tree-table') return <TreeTablePage slots={slots as LegacyPageSlots<'tree-table'>} actionHandlers={actionHandlers} />
  if (pageType === 'tree-split') return <TreeSplitPage slots={slots as LegacyPageSlots<'tree-split'>} actionHandlers={actionHandlers} />
  if (pageType === 'drawer-form') return <DrawerFormPage slots={slots as LegacyPageSlots<'drawer-form'>} actionHandlers={actionHandlers} />
  if (pageType === 'drawer-detail') return <DrawerDetailPage slots={slots as LegacyPageSlots<'drawer-detail'>} actionHandlers={actionHandlers} />
  if (pageType === 'full-page-edit') return <FullPageEditPage slots={slots as LegacyPageSlots<'full-page-edit'>} actionHandlers={actionHandlers} />
  if (pageType === 'full-page-detail') return <FullPageDetailPage slots={slots as LegacyPageSlots<'full-page-detail'>} actionHandlers={actionHandlers} />
  return <FeedbackStatusPage slots={slots as LegacyPageSlots<'feedback-status'>} actionHandlers={actionHandlers} />
}

export default HiuiLegacyPage
