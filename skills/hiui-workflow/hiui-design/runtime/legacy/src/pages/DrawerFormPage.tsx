import React from 'react'
import '@hiui-design/typical-page-shells/styles.css'
import { ProDrawerFooterActions, ProFormDrawer } from '@hiui-design/typical-page-shells/pro-form-drawer'
import type { LegacyActionHandlers, LegacyPageSlots } from '../types'
import { renderActions, resolveTitle, Root } from '../shared/core'
import { renderFormFields } from '../shared/form'

export type DrawerFormPageProps = {
  slots: LegacyPageSlots<'drawer-form'>
  actionHandlers?: LegacyActionHandlers
}

export function DrawerFormPage({ slots, actionHandlers = {} }: DrawerFormPageProps) {
  const pageSlots = slots as Record<string, unknown>

  return (
    <Root pageType="drawer-form">
      <ProFormDrawer
        title={resolveTitle(slots)}
        visible
        data-hiui-legacy-region="drawer-shell"
        footer={(
          <div data-hiui-legacy-region="drawer-footer">
            <ProDrawerFooterActions>
              <div data-hiui-legacy-region="footer-actions">
                {renderActions(pageSlots.footerActions, actionHandlers)}
              </div>
            </ProDrawerFooterActions>
          </div>
        )}
      >
        <div data-hiui-legacy-region="drawer-body">
          {renderFormFields(pageSlots.formFields)}
        </div>
      </ProFormDrawer>
    </Root>
  )
}

export default DrawerFormPage
