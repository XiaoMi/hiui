import React from 'react'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'
import useCheckable from './hooks/useCheckable'
import useExpand from './hooks/useExpand'
import { getAncestorIds } from './util'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const PREFIX = 'hi-editor-tree'

const Tree = ({
  data,
  treeNodeRender,
  checkable,
  selectable = true,
  selectedId,
  defaultSelectedId,
  onSelect,
  expandedIds,
  defaultExpandedIds,
  onExpand,
  checkedIds,
  defaultCheckedIds,
  onCheck,
  editable,
  editMenu,
  onClick,
  draggable,
  onLoadChildren
}) => {
  const [flatData, updateFlatData] = useFlatData(data)
  const [selectNodeId, onSelectNode] = useSelect({
    selectedId,
    selectable,
    defaultSelectedId,
    onSelect
  })
  const [expandedNodeIds, onExpandNode] = useExpand({ expandedIds, defaultExpandedIds, onExpand })

  const [{ checkedNodes, semiCheckedIds }, onCheckNode] = useCheckable({
    defaultCheckedIds,
    checkedIds,
    onCheck,
    data,
    flatData
  })

  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        semiCheckedIds,
        selectedId: selectNodeId,
        onSelectNode,
        expandedNodeIds,
        onExpandNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckNode,
        draggable,
        onLoadChildren
      }}
    >
      <div className={PREFIX}>
        <ul className='root-list'>
          {flatData
            .filter((node) => {
              const ancestors = getAncestorIds(node.id, data)
              return ancestors.every((ancestor) => expandedNodeIds.includes(ancestor))
            })
            .map((node) => (
              <TreeNode key={node.id} node={node} />
            ))}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

const WrapperTree = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Tree {...props} />
    </DndProvider>
  )
}

export default WrapperTree
