import React, { useRef } from 'react'
import Input from '../input'
import Popper from '../popper'
import Classnames from 'classnames'

const CustomTreeNode = ({
  node,
  selected,
  onSelectNode,
  searchValue,
  editingNodes,
  menuVisible,
  searchable,
  onValueChange,
  saveEdit,
  cancelEdit,
  cancelAddNode,
  setMenuVisible,
  editable,
  menuRender,
  localeDatas
}) => {
  const ref = useRef(null)
  const localMap = localeDatas.tree || {}

  if (editingNodes.map((n) => n.id).includes(node.id)) {
    return (
      <div className="tree-node__title--editing">
        <Input
          style={{ width: 240, marginRight: 20 }}
          onKeyDown={(e) => {
            e.stopPropagation()
          }}
          value={(editingNodes.find((n) => n.id === node.id) || {}).title}
          onChange={(e) => {
            onValueChange(e.target.value, node.id)
          }}
        />
        <span
          className={Classnames('save-btn', {
            'save-btn-disabled': (editingNodes.find((n) => n.id === node.id) || {}).title === ''
          })}
          onClick={() => {
            if ((editingNodes.find((n) => n.id === node.id) || {}).title === '') {
              return
            }
            saveEdit(node)
          }}
        >
          {localMap.confirm}
        </span>
        <span
          style={{ cursor: 'pointer', color: '#999' }}
          onClick={() => {
            cancelEdit(node.id)
            if (node.TREE_NODE_TYPE === 'add') {
              cancelAddNode(node)
            }
          }}
        >
          {localMap.cancel}
        </span>
      </div>
    )
  } else {
    if (searchValue !== '' && searchable && typeof node.title === 'string' && node.title.includes(searchValue)) {
      const index = node.title.indexOf(searchValue)
      const beforeStr = node.title.substr(0, index)
      const afterStr = node.title.substr(index + searchValue.length)
      return (
        <div
          ref={ref}
          className={Classnames('title__text', {
            'title__text--selected': selected
          })}
          onClick={() => {
            onSelectNode(node)
          }}
          onContextMenu={(e) => {
            if (editable) {
              e.preventDefault()
              setMenuVisible(node.id)
            }
          }}
        >
          <span>
            {beforeStr}
            <span className="title__text--matched">{searchValue}</span>
            {afterStr}
          </span>
        </div>
      )
    } else {
      return (
        <div
          ref={ref}
          className={Classnames('title__text', {
            'title__text--selected': selected
          })}
          onClick={() => {
            if (!node.disabled) {
              onSelectNode(node)
            }
          }}
          onContextMenu={(e) => {
            if (editable && !node.disabled) {
              e.preventDefault()
              setMenuVisible(node.id)
            }
          }}
        >
          {node.title}
          {editable && (
            <Popper
              show={menuVisible === node.id}
              attachEle={ref.current}
              width={false}
              zIndex={1040}
              placement="right-start"
              onClickOutside={() => {
                setMenuVisible(null)
              }}
            >
              {menuRender(node)}
            </Popper>
          )}
        </div>
      )
    }
  }
}

export default CustomTreeNode
