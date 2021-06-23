type TreeNode = {
  id: string | number
  title: string | JSX.Element
  disabled?: boolean
  children?: TreeNode[]
  isLeaf?: boolean
}
type LoadTreeNode = {
  method?: 'get' | 'post'
  url: string
  headers?: object
  data?: object
  params?: object
  transformResponse: (response: object) => TreeNode[]
}
type ContextMenuOption = {
  type?: 'editNode' | 'addChildNode' | 'addSiblingNode' | 'deleteNode'
  title?: string | JSX.Element
  onClick?: (item: TreeNode, node: TreeNode) => void
}
const LoadTreeNodeFun: (id: stsring) => TreeNode
const ContextMenuOptionFun: (item: TreeNode) => ContextMenuOption[]

type DataStatus = {
  before: TreeNode[]
  after: TreeNode[]
}
interface Props {
  data: TreeNode[]
  checkable?: boolean
  editable?: boolean
  draggable?: boolean
  searchable?: boolean
  selectable?: boolean
  defaultExpandAll?: boolean
  defaultHighlightId?: boolean
  loadTreeNode?: LoadTreeNode | LoadTreeNodeFun
  checkedIds?: string[] | number[]
  defaultExpandedIds?: string[] | number[]
  expandedIds?: string[] | number[]
  openIcon?: string
  closeIcon?: string
  apperance?: 'default' | 'line' | 'folder'
  style?: CSSProperties
  className?: string
  defaultSelectedId?: string | number 
  selectedId?: string | number 
  defaultCheckedIds?: string[] | number[] 
  contextMenu?: ContextMenuOption[] | ContextMenuOptionFun
  onChange?: (data: TreeNode[]) => void
  onExpand?: (expanded: boolean, expandIds: string[], expandedNode: TreeNode) => void
  onCheck?: (checked: boolean, checkedIds: string[], checkedNode: TreeNode) => void
  onClick?: (clickNode: TreeNode) => void
  onDragStart?: (dragNode: TreeNode) => void
  onDrop?: (dragNode: TreeNode, dropNode: TreeNode) => boolean
  onDropEnd?: (dragNode: TreeNode, dropNode: TreeNode) => void
  onBeforeDelete?: (deletedNode: TreeNode, data: DataStatus, level: number) => boolean
  onDelete?: (deletedNode: TreeNode, data: TreeNode[]) => void
  onBeforeSave?: (savedNode: TreeNode, data: DataStatus, level: number) => boolean
  onSave?: (savedNode: TreeNode, data: TreeNode[]) => void
  onSelect?: (selectedNode: TreeNode) => void
  onLoadChildren?: (selectedNode: TreeNode) => LoadTreeNode
}
declare const Tree: React.ComponentType<Props>
export default Tree
