import React from 'react'
import { EmptyState, PageHeader } from '@hi-ui/hiui'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'

export type FeedbackStatusPageProps = {
  slots: LegacyPageSlots<'feedback-status'>
  actionHandlers?: LegacyActionHandlers
}

export function FeedbackStatusPage({ slots, actionHandlers = {} }: FeedbackStatusPageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="feedback-status">
      <div className="hiui-legacy-feedback-shell" data-hiui5-shell-carrier="FeedbackStatePanel">
        <div className="hiui-legacy-feedback-header" data-hiui-legacy-region="header">
          <PageHeader className="hiui-legacy-page-header" title={resolveTitle(slots)} extra={renderActions(pageSlots.headerExtra, actionHandlers)} />
        </div>
        <div className="hiui-legacy-feedback-white-body" data-hiui-legacy-region="white-body">
          <div className="hiui-legacy-feedback-panel" data-hiui-legacy-region="feedback-panel">
            <EmptyState title={(pageSlots.statusTitle as string) || '操作未完成'} size="md">
              <div>{(pageSlots.statusDescription as string) || '请补充业务状态说明。'}</div>
              {renderActions([pageSlots.primaryAction, pageSlots.secondaryAction].filter(Boolean), actionHandlers)}
            </EmptyState>
          </div>
        </div>
      </div>
    </Root>
  )
}

export default FeedbackStatusPage
