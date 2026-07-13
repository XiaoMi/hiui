import React from 'react'
import * as HostShell from '@hiui-design/typical-page-shells/host'

type HostHeaderSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}

export function HostHeaderSlot({ children, style, ...restProps }: HostHeaderSlotProps) {
  return (
    <HostShell.TypicalPageHeaderPortal>
      <div
        {...restProps}
        style={{
          height: 60,
          minHeight: 60,
          alignItems: 'center',
          display: 'flex',
          width: '100%',
          ...style,
        }}
      >
        {children}
      </div>
    </HostShell.TypicalPageHeaderPortal>
  )
}
