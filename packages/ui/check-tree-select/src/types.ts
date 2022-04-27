import { HiBaseDataItem } from '@hi-ui/core'
import React from 'react'

export interface CheckTreeSelectDataItem extends HiBaseDataItem {
  /**
   * 节点唯一 id
   */
  id?: React.ReactText
  /**
   * 节点标题
   */
  title?: React.ReactNode
  /**
   * 子级数据
   */
  children?: CheckTreeSelectDataItem[]
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
}

export interface FlattedCheckTreeSelectDataItem extends CheckTreeSelectDataItem {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedCheckTreeSelectDataItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: CheckTreeSelectDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedCheckTreeSelectDataItem
}

export interface CheckTreeSelectDataSource<T = any> {
  /**
   * 请求的 url
   */
  url?: string
  /**
   * 请求方法
   */
  type?: 'get' | 'post'
  /**
   * post 请求时请求体参数
   */
  data?: object
  /**
   * url 查询参数
   */
  params?: object
  /**
   * 请求头
   */
  headers?: object
  /**
   * 请求模式
   */
  mode?: 'same-origin' | 'cors' | 'no-cors' | 'navigate' | 'same-origin'
  /**
   * 成功时的回调，用于对数据进行预处理
   */
  transformResponse?: (response: object) => T
}

export type FilterOptionFunc = (keyword: string, item: CheckTreeSelectDataItem) => boolean
export type DataSourceFunc = (keyword: string) => CheckTreeSelectDataSource

export type FieldNames = {
  id?: string
  title?: string
  disabled?: string
  children?: string
}
