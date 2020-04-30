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
    checkedIds,
    onSelectNode,
    onClick,
    selectedId,
    editable,
    editMenu,
    PREFIX
  } = useContext(TreeContext)

  const [expanded, setExpanded] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const treeNodeRef = useRef(null)
  const editMenuRef = useRef(null)

  useClickOutside(editMenuRef, () => {
    setMenuVisible(false)
  })

  const renderChildren = useCallback(children => {
    return (
      <ul>
        {children.map(child => (
          <TreeNode key={child.id} node={child} />
        ))}
      </ul>
    )
  }, [])

  const renderSwitcher = useCallback(expanded => {
    return (
      <Icon
        style={{ cursor: 'pointer', marginRight: 3 }}
        name={expanded ? 'open' : 'packup'}
        onClick={() => setExpanded(!expanded)}
      />
    )
  }, [])

  const renderIndent = useCallback(() => {
    return <span style={{ width: 16, marginRight: 3 }} />
  }, [])

  const renderCheckbox = useCallback(() => {
    return <Checkbox />
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
          onSelectNode(id)
        }}
        onContextMenu={e => {
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
      <div className='tree-node__self'>
        {node.children && node.children.length
          ? renderSwitcher(expanded)
          : renderIndent()}
        {checkable && renderCheckbox()}
        {renderTitle(node, selectedId)}
      </div>
      {node.children && expanded ? renderChildren(node.children) : null}
      {editable && null && (
        <Popper
          show={menuVisible}
          attachEle={treeNodeRef.current}
          zIndex={1040}
          placement='right'
        >
          {renderEditMenu(editMenu, node)}
        </Popper>
      )}
    </li>
  )
}

export default TreeNode
