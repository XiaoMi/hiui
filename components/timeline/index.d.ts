export type DataItem = {
  title: string | JSX.Element
  content?: string | JSX.Element
  timestamp?: string
  extraTime?: string
  icon?: string | JSX.Element
}
export type GroupItem = {
  groupTitle: string | JSX.Element
  children: DataItem[]
}
export interface Props {
  type?: 'default' | 'right' | 'cross'
  data: DataItem[] | GroupItem[]
}
declare const Timeline: React.ComponentType<Props>
export default Timeline
