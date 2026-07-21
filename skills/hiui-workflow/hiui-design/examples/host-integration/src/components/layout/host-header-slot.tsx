import React from 'react'
import * as HostShell from '@hiui-design/typical-page-shells/host'

type HostHeaderSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}

export function HostHeaderSlot({ children, style, ...restProps }: HostHeaderSlotProps) {
  const resolvedChildren = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<{ style?: React.CSSProperties }>,
        {
          style: {
            margin: 0,
            minWidth: 0,
            paddingBlock: 0,
            paddingBottom: 0,
            paddingTop: 0,
            width: '100%',
            ...(children.props?.style ?? {}),
          },
        }
      )
    : children

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
        {resolvedChildren}
      </div>
    </HostShell.TypicalPageHeaderPortal>
  )
}
