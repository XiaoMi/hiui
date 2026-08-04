import React from 'react'
import { PageHeader } from '@hi-ui/hiui'
import '@hiui-design/typical-page-shells/styles.css'
import { ProDetailPage, ProDetailPageProvider } from '@hiui-design/typical-page-shells/pro-detail-page'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveArray, resolveTitle, Root } from '../shared/core'
import { renderDetailFields, renderSupportingSections } from '../shared/detail'

export type FullPageDetailPageProps = {
  slots: LegacyPageSlots<'full-page-detail'>
  actionHandlers?: LegacyActionHandlers
}

export function FullPageDetailPage({ slots, actionHandlers = {} }: FullPageDetailPageProps) {
  const pageSlots = slots as Record<string, unknown>
  const detailData = resolveArray<Record<string, unknown>>(pageSlots.mockData)[0] || {}

  return (
    <Root pageType="full-page-detail">
      <ProDetailPageProvider request={async () => detailData}>
        <ProDetailPage>
          <TypicalPageHeaderPortal>
            <PageHeader className="hiui-legacy-page-header" title={resolveTitle(slots)} extra={renderActions(pageSlots.headerExtra, actionHandlers)} />
          </TypicalPageHeaderPortal>
          <div className="hiui-legacy-full-detail" data-hiui-legacy-region="white-body">
            <div className="hiui-legacy-detail-content">
              {renderDetailFields(pageSlots.detailFields, detailData)}
              {renderSupportingSections(pageSlots.supportingSections, detailData)}
            </div>
          </div>
        </ProDetailPage>
      </ProDetailPageProvider>
    </Root>
  )
}

export default FullPageDetailPage
