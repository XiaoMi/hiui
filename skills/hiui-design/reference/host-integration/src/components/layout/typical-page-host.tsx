import React from 'react'
import { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'
import { HostPageFooterPortal, HostPageHeaderPortal } from './page-header-portal'

export function TypicalPageHostBridge({ children }: React.PropsWithChildren) {
  return (
    <TypicalPageHostProvider
      headerPortal={HostPageHeaderPortal}
      footerPortal={HostPageFooterPortal}
    >
      {children}
    </TypicalPageHostProvider>
  )
}
