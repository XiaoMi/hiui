import React, { useContext, useState, useRef, useCallback } from 'react'
import Checkbox from '../checkbox'
import Icon from '../icon'
import Popper from '../popper'
import Classnames from 'classnames'
import TreeContext from './context'
import useClickOutside from './hooks/useClickOutside'
import useDnD from './hooks/useDnD'
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
    editable,
    onCheckNode,
    expandedNodeIds,
    onExpandNode,
    draggable,
    onLoadChildren,
    apperance = 'default'
  } = useContext(TreeContext)
  const move = (a, b, c) => {
    console.log(a, b, c)
  }

  const [{ isDragging, isOver, direction }, ref] = useDnD({ id: node.id, move })
  const [menuVisible, setMenuVisible] = useState(false)
  const treeNodeRef = useRef(null)
  const editMenuRef = useRef(null)

  const [loading, setLoading] = useState(false)

  useClickOutside(editMenuRef, () => {
    setMenuVisible(false)
  })
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
        <span
          key={index}
          style={{ width: 16, display: 'inline-block', marginRight: index === times - 1 ? 3 : 0 }}
        />
      ))
  }, [])

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

  const renderTitle = useCallback(
    (node, selectedId) => {
      const { id, title } = node
      return (
        <div
          ref={draggable ? ref : treeNodeRef}
          className={Classnames('tree-node__title', {
            'tree-node__title--selected': selectedId === id,
            [`tree-node__title--${direction}`]: isOver && direction,
            [`tree-node__title--draggable`]: draggable
          })}
          onClick={() => {
            setMenuVisible(false)
            onSelectNode(node)
          }}
          onContextMenu={(e) => {
            if (editable) {
              e.preventDefault()
              setMenuVisible(true)
            }
          }}
        >
          {treeNodeRender ? treeNodeRender(title) : title}
        </div>
      )
    },
    [treeNodeRef, ref, draggable, direction, isOver]
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
      {editable && (
        <Popper
          show={menuVisible}
          attachEle={treeNodeRef.current}
          zIndex={1040}
          placement='right'
          onClickOutside={() => {
            setMenuVisible(false)
          }}
        >
          <div>123</div>
        </Popper>
      )}
    </li>
  )
}

export default TreeNode
