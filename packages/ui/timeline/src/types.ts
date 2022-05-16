import { HiBaseDataItem } from '@hi-ui/core'
import React from 'react'

export interface TimelineDataItem extends HiBaseDataItem {
  /**
   * 节点标题
   */
  title: React.ReactNode
  /**
   * 节点内容信息
   */
  content?: React.ReactNode
  /**
   * 时间点
   */
  timestamp?: string
  /**
   * 额外展示时间点
   */
  extraTime?: string
  /**
   * 自定义图标
   */
  icon?: React.ReactNode
  /**
   * 子项配置
   */
  children?: TimelineDataItem[]
}

export interface TimelineGroupDataItem extends HiBaseDataItem {
  /**
   * 分组标题
   */
  groupTitle: React.ReactNode
  /**
   * 标题下集合列表
   */
  children: TimelineDataItem[]
}

export type TimelineMergedItem = TimelineDataItem | TimelineGroupDataItem
