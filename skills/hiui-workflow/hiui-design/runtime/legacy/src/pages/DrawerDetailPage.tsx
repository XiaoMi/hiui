import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { ProDetailDrawer, ProDetailDrawerBody } from '@hiui-design/typical-page-shells/pro-detail-drawer'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveArray, resolveTitle, Root } from '../shared/core'
import { renderDetailFields } from '../shared/detail'

export type DrawerDetailPageProps = {
  slots: LegacyPageSlots<'drawer-detail'>
  actionHandlers?: LegacyActionHandlers
}

export function DrawerDetailPage({ slots, actionHandlers = {} }: DrawerDetailPageProps) {
  const pageSlots = slots as Record<string, unknown>
  const detailData = resolveArray<Record<string, unknown>>(pageSlots.mockData)[0] || {}

  return (
    <Root pageType="drawer-detail">
      <ProDetailDrawer
        title={resolveTitle(slots)}
        visible
        data-hiui-legacy-region="drawer-shell"
        footer={(
          <div data-hiui-legacy-region="drawer-footer">
            {renderActions(pageSlots.footerActions, actionHandlers)}
          </div>
        )}
      >
        <div data-hiui-legacy-region="drawer-body">
          <ProDetailDrawerBody>
            {renderDetailFields(pageSlots.detailFields, detailData)}
          </ProDetailDrawerBody>
        </div>
      </ProDetailDrawer>
    </Root>
  )
}

export default DrawerDetailPage
