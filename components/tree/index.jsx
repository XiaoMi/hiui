import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'

const PREFIX = 'hi-editor-tree'

const Tree = ({
  searchable,
  data,
  treeNodeRender,
  checkable,
  selectable = true,
  selectedId,
  onSelect,
  editable,
  editMenu,
  onClick,
  checkedIds
}) => {
  const [_selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectedId])

  const onSelectNode = useCallback(selectedId => {
    if (selectable) {
      if (selectedId !== undefined) {
        setSelectedId(selectedId)
      }
      if (onSelect) {
        onSelect(selectedId)
      }
    }
  }, [])

  // 多选逻辑
  const [checkedNodes, setCheckedNodes] = useEffect({checked: [], semiChecked: []})
  const getCheckedNodes = useCallback()
  useEffect(() => {
    setCheckedNodes({})
  }, [checkedIds])

  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedIds,
        selectedId: _selectedId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick
      }}
    >
      <div className={PREFIX}>
        {searchable && (
          <div>
            <Input />
          </div>
        )}
        <ul className='root-list'>
          {data.map(node => (
            <TreeNode key={node.id} node={node} />
          ))}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

export default Tree
