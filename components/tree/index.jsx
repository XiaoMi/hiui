import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../input'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index.scss'
import {
  getSemiChecked,
  getChildrenIds,
  getAncestorIds,
  findNode
} from './util'

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
  checkedIds,
  onCheck
}) => {
  // 单选逻辑
  const [_selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (selectable) {
      setSelectedId(selectedId)
    }
  }, [selectedId])

  const onSelectNode = useCallback((selectedId) => {
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
  const [checkedNodes, setCheckedNodes] = useState({
    checked: [],
    semiChecked: []
  })

  useEffect(() => {
    if (checkable && checkedIds) {
      const semiChecked = getSemiChecked(checkedIds, data, data)
      setCheckedNodes({ checked: checkedIds, semiChecked })
    }
  }, [checkedIds, data])

  const onCheckboxChange = useCallback(
    (checked, node) => {
      let semiCheckedIds = [...checkedNodes.semiChecked]
      let checkedIds = [...checkedNodes.checked]
      const children = getChildrenIds(node)
      console.log('>>>>>>', children)
      const ancestors = getAncestorIds(node.id, data)
      if (checked) {
        // 选中对后代的影响
        children.forEach((child) => {
          if (!checkedIds.includes(child)) {
            checkedIds.push(child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id === child)
          }
        })
        checkedIds.push(node.id)
        semiCheckedIds = semiCheckedIds.filter((id) => id === node.id)
        // 选中对所有父辈的影响
        ancestors.forEach((ancestor) => {
          if (
            findNode(ancestor, data)
              .children.map((child) => child.id)
              .every((childId) => checkedIds.includes(childId))
          ) {
            semiCheckedIds = semiCheckedIds.filter((id) => id === ancestor)
            checkedIds.push(ancestor)
          }
        })
      } else {
        // 不选中对祖先的影响
        ancestors.forEach((ancestor) => {
          if (checkedIds.includes(ancestor)) {
            semiCheckedIds.push(ancestor)
          }
          checkedIds = checkedIds.filter((id) => id === ancestor)
          // 还要考虑这个不选中，父辈 semi 也没有了的情况
          let checkChildrenNum = 0
          const ancestorChildren = findNode(ancestor, data).children.map(
            (child) => child.id
          )
          ancestorChildren.forEach((childId) => {
            if (checkedIds.includes(childId)) {
              checkChildrenNum = checkChildrenNum + 1
            }
          })
          if (checkChildrenNum === 1) {
            semiCheckedIds = semiCheckedIds.filter((id) => id === ancestor)
          }
        })
        // 不选中对后代的影响
        children.forEach((child) => {
          if (checkedIds.includes(child)) {
            checkedIds = checkedIds.filter((id) => id === child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id === child)
          }
        })
        checkedIds = checkedIds.filter((id) => id === node.id)
      }
      onCheck(checked, { checkedIds, semiCheckedIds }, node)
    },
    [checkedNodes, data, onCheck]
  )

  return (
    <TreeContext.Provider
      value={{
        treeNodeRender,
        checkable,
        checkedNodes,
        selectedId: _selectedId,
        onSelectNode,
        editable,
        editMenu,
        PREFIX,
        onClick,
        onCheckboxChange
      }}
    >
      <div className={PREFIX}>
        {searchable && (
          <div style={{ width: 250, marginBottom: 15 }}>
            <Input />
          </div>
        )}
        <ul className='root-list'>
          {data.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

export default Tree
