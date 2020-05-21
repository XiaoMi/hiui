interface Props {
  accordion?: boolean
  activeId?: string | string[]
  arrowPlacement?: 'left' | 'right'
  showArrow?: boolean
  onChange?: () => void
  children: Collapse.Panel
}
interface PanelProps {
  id?: string
  title?: string | JSX.Element
  disabled?: boolean
}
declare class Panel extends React.Component<PanelProps, any> {
}
declare class Collapse extends React.Component<Props, any> {
  static Panel = Panel
}
export default Collapse
