import React, { useContext, useState, useRef, useCallback } from 'react'
import Checkbox from '../checkbox'
import Icon from '../icon'
import Popper from '../popper'
import Classnames from 'classnames'
import TreeContext from './context'
import useClickOutside from './hooks/useClickOutside'
import useDnD from './hooks/useDnD'
import Loading from './IconLoading'

const TreeNode = ({ node }) => {
  const {
    treeNodeRender,
    checkable,
    checkedNodes,
    semiCheckedIds,
    onSelectNode,
    onClick,
    selectedId,
    editable,
    editMenu,
    PREFIX,
    onCheckNode,
    expandedNodeIds,
    onExpandNode,
    draggable,
    onLoadChildren
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

  const renderSwitcher = useCallback(
    (expandedIds, node, onExpandNode, onLoadChildren) => {
      const expanded = expandedIds.includes(node.id)
      return loading ? (
        <Loading />
      ) : (
        <Icon
          style={{ cursor: 'pointer', marginRight: 3 }}
          name={expanded ? 'open' : 'packup'}
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
    [loading, setLoading]
  )

  const renderIndent = useCallback((times) => {
    return (
      <div style={{ marginRight: 3 }}>
        {Array(times).fill(<span style={{ width: 16, display: 'inline-block' }} />)}
      </div>
    )
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
            onClick(node)
            onSelectNode(node)
          }}
          // onContextMenu={(e) => {
          //   e.preventDefault()
          //   setMenuVisible(true)
          // }}
        >
          {treeNodeRender ? treeNodeRender(title) : title}
        </div>
      )
    },
    [treeNodeRef, ref, draggable, direction, isOver]
  )

  const renderEditMenu = useCallback((editMenu, node) => {
    const _editMenu = typeof editMenu === 'function' ? editMenu(node) : editMenu
    return (
      <div className={`${PREFIX}-menu`} ref={editMenuRef}>
        {_editMenu.map((menu, index) => (
          <div
            className='menu-item'
            key={index}
            onClick={() => {
              menu.onClick()
              setMenuVisible(false)
            }}
          >
            {menu.title}
          </div>
        ))}
      </div>
    )
  }, [])
  return (
    <li className='tree-node'>
      {renderIndent(
        (node.children && node.children.length) || (onLoadChildren && !node.isLeaf)
          ? node.depth
          : (node.depth && node.depth + 1) || 1
      )}
      {((node.children && node.children.length) || (onLoadChildren && !node.isLeaf)) &&
        renderSwitcher(expandedNodeIds, node, onExpandNode, onLoadChildren)}
      {checkable && renderCheckbox(node, { checked: checkedNodes, semiChecked: semiCheckedIds })}
      {renderTitle(node, selectedId)}
      {editable && null && (
        <Popper show={menuVisible} attachEle={treeNodeRef.current} zIndex={1040} placement='right'>
          {renderEditMenu(editMenu, node)}
        </Popper>
      )}
    </li>
  )
}

export default TreeNode
