import React from 'react'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'
import useCheckable from './hooks/useCheckable'
import useExpand from './hooks/useExpand'
import classnames from 'classnames'

const PREFIX = 'hi-tree'

const BaseTree = ({
  data,
  treeNodeRender,
  menuRender,
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
  onLoadChildren,
  apperance,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  className
}) => {
  const [flatData] = useFlatData(data)
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
        menuRender,
        checkable,
        checkedNodes,
        semiCheckedIds,
        selectedId: selectNodeId,
        onSelectNode,
        onExpandNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckNode,
        draggable,
        onLoadChildren,
        apperance,
        onDragStart,
        onDragOver,
        onDrop,
        onDragEnd
      }}
    >
      <div className={classnames(PREFIX, className)}>
        <ul className="root-list">
          {flatData
            .filter((node) => {
              const ancestors = node.ancestors || []
              return ancestors.every((ancestor) => expandedNodeIds.includes(ancestor.id))
            })
            .map((node) => {
              return <TreeNode key={node.id} node={node} expanded={expandedNodeIds.includes(node.id)} />
            })}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

export default BaseTree
