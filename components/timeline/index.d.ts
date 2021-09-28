import React from 'react'
export type TimelineItem = {
  title: string | JSX.Element
  content?: string | JSX.Element
  timestamp?: string
  extraTime?: string
  icon?: string | JSX.Element
}
export type TimelineGroupItem = {
  groupTitle: string | JSX.Element
  children: TimelineItem[]
}
export interface TimelineProps {
  type?: 'default' | 'right' | 'cross'
  data: TimelineItem[] | TimelineGroupItem[]
}
declare const Timeline: React.ComponentType<TimelineProps>
export default Timeline
