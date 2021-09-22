type DataItem = {
  title: string | JSX.Element
  content?: string | JSX.Element
  icon?: string | JSX.Element
}
interface Props {
  data: DataItem[]
  current?: number
  placement?: 'vertical' | 'horizontal'
  itemLayout?: 'vertical' | 'horizontal'
  onChange?: (current: number) => void
}
declare const Stepper: React.ComponentType<Props>
export default Stepper
