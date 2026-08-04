import React from 'react'
import { PageHeader } from '@hi-ui/hiui'
import '@hiui-design/typical-page-shells/styles.css'
import {
  CancelButton,
  Form,
  ProEditPage,
  ProEditPageProvider,
  StashButton,
  SubmitButton,
  proEditPageShellStyles,
} from '@hiui-design/typical-page-shells/pro-edit-page'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import type { LegacyActionHandlers, LegacyActionSlot, LegacyPageSlots } from '../types'
import { noop, renderActions, resolveArray, resolveTitle, Root } from '../shared/core'
import { resolveFormFields } from '../shared/form'

export type FullPageEditPageProps = {
  slots: LegacyPageSlots<'full-page-edit'>
  actionHandlers?: LegacyActionHandlers
}

function normalizeFooterActions(value: unknown) {
  return resolveArray<Record<string, unknown>>(value).filter((action) => action.visible !== false)
}

function findFooterAction(actions: Array<Record<string, unknown>>, candidates: string[]) {
  return actions.find((action) => {
    const id = String(action.id || '').toLowerCase()
    const text = String(action.text || '').toLowerCase()
    return candidates.some((candidate) => id.includes(candidate) || text.includes(candidate))
  })
}

function callFooterAction(action: Record<string, unknown> | undefined, actionHandlers: LegacyActionHandlers, record?: Record<string, unknown>) {
  const handlerName = typeof action?.handler === 'string' ? action.handler : ''
  const handler = handlerName ? actionHandlers[handlerName] : undefined
  if (handler && action) handler({ action: action as LegacyActionSlot, record })
}

export function FullPageEditPage({ slots, actionHandlers = {} }: FullPageEditPageProps) {
  const pageSlots = slots as Record<string, unknown>
  const footerActions = normalizeFooterActions(pageSlots.footerActions)
  const submitAction = findFooterAction(footerActions, ['submit', 'save', 'confirm', '保存', '提交', '确认'])
  const stashAction = findFooterAction(footerActions, ['stash', 'draft', '暂存', '草稿'])
  const cancelAction = findFooterAction(footerActions, ['cancel', 'back', '取消', '返回'])
  const customActions = footerActions.filter((action) => action !== submitAction && action !== stashAction && action !== cancelAction)

  return (
    <Root pageType="full-page-edit">
      <ProEditPageProvider
        submitRequest={async (formData) => {
          callFooterAction(submitAction, actionHandlers, formData)
          return formData
        }}
        stashRequest={async (formData) => {
          callFooterAction(stashAction, actionHandlers, formData)
          return formData
        }}
      >
        <ProEditPage
          fields={resolveFormFields(pageSlots.formFields, pageSlots.validationRules)}
          onCancel={() => {
            callFooterAction(cancelAction, actionHandlers)
            noop()
          }}
        >
          <TypicalPageHeaderPortal>
            <PageHeader className="hiui-legacy-page-header" title={resolveTitle(slots)} extra={renderActions(pageSlots.headerExtra, actionHandlers)} />
          </TypicalPageHeaderPortal>
          <div data-hiui-legacy-region="form-body" className={proEditPageShellStyles.formScrollBody}>
            <Form column={2} initialValues={resolveArray<Record<string, unknown>>(pageSlots.mockData)[0]} />
          </div>
          <div data-hiui-legacy-region="footer" className={proEditPageShellStyles.inlineEditFooter}>
            <div data-hiui-legacy-region="footer-actions" className="hiui-legacy-actions">
              {stashAction ? <StashButton disabled={stashAction.disabled === true}>{String(stashAction.text || '暂存')}</StashButton> : null}
              <CancelButton disabled={cancelAction?.disabled === true}>{String(cancelAction?.text || '取消')}</CancelButton>
              {renderActions(customActions, actionHandlers)}
              <SubmitButton disabled={submitAction?.disabled === true}>{String(submitAction?.text || '保存')}</SubmitButton>
            </div>
          </div>
        </ProEditPage>
      </ProEditPageProvider>
    </Root>
  )
}

export default FullPageEditPage
