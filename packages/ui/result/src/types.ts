import { ValueOf } from 'packages/core/core/lib/types'
import React from 'react'

export interface ResultDataItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title: React.ReactNode
}

export const ResultTypeEnum = {
  info: 'info',
  success: 'success',
  warn: 'warn',
  error: 'error',
  operationSucceed: 'operation-succeed',
  operationFailed: 'operation-failed',
  processed: 'processed',
  netError: 'net-error',
  noContent: 'no-content',
  noComment: 'no-comment',
  noPermission: 'no-permission',
  noCollection: 'no-collection',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ResultTypeEnum = ValueOf<typeof ResultTypeEnum>
