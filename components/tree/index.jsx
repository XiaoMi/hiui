import React, { useState, useCallback, useEffect } from 'react'
import BaseTree from './BaseTree'
import Input from '../Input'
import Icon from '../Icon'
import Popper from '../popper'
import { getAncestorIds } from './util'
import _ from 'lodash'
import Classnames from 'classnames'
import './style/index.scss'

const getMatchedNodes = (data, searchValue, matchedNodes = []) => {
  data.forEach((item) => {
    if (searchValue !== '' && item.title.includes(searchValue)) {
      matchedNodes.push(item)
    }
    if (item.children) {
      getMatchedNodes(item.children, searchValue, matchedNodes)
    }
  })
  return matchedNodes
}
const getShowData = (data, matchedIds, filtedIds) => {
  for (let i = 0; i < data.length; i++) {
    if (matchedIds.includes(data[i].id)) {
    } else if (filtedIds.includes(data[i].id)) {
      getShowData(data[i].children, matchedIds, filtedIds)
    } else {
      data.splice(i, 1)
      i = i - 1
    }
  }
  return data
}
const PREFIX = 'hi-editor-tree'

const Tree = (props) => {
  const {
    searchable,
    searchConfig = {},
    data,
    filter = false,
    contextMenu,
    editable,
    onBeforeSave,
    onSave,
    onBeforeDelete,
    onDelete
  } = props
  const { placeholder = '关键词搜索', emptyContent = '未找到搜索结果' } = searchConfig
  const [cacheData, updateCacheData] = useState(data)

  useEffect(() => {
    updateCacheData(data)
  }, [data])

  const [menuVisible, setMenuVisible] = useState(null)

  const [editingNodes, setEditingNodes] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState([])
  const [filteredIds, setFilteredIds] = useState([])
  const showData = getShowData(
    _.cloneDeep(cacheData),
    matchedNodes.map((n) => n.id),
    filteredIds
  )

  const editNode = (node) => {
    setEditingNodes(editingNodes.concat(node))
  }

  const menuRender = useCallback(
    (node) => {
      let menu = [
        { title: '编辑节点', type: 'editNode' },
        { title: '添加子节点', type: 'addChildNode' },
        { title: '添加节点', type: 'addSiblingNode' },
        { title: '删除', type: 'deleteNode' }
      ]
      if (contextMenu) {
        menu = contextMenu(node)
      }
      return (
        <ul className={`${PREFIX}__menu`}>
          {menu.map((m, index) => (
            <li
              className={`menu-item`}
              key={index}
              onClick={() => {
                if (m.onClick) {
                  m.onClick(node)
                } else {
                  if (m.type === 'editNode') {
                    editNode(node)
                  }
                }
              }}
            >
              {m.title}
            </li>
          ))}
        </ul>
      )
    },
    [editNode]
  )

  const treeNodeRender = useCallback(
    (node, { selected }, treeNodeRef, onSelectNode) => {
      if (editingNodes.map((n) => n.id).includes(node.id)) {
        return (
          <div className='tree-node__title--editing'>
            <Input
              style={{ width: 240, marginRight: 20 }}
              value={(editingNodes.find((n) => n.id === node.id) || {}).title}
              onChange={(e) => {
                onValueChange(e.target.value, node.id)
              }}
            />
            <span
            // style={
            //   (editingNodes.find((node) => node.id === item.id) || {}).title === ''
            //     ? { marginRight: 12, color: '#999', cursor: 'not-allowed' }
            //     : { cursor: 'pointer', marginRight: 12, color: themeColor[theme] }
            // }
            // onClick={() => {
            //   if ((editingNodes.find((node) => node.id === item.id) || {}).title !== '') {
            //     saveEditNode(item.id, level)
            //   }
            // }}
            >
              确定
            </span>
            <span
              style={{ cursor: 'pointer', color: '#999' }}
              // onClick={() => {
              //   if (editNodes.map((node) => node.id).includes(item.id)) {
              //     cancelEditNode(item.id)
              //   } else {
              //     cancelAddSiblingNode(item.id)
              //   }
              // }}
            >
              取消
            </span>
          </div>
        )
      } else {
        if (
          searchValue !== '' &&
          searchable &&
          typeof node.title === 'string' &&
          node.title.includes(searchValue)
        ) {
          const index = node.title.indexOf(searchValue)
          const beforeStr = node.title.substr(0, index)
          const afterStr = node.title.substr(index + searchValue.length)
          return (
            <div
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
                <span style={{ color: '#4284f5' }}>{searchValue}</span>
                {afterStr}
              </span>
            </div>
          )
        } else {
          return (
            <div
              className={Classnames('title__text', {
                'title__text--selected': selected
              })}
              onClick={() => {
                onSelectNode(node)
              }}
              onContextMenu={(e) => {
                console.log(111)
                if (editable) {
                  e.preventDefault()
                  setMenuVisible(node.id)
                }
              }}
            >
              {node.title}
              {editable && (
                <Popper
                  show={menuVisible === node.id}
                  attachEle={treeNodeRef.current}
                  width={false}
                  zIndex={1040}
                  placement='right-start'
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
    },
    [searchValue, editingNodes, menuVisible, searchable]
  )
  return (
    <React.Fragment>
      {searchable && (
        <div className={`${PREFIX}__searcher`}>
          <Input
            value={searchValue}
            type='text'
            placeholder={placeholder}
            onChange={(e) => {
              const matchedNodes = getMatchedNodes(cacheData, e.target.value)
              let filteredNodes = []
              matchedNodes.forEach((node) => {
                const ancestors = getAncestorIds(node.id, cacheData, [])
                filteredNodes = filteredNodes.concat(ancestors)
              })
              setSearchValue(e.target.value)
              setMatchedNodes(matchedNodes)
              setFilteredIds(_.uniq(filteredNodes))
            }}
            append={<Icon name='search' style={{ fontSize: '16px' }} />}
            style={{ width: '250px', marginBottom: '24px' }}
          />
          <div />
          {matchedNodes.length === 0 && searchValue !== '' && (
            <div className='searcher__result--empty'>{emptyContent}</div>
          )}
        </div>
      )}
      <BaseTree
        {...props}
        treeNodeRender={treeNodeRender}
        expandedIds={filteredIds}
        data={filter && searchable && searchValue !== '' ? showData : cacheData}
      />
    </React.Fragment>
  )
}

export default Tree
