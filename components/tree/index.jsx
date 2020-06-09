import React from 'react'
import { Input } from '../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'
import useCheckable from './hooks/useCheckable'

const PREFIX = 'hi-editor-tree'

const Tree = ({
  searchable,
  data,
  treeNodeRender,
  checkable,
  selectable = true,
  selectedId,
  defaultSelectedId,
  onSelect,
  checkedIds,
  defaultCheckedIds,
  onCheck,
  editable,
  editMenu,
  onClick
}) => {
  const [flatData, updateFlatData] = useFlatData(data)
  const [selectNodeId, onSelectNode] = useSelect({
    selectedId,
    selectable,
    defaultSelectedId,
    onSelect
  })

  const [{checkedNodes, semiCheckedIds}, onCheckNode] = useCheckable({defaultCheckedIds, checkedIds, onCheck, data, flatData})
  console.log('>>>>>>2', checkedNodes, semiCheckedIds)

  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        semiCheckedIds,
        selectedId: selectNodeId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckNode
      }}
    >
      <div className={PREFIX}>
        {searchable && (
          <div style={{ width: 250, marginBottom: 15 }}>
            <Input />
          </div>
        )}
        <ul className='root-list'>
          {flatData.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

export default Tree
