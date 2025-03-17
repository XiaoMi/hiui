import React, { createContext, useContext } from 'react'
import { TransferDataItem } from './types'

interface TransferContext {
  showCheckAll: boolean
  searchable: boolean
  keyword: {
    left?: string
    right?: string
  }
  onSearch: (keyword: string, direction: 'left' | 'right') => void
  pageSize?: number
  disabled: any
  type: any
  onItemClick?: any
  onItemKeydown?: any
  titleRender: any
  /**
   * 拖拽开始时的回调函数
   */
  onDragStart?: (evt: React.DragEvent, option: { dragNode: TransferDataItem }) => void
  /**
   * 拖拽结束时的回调函数(完成拖拽)
   */
  onDragEnd?: (evt: React.DragEvent, option: { dragNode: TransferDataItem }) => void
  /**
   * 放开拖拽元素时的回调函数，返回 false 将阻止拖拽到对应位置
   */
  onDrop?: (
    evt: React.DragEvent,
    sourceItem: React.ReactText,
    targetItem: React.ReactText,
    direction: string | null
  ) => void
  onDragLeave?: (evt: React.DragEvent, option: { dropNode: TransferDataItem }) => void
  onDragOver?: (evt: React.DragEvent, option: { dropNode: TransferDataItem }) => void
}

const transferContext = createContext<TransferContext | null>(null)

export const TransferProvider = transferContext.Provider

export const useTransferContext = () => {
  const context = useContext(transferContext)

  if (!context) {
    throw new Error('The TransferContext context is not defined.')
  }

  return context
}
