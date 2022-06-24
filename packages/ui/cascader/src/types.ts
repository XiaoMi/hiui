import React from 'react'

export interface CascaderDataItem extends Record<string, any> {
  /**
   * 选择项值，唯一 id
   */
  id?: React.ReactText
  /**
   * 选项标题
   */
  title?: React.ReactNode
  /**
   * 下一级选项列表
   */
  children?: CascaderDataItem[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用）
   */
  disabled?: boolean
}

// TODO: ts 类型工具函数 将指定属性转为非可选属性
export interface FlattedCascaderDataItemWithChildren extends FlattedCascaderDataItem {
  children: FlattedCascaderDataItem[]
}

export interface FlattedCascaderDataItem extends Required<Omit<CascaderDataItem, 'children'>> {
  /**
   * 选择项值，唯一 id
   */
  id: React.ReactText
  /**
   * 选项标题
   */
  title: React.ReactNode
  /**
   * 下一级选项列表
   */
  children?: FlattedCascaderDataItem[]
  /**
   * 关联用户传入的原始数据对象
   */
  raw: CascaderDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent: FlattedCascaderDataItemWithChildren
}

export interface CascaderItemRequiredProps {
  selected: boolean
  loading: boolean
  focused: boolean
  active: boolean
}

export interface CascaderItemEventData extends FlattedCascaderDataItem, CascaderItemRequiredProps {}

export type CascaderExpandTriggerEnum = 'click' | 'hover'
