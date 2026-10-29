import React from 'react'
import { TypicalPageHostProvider } from '../hiui-design-runtime/host'
import { HostPageFooterPortal } from './page-header-portal'

type TypicalPageHostBridgeProps = React.PropsWithChildren<{
  getOverlayContainer?: () => HTMLElement | null
}>

export function TypicalPageHostBridge({
  children,
  getOverlayContainer,
}: TypicalPageHostBridgeProps) {
  return (
    <TypicalPageHostProvider
      footerPortal={HostPageFooterPortal}
      getOverlayContainer={getOverlayContainer}
    >
      {children}
    </TypicalPageHostProvider>
  )
}
