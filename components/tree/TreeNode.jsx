import React, { useContext, useState, useRef, useCallback } from 'react'
import Checkbox from '../checkbox'
import Icon from '../icon'

import Classnames from 'classnames'
import TreeContext from './context'

import Loading from './IconLoading'
const switcherApperanceMap = {
  default: ['packup', 'open'],
  folder: ['folder', 'Folder-open'],
  line: ['TreePlus', 'TreeMinus']
}

const TreeNode = ({ node }) => {
  const {
    treeNodeRender,
    checkable,
    checkedNodes,
    semiCheckedIds,
    onSelectNode,
    selectedId,
    onCheckNode,
    expandedNodeIds,
    onExpandNode,
    draggable,
    onLoadChildren,
    apperance = 'default',
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd
  } = useContext(TreeContext)
  const [direction, setDirection] = useState(null)
  const [dragId, setDragId] = useState(null)

  const treeNodeRef = useRef(null)

  const [loading, setLoading] = useState(false)

  // 渲染 apperance 占位
  const renderApperancePlaceholder = useCallback((apperance) => {
    if (apperance === 'folder') {
      return <Icon name='File' style={{ marginRight: 3 }} />
    }
  }, [])
  // 渲染展开收起
  const renderSwitcher = useCallback(
    (expandedIds, node, onExpandNode, onLoadChildren) => {
      const expanded = expandedIds.includes(node.id)
      return loading ? (
        <Loading />
      ) : (
        <Icon
          style={{ cursor: 'pointer', marginRight: 3 }}
          name={expanded ? switcherApperanceMap[apperance][1] : switcherApperanceMap[apperance][0]}
          onClick={() => {
            if (onLoadChildren) {
              setLoading(true)
              onLoadChildren(node).then(() => {
                setLoading(false)
                onExpandNode(node, !expanded, expandedIds)
              })
            } else {
              onExpandNode(node, !expanded, expandedIds)
            }
          }}
        />
      )
    },
    [loading, setLoading, apperance]
  )
  // 渲染空白占位
  const renderIndent = useCallback((times) => {
    return Array(times)
      .fill('')
      .map((indent, index) => (
        <span key={index} style={{ width: 16, display: 'inline-block', marginRight: index === times - 1 ? 3 : 0 }} />
      ))
  }, [])

  // 渲染复选框
  const renderCheckbox = useCallback((node, { checked, semiChecked }) => {
    return (
      <Checkbox
        indeterminate={semiChecked.includes(node.id)}
        checked={checked.includes(node.id)}
        onChange={(e) => {
          onCheckNode(node, e.target.checked, checked)
        }}
      />
    )
  }, [])

  // 渲染标题
  const renderTitle = useCallback(
    (node, selectedId) => {
      const { id, title } = node
      return (
        <div
          ref={treeNodeRef}
          draggable={draggable}
          className={Classnames('tree-node__title', {
            [`tree-node__title--${direction}`]: direction,
            [`tree-node__title--draggable`]: draggable
          })}
          onDragStart={(e) => {
            e.stopPropagation()
            e.dataTransfer.setData('treeNode', id)
            setDragId(id)
            if (onDragStart) {
              onDragStart(e)
            }
          }}
          onDragEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.clearData()
            setDragId(null)
            if (onDragEnd) {
              onDragEnd(e)
            }
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDirection(null)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (dragId !== id) {
              const targetBoundingRect = treeNodeRef.current.getBoundingClientRect()
              const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
              const hoverTargetInsideY = hoverTargetSortY * 2
              // 鼠标垂直移动距离
              const hoverClientY = e.clientY - targetBoundingRect.top

              if (hoverClientY < hoverTargetSortY) {
                setDirection('up')
              } else if (hoverClientY >= hoverTargetSortY && hoverClientY < hoverTargetInsideY) {
                setDirection('in')
              } else {
                setDirection('down')
              }
            }
            if (onDragOver) {
              onDragOver(e)
            }
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDirection(null)
            if (onDrop) {
              onDrop({ targetId: id, sourceId: Number(e.dataTransfer.getData('treeNode', id)), direction })
            }
          }}
        >
          {treeNodeRender ? (
            treeNodeRender(node, { selected: selectedId === id }, treeNodeRef, onSelectNode)
          ) : (
            <div
              className={Classnames('title__text', {
                'title__text--selected': selectedId === id
              })}
              onClick={() => {
                onSelectNode(node)
              }}
            >
              {title}
            </div>
          )}
        </div>
      )
    },
    [treeNodeRef, draggable, treeNodeRender, direction, dragId]
  )
  return (
    <li className='tree-node'>
      {renderIndent(
        (node.children && node.children.length) || (onLoadChildren && !node.isLeaf)
          ? node.depth
          : apperance !== 'default'
            ? node.depth
            : (node.depth && node.depth + 1) || 1
      )}
      {(!node.children || (onLoadChildren && node.isLeaf)) && renderApperancePlaceholder(apperance)}
      {((node.children && node.children.length) || (onLoadChildren && !node.isLeaf)) &&
        renderSwitcher(expandedNodeIds, node, onExpandNode, onLoadChildren)}
      {checkable && renderCheckbox(node, { checked: checkedNodes, semiChecked: semiCheckedIds })}
      {renderTitle(node, selectedId)}
    </li>
  )
}

export default TreeNode
