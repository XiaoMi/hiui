import React from 'react'
import type { VirtualItem } from '@tanstack/react-virtual'

export type TableContainerContextValue = {
  headerRef: React.RefObject<HTMLDivElement>
  bodyRef: React.RefObject<HTMLDivElement>
  footerRef: React.RefObject<HTMLDivElement>
  colGroup: React.ReactElement
  /** 仅在开启虚拟化时存在，存储虚拟化相关数据 */
  virtualize?: {
    rows?: VirtualItem[]
    columns?: VirtualItem[]
    rowPadding?: {
      top: number
      bottom: number
    }
    colPadding?: {
      left: number
      right: number
    }
  }
}

export const TableContainerContext = React.createContext<TableContainerContextValue | null>(null)

export function useTableContainer() {
  const context = React.useContext(TableContainerContext)
  if (!context) {
    throw new Error('Table.* component must be rendered as child of Table component')
  }
  return context
}
