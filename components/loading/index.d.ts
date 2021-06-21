interface Props {
  size?: 'large' | 'default' | 'small'
  content?: string | JSX.Element
  visible?: boolean
  full?: boolean
  style?: CSSProperties
  className?: string
}

type Options = {
  content?: string | JSX.Element
  key: string | number
  duration?: number
  size?: 'large' | 'default' | 'small'
}
const OpenFun: (target: HTMLElement, options: Options) => void
const CloseFun: (key: string | number) => void

declare class Loading extends React.Component<Props, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Loading
