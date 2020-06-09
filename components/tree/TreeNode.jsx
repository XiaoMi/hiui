import React, { useContext, useState, useRef, useCallback } from 'react'
import Checkbox from '../checkbox'
import Icon from '../icon'
import Popper from '../popper'
import Classnames from 'classnames'
import TreeContext from './context'
import useClickOutside from './hooks/useClickOutside'

const TreeNode = ({ node }) => {
  const {
    treeNodeRender,
    checkable,
    checkedNodes,
    onSelectNode,
    onClick,
    selectedId,
    editable,
    editMenu,
    PREFIX
    // onCheckboxChange
  } = useContext(TreeContext)

  const [expanded, setExpanded] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const treeNodeRef = useRef(null)
  const editMenuRef = useRef(null)

  useClickOutside(editMenuRef, () => {
    setMenuVisible(false)
  })

  const renderSwitcher = useCallback((expanded) => {
    return (
      <Icon
        style={{ cursor: 'pointer', marginRight: 3 }}
        name={expanded ? 'open' : 'packup'}
        onClick={() => setExpanded(!expanded)}
      />
    )
  }, [])

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
          // onCheckboxChange(e.target.checked, node)
        }}
      />
    )
  }, [])

  const renderTitle = useCallback((node, selectedId) => {
    const { id, title } = node
    return (
      <div
        ref={treeNodeRef}
        className={Classnames('tree-node__title', {
          'tree-node__title--selected': selectedId === id
        })}
        onClick={() => {
          onClick(node)
          onSelectNode(node)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          setMenuVisible(true)
        }}
      >
        {treeNodeRender ? treeNodeRender(title) : title}
      </div>
    )
  }, [])

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
      {renderIndent(node.depth)}
      {node.children && node.children.length && renderSwitcher(expanded)}
      {checkable && renderCheckbox(node, checkedNodes)}
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
