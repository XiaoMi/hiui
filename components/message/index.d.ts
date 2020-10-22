interface Props {

}
type Options = {
  type?: 'info' | 'success' | 'error' | 'warning'
  title: string
  duration?: number
}
const OpenFun: (options: Options) => void
declare class Message extends React.Component<Props, any> {
  static open = OpenFun
}
export default Message
