import React from 'react'

export type TransferDataItem = {
  /**
   * 选项值，唯一 id
   */
  id: React.ReactText
  /**
   * 选项显示内容
   */
  title?: React.ReactNode
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
  /**
   * 选项分组
   */
  groupId?: React.ReactText
  /**
   * 选项分组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 选项分组选项列表
   */
  children?: TransferDataItem[]
  /**
   * 关联用户传入的原始数据对象
   */
  raw?: Record<string, any>
}

export type FlattedTransferDataItem = TransferDataItem & {
  children?: FlattedTransferDataItem[]
  raw: TransferDataItem
}
