import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import { getSemiChecked, getChildrenIds, getAncestorIds, findNode } from './util'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'

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

  // 多选逻辑
  const [checkedNodes, setCheckedNodes] = useState({
    checked: [],
    semiChecked: []
  })

  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        selectedId: selectNodeId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick
        // onCheckboxChange
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
