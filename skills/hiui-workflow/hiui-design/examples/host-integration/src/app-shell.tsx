import React, { useMemo, useRef } from 'react'
import { TypicalPageHostBridge } from './components/layout/typical-page-host'
import {
  LayoutContentProvider,
  type LayoutContentContextValue,
} from './components/layout/layout-content-context'

const STANDALONE_CONTENT_VIEWPORT_GUTTER = 16

export function ExampleAppShell({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const titleTextRef = useRef(title)

  titleTextRef.current = title

  const ctxValue = useMemo<LayoutContentContextValue>(
    () => ({
      headerRef,
      footerRef,
      titleTextRef,
    }),
    [titleTextRef]
  )

  return (
    <LayoutContentProvider value={ctxValue}>
      <TypicalPageHostBridge>
        <div
          style={{
            height: '100vh',
            minHeight: '100vh',
            background: '#f5f8fc',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            data-hiui5-region="header"
            ref={headerRef}
            style={{
              flex: '0 0 auto',
              width: '100%',
              minWidth: 0,
              minHeight: 60,
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <div
            style={{
              flex: '1 1 0%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              paddingInline: STANDALONE_CONTENT_VIEWPORT_GUTTER,
            }}
          >
            <div
              style={{
                flex: '1 1 0%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {children}
            </div>
          </div>
          <div
            ref={footerRef}
            style={{
              flex: '0 0 auto',
            }}
          />
        </div>
      </TypicalPageHostBridge>
    </LayoutContentProvider>
  )
}
