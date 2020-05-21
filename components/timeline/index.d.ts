type DataItem = {
  title: string | JSX.Element
  content?: string | JSX.Element
  timestamp?: string
  extraTime?: string
  icon?: string | JSX.Element
}
type GroupItem = {
  groupTitle: string | JSX.Element
  children: DataItem[]
}
interface Props {
  type?: 'default' | 'right' | 'cross'
  data: DataItem[] | GroupItem[]
}
declare const Timeline: React.ComponentType<Props>
export default Timeline
