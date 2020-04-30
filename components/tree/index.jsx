import React, { useState, useEffect } from 'react'
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
  onClick
}) => {
  const [_selectedId, setSelectedId] = useState(null)
  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectedId])
  const onSelectNode = selectedId => {
    if (selectable) {
      if (selectedId !== undefined) {
        setSelectedId(selectedId)
      }
      if (onSelect) {
        onSelect(selectedId)
      }
    }
  }
  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
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
