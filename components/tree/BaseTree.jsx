import React, { useCallback, useRef, useMemo } from 'react'
import TreeNode from './TreeNode'
import TreeContext from './context'
import './style/index'
import useFlatData from './hooks/useFlatData'
import useSelect from './hooks/useSelect'
import useCheckable from './hooks/useCheckable'
import useExpand from './hooks/useExpand'
import classnames from 'classnames'
import _ from 'lodash'

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

  const treeRef = useRef(null)
  const moveFocus = useCallback(
    (info, direction) => {
      if (treeRef.current) {
        let focusIndex
        const showData = flatData.filter((node) => {
          const ancestors = node.ancestors || []
          return ancestors.every((ancestor) => expandedNodeIds.includes(ancestor.id))
        })
        if (direction === 'UP') {
          focusIndex = _.findLastIndex(showData, (item, dIndex) => {
            return !item.disabled && dIndex < info.index
          })
        }
        if (direction === 'DOWN') {
          focusIndex = _.findIndex(showData, (item, dIndex) => {
            return !item.disabled && dIndex > info.index
          })
        }
        if (direction === 'PARENT') {
          focusIndex = _.findIndex(showData, (item) => {
            return !item.disabled && item.id === info.pid
          })
        }
        if (direction === 'CHILD') {
          focusIndex = _.findIndex(showData, (item) => {
            return item.id === info.cid
          })
        }
        if (focusIndex > -1) {
          treeRef.current.querySelectorAll('.tree-node')[focusIndex].focus()
        }
      }
    },
    [treeRef, flatData, expandedNodeIds]
  )

  const defaultFocus = useMemo(() => {
    if (!checkable) {
      if (selectNodeId === null) {
        return flatData.findIndex((node) => {
          return !node.disabled
        })
      } else {
        return flatData.findIndex((node) => {
          return node.id === selectNodeId
        })
      }
    } else {
      if (checkedNodes.length === 0 && semiCheckedIds.length === 0) {
        return flatData.findIndex((node) => {
          return !node.disabled
        })
      } else {
        return flatData.findIndex((node) => {
          return (
            expandedNodeIds.includes(node.id) && (checkedNodes.includes(node.id) || semiCheckedIds.includes(node.id))
          )
        })
      }
    }
  }, [selectNodeId, checkable, flatData, expandedNodeIds, checkedNodes, semiCheckedIds])
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
        onDragEnd,
        moveFocus
      }}
    >
      <div className={classnames(PREFIX, className)}>
        <ul className="root-list" ref={treeRef}>
          {flatData
            .filter((node) => {
              const ancestors = node.ancestors || []
              return ancestors.every((ancestor) => expandedNodeIds.includes(ancestor.id))
            })
            .map((node, index) => {
              return (
                <TreeNode
                  key={node.id}
                  node={node}
                  idx={index}
                  tabIndex={index === defaultFocus ? 0 : -1}
                  expanded={expandedNodeIds.includes(node.id)}
                />
              )
            })}
        </ul>
      </div>
    </TreeContext.Provider>
  )
}

export default BaseTree
