/* eslint-disable react-refresh/only-export-components */
import React from 'react'

export type LayoutContentContextValue = {
  headerNode: HTMLDivElement | null
  headerRef: React.RefObject<HTMLDivElement | null>
  footerNode: HTMLDivElement | null
  footerRef: React.RefObject<HTMLDivElement | null>
  titleText: string
  titleTextRef: React.RefObject<string>
}

const LayoutContentContext = React.createContext<LayoutContentContextValue | null>(null)

export function LayoutContentProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: LayoutContentContextValue }>) {
  return <LayoutContentContext.Provider value={value}>{children}</LayoutContentContext.Provider>
}

export function useLayoutContentContext() {
  const value = React.useContext(LayoutContentContext)

  if (!value) {
    throw new Error('useLayoutContentContext must be used within LayoutContentProvider')
  }

  return value
}
