interface ITreeNode{
  id: string
  title: string
  children?: ITreeNode[]
  isLeaf?: boolean
}

interface IProps{
  data: ITreeNode[]
  checkedIds: string[]
  onChange: (checkedIds: string[]) => void
  maskCloseable?: boolean
  styleType?: 'simple' | 'with-border'
  checkedType?: 'all' | 'child'
  dialogTitle: string
  title: string
  className?: string
  style?: React.CSSProperties
}

declare class SelectTreeDialog extends React.Component<IProps, any>{

}

export default SelectTreeDialog