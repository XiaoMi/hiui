import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import {
  ManagedPageHeader,
  ManagedWhiteBodyWorkspace,
} from './data-visualization-primitives'

const sharedStyles = {
  dashboardPageRoot: {
    boxSizing: 'border-box',
    display: 'grid',
    gap: 0,
    inlineSize: '100%',
    minBlockSize: '100%',
    minInlineSize: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInline: 0,
  } as CSSProperties,
  flatPageRoot: {
    boxSizing: 'border-box',
    display: 'grid',
    gap: 0,
    inlineSize: '100%',
    minBlockSize: '100%',
    minInlineSize: 0,
    paddingBlock: 0,
    paddingInline: 0,
  } as CSSProperties,
}

type SharedDivProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'>

export function FixedDashboardPageFrame({
  children,
  extra,
  onBack,
  pageRootProps,
  title,
  whiteBodyProps,
}: {
  children: ReactNode
  extra?: ReactNode
  onBack?: () => void
  pageRootProps?: SharedDivProps
  title: ReactNode
  whiteBodyProps?: SharedDivProps
}) {
  return (
    <div
      {...pageRootProps}
      style={sharedStyles.dashboardPageRoot}
    >
      <ManagedPageHeader extra={extra} onBack={onBack} title={title} />
      <ManagedWhiteBodyWorkspace
        {...whiteBodyProps}
      >
        {children}
      </ManagedWhiteBodyWorkspace>
    </div>
  )
}

export function ManagedWorkbenchPageFrame({
  children,
  extra,
  onBack,
  pageRootProps,
  title,
  whiteBodyProps,
}: {
  children: ReactNode
  extra?: ReactNode
  onBack?: () => void
  pageRootProps?: SharedDivProps
  title: ReactNode
  whiteBodyProps?: SharedDivProps
}) {
  return (
    <div
      {...pageRootProps}
      style={sharedStyles.flatPageRoot}
    >
      <ManagedPageHeader extra={extra} onBack={onBack} title={title} />
      <ManagedWhiteBodyWorkspace
        {...whiteBodyProps}
      >
        {children}
      </ManagedWhiteBodyWorkspace>
    </div>
  )
}
