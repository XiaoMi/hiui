import React, { useState } from 'react'
import { Input } from '../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'
import useCheckable from './hooks/useCheckable'
import useExpand from './hooks/useExpand'
import { getAncestorIds } from './util'

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
  expandedIds,
  defaultExpandedIds,
  onExpand,
  checkedIds,
  defaultCheckedIds,
  onCheck,
  editable,
  editMenu,
  onClick,
  filtrable = false
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

  const [searchValue, setSearchValue] = useState('')

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
        onCheckNode
      }}
    >
      <div className={PREFIX}>
        {searchable && (
          <div style={{ width: 250, marginBottom: 15 }}>
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                const matchedNodes = flatData.filter((node) => node.title.includes(e.target.value))
                let filteredNodes = [...matchedNodes]
                for (let i = 0; i < filteredNodes.length; i++) {
                  const parent = flatData.find((node) => (node.id = filteredNodes[i].parentId))
                  filteredNodes = filteredNodes.concat(parent)
                }
              }}
            />
          </div>
        )}
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

export default Tree
