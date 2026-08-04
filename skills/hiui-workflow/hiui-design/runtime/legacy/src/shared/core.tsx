import React from 'react'
import { Button } from '@hi-ui/hiui'
import { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'
import type { LegacyActionHandlers, LegacyActionSlot, LegacyPageType } from '../types'
import { getLegacyPageSpec } from '../page-specs'
import '../styles.css'

export const noop = () => undefined

export function resolveArray<TValue>(value: unknown): TValue[] {
  return Array.isArray(value) ? (value as TValue[]) : []
}

function resolveActionHandler(action: Record<string, unknown>, actionHandlers: LegacyActionHandlers) {
  const handlerName = typeof action.handler === 'string' ? action.handler : ''
  return handlerName ? actionHandlers[handlerName] : undefined
}

function createActionClick(action: Record<string, unknown>, actionHandlers: LegacyActionHandlers, record?: Record<string, unknown>) {
  const handler = resolveActionHandler(action, actionHandlers)

  return () => {
    if (handler) {
      handler({ action: action as LegacyActionSlot, record })
      return
    }
    noop()
  }
}

export function renderRowActions(actions: unknown, actionHandlers: LegacyActionHandlers, record?: Record<string, unknown>) {
  const normalizedActions = resolveArray<Record<string, unknown>>(actions).filter((action) => action.visible !== false)
  if (normalizedActions.length === 0) return null

  return (
    <div className="hiui-legacy-actions" data-hiui-legacy-region="row-actions">
      {normalizedActions.map((action, index) => {
        const id = typeof action.id === 'string' && action.id ? action.id : `row-action-${index}`
        const text = typeof action.text === 'string' && action.text ? action.text : `操作${index + 1}`

        return (
          <Button
            key={id}
            type={action.kind === 'danger' ? 'danger' : 'primary'}
            appearance="link"
            disabled={action.disabled === true}
            data-hiui-legacy-action={id}
            onClick={createActionClick(action, actionHandlers, record)}
          >
            {text}
          </Button>
        )
      })}
    </div>
  )
}

export function resolveTitle(slots: { pageTitle?: string }) {
  return typeof slots.pageTitle === 'string' && slots.pageTitle.trim() ? slots.pageTitle : '未命名页面'
}

export function renderActions(value: unknown, actionHandlers: LegacyActionHandlers = {}) {
  const actions = resolveArray<Record<string, unknown>>(value).filter((action) => action.visible !== false)
  if (actions.length === 0) return null

  return (
    <div className="hiui-legacy-actions" data-hiui-legacy-region="actions">
      {actions.map((action, index) => {
        const kind = action.kind === 'primary' ? 'primary' : 'default'
        const text = typeof action.text === 'string' && action.text ? action.text : `操作${index + 1}`
        const id = typeof action.id === 'string' && action.id ? action.id : `action-${index}`

        return (
          <Button
            key={id}
            type={kind}
            appearance={kind === 'primary' ? undefined : 'line'}
            disabled={action.disabled === true}
            data-hiui-legacy-action={id}
            onClick={createActionClick(action, actionHandlers)}
          >
            {text}
          </Button>
        )
      })}
    </div>
  )
}

export function Root({ pageType, children }: { pageType: LegacyPageType; children: React.ReactNode }) {
  const spec = getLegacyPageSpec(pageType)

  return (
    <TypicalPageHostProvider
      headerPortal={({ children: headerChildren }) => (
        <div className="hiui-legacy-header-portal" data-hiui-legacy-region="header">
          {headerChildren}
        </div>
      )}
      footerPortal={({ children: footerChildren }) => (
        <div className="hiui-legacy-footer-portal" data-hiui-legacy-region="footer">
          {footerChildren}
        </div>
      )}
    >
      <div
        data-hiui-page-root="legacy-host-compatible"
        data-hiui-legacy-runtime="HiuiLegacyPage"
        data-hiui-legacy-page-type={pageType}
        data-hiui-legacy-slot-surface="typed-slots"
        data-hiui-legacy-shell={spec.shell}
        data-hiui-legacy-token-source={spec.visualTokens.tokenSource}
        data-hiui-legacy-region-order={spec.regionOrder.join(',')}
      >
        {children}
      </div>
    </TypicalPageHostProvider>
  )
}
