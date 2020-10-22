import React, { useContext, useState, useRef, useCallback } from 'react'
import Checkbox from '../checkbox'
import Icon from '../icon'

import Classnames from 'classnames'
import TreeContext from './context'

import Loading from './IconLoading'
const switcherApperanceMap = {
  default: ['caret-right', 'caret-down'],
  folder: ['folder', 'folder-open'],
  line: ['plus-square', 'minus-square']
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
      return <Icon name="file" style={{ marginRight: 8 }} />
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
          style={{ cursor: 'pointer', marginRight: 8, fontSize: 16 }}
          name={expanded ? switcherApperanceMap[apperance][1] : switcherApperanceMap[apperance][0]}
          onClick={() => {
            if (onLoadChildren && !node.children) {
              setLoading(true)
              onLoadChildren(node).then(
                (res) => {
                  setLoading(false)
                  onExpandNode(node, !expanded, expandedIds)
                },
                () => {
                  setLoading(false)
                }
              )
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
  const renderIndent = useCallback((times, isSiblingLast, ancestors) => {
    const isAncestorSiblingLast = []
    if (ancestors) {
      ancestors.forEach((a, idx) => {
        if (idx < ancestors.length - 1) {
          isAncestorSiblingLast.push(a.id === ancestors[idx + 1].children[ancestors[idx + 1].children.length - 1].id)
        }
      })
    }
    const _isAncestorSiblingLast = isAncestorSiblingLast.reverse()
    return Array(times)
      .fill('')
      .map((indent, index) => {
        return (
          <span key={index} style={{ alignSelf: 'stretch' }} id={index}>
            <span
              className={Classnames('tree-node__indent', {
                'tree-node__indent--parent-tail': _isAncestorSiblingLast[index] && index !== times - 1,
                'tree-node__indent--tail': isSiblingLast && times - 1 === index
              })}
            />
          </span>
        )
      })
  }, [])

  // 渲染复选框
  const renderCheckbox = useCallback((node, { checked, semiChecked }) => {
    return (
      <Checkbox
        indeterminate={semiChecked.includes(node.id)}
        checked={checked.includes(node.id)}
        disabled={node.disabled}
        onChange={(e) => {
          onCheckNode(node, e.target.checked, checked)
        }}
      />
    )
  }, [])

  // 渲染标题
  const renderTitle = useCallback(
    (node, selectedId) => {
      const { id, title, depth } = node
      return (
        <div
          ref={treeNodeRef}
          draggable={!node.disabled && draggable}
          className={Classnames('tree-node__title', {
            [`tree-node__title--${direction}`]: direction,
            [`tree-node__title--draggable`]: draggable,
            [`tree-node__title--disabled`]: node.disabled
          })}
          onDragStart={(e) => {
            e.stopPropagation()
            e.dataTransfer.setData('treeNode', JSON.stringify({ id, depth }))
            setDragId(id)
            if (onDragStart) {
              onDragStart(node)
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
            if (onDrop && dragId !== id) {
              const passedData = JSON.parse(e.dataTransfer.getData('treeNode'))
              onDrop({
                targetId: id,
                sourceId: Number(passedData.id),
                depth: { source: passedData.depth, target: depth },
                direction
              })
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
    <li className={Classnames('tree-node', { 'tree-node--line': apperance === 'line' })}>
      {renderIndent(
        (node.children && node.children.length) || (onLoadChildren && !node.isLeaf && !node.children)
          ? node.depth
          : apperance !== 'default'
          ? node.depth
          : (node.depth && node.depth + 1) || 1,
        node.id === (node.sibling && node.sibling[node.sibling.length - 1].id),
        node.ancestors
      )}
      {(!node.children || (onLoadChildren && node.isLeaf)) && renderApperancePlaceholder(apperance)}
      {((node.children && node.children.length) || (onLoadChildren && !node.isLeaf && !node.children)) &&
        renderSwitcher(expandedNodeIds, node, onExpandNode, onLoadChildren)}
      {checkable && renderCheckbox(node, { checked: checkedNodes, semiChecked: semiCheckedIds })}
      {renderTitle(node, selectedId)}
    </li>
  )
}

export default TreeNode
