interface Props {
  title: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  visible?: boolean
}
type Options = {
  title: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  key: string
}
const OpenFun: (target: HTMLElement, options: Options) => void
const CloseFun: (key: string) => void
declare class Tooltip extends React.Component<Props, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Tooltip

