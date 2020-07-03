import React, { useState, useCallback, useEffect } from 'react'
import BaseTree from './BaseTree'
import Input from '../Input'
import Button from '../button'
import Modal from '../modal'
import { getAncestorIds } from './util'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import CustomTreeNode from './customTreeNode'
import './style/index.scss'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
    expandedIds,
    defaultExpandedIds,
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
  const [modalVisible, setModalVisible] = useState(null)

  const [editingNodes, setEditingNodes] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState([])
  const [filteredIds, setFilteredIds] = useState([])
  const [expanded, setExpanded] = useState(expandedIds || defaultExpandedIds || [])

  useEffect(() => {
    if (expandedIds) {
      setExpanded(expandedIds)
    }
  }, [expandedIds])

  const showData = getShowData(
    _.cloneDeep(cacheData),
    matchedNodes.map((n) => n.id),
    filteredIds
  )
  // 编辑节点
  const editNode = (node) => {
    setEditingNodes(editingNodes.concat(node))
  }
  // 同步编辑值
  const onValueChange = (value, nodeId) => {
    setEditingNodes(
      editingNodes
        .filter((n) => n.id !== nodeId)
        .concat(
          Object.assign(
            {},
            editingNodes.find((n) => n.id === nodeId),
            {
              title: value
            }
          )
        )
    )
  }
  // 取消编辑
  const cancelEdit = (nodeId) => {
    setEditingNodes(editingNodes.filter((n) => n.id !== nodeId))
  }

  // 添加兄弟节点
  const _addSibNode = (node, data, addNode) => {
    data.forEach((d, index) => {
      if (d.id === node.id) {
        data.splice(index + 1, 0, addNode)
      } else {
        if (d.children) {
          _addSibNode(node, d.children, addNode)
        }
      }
    })
  }

  const addSiblingNode = (node) => {
    const dataCache = _.cloneDeep(cacheData)
    const addNode = { id: uuidv4(), title: '', TREE_NODE_TYPE: 'add' }
    _addSibNode(node, dataCache, addNode)
    setEditingNodes(editingNodes.concat(addNode))
    updateCacheData(dataCache)
  }

  // 添加子节点
  const _addChildNode = (node, data, addNode) => {
    data.forEach((d, index) => {
      if (d.id === node.id) {
        if (!d.children) {
          d.children = []
        }
        d.children.push(addNode)
      } else {
        if (d.children) {
          _addChildNode(node, d.children, addNode)
        }
      }
    })
  }
  const addChildNode = (node) => {
    const dataCache = _.cloneDeep(cacheData)
    const addNode = { id: uuidv4(), title: '', TREE_NODE_TYPE: 'add' }
    _addChildNode(node, dataCache, addNode)
    setEditingNodes(editingNodes.concat(addNode))
    updateCacheData(dataCache)
    setExpanded(expanded.concat(node.id))
  }

  // 取消添加节点
  const _cancelAddNode = (node, data) => {
    data.forEach((d, index) => {
      if (d.id === node.id) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          _cancelAddNode(node, d.children)
        }
      }
    })
  }
  const cancelAddNode = (node) => {
    const dataCache = _.cloneDeep(cacheData)
    _cancelAddNode(node, dataCache)
    updateCacheData(dataCache)
  }
  // 保存
  const _saveEdit = (itemId, data, nodeEdited) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        d.title = nodeEdited.title
        delete d['TREE_NODE_TYPE']
      } else {
        if (d.children) {
          _saveEdit(itemId, d.children, nodeEdited)
        }
      }
    })
  }
  const saveEdit = (nodeId) => {
    const nodeEdited = { ...editingNodes.find((node) => node.id === nodeId) }
    const dataCache = _.cloneDeep(cacheData)
    _saveEdit(nodeId, dataCache, nodeEdited)
    updateCacheData(dataCache)
    setEditingNodes(editingNodes.filter((n) => n.id !== nodeId))
  }

  // 删除节点
  const _deleteNode = (itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          _deleteNode(itemId, d.children)
        }
      }
    })
  }
  const deleteNode = (node) => {
    const dataCache = _.cloneDeep(cacheData)
    _deleteNode(node.id, dataCache)
    if (onBeforeDelete) {
      const result = onBeforeDelete(node, { before: dataCache, after: cacheData }, node.depth)
      if (result === true) {
        updateCacheData(dataCache)
        onDelete(node, dataCache)
      }
    } else {
      updateCacheData(dataCache)
      onDelete(node, dataCache)
    }
  }

  const menuRender = useCallback((node) => {
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
            onClick={(e) => {
              e.stopPropagation()
              if (m.onClick) {
                m.onClick(node)
              } else {
                if (m.type === 'editNode') {
                  editNode(node)
                }
                if (m.type === 'addSiblingNode') {
                  addSiblingNode(node)
                }
                if (m.type === 'addChildNode') {
                  addChildNode(node)
                }
                if (m.type === 'deleteNode') {
                  setModalVisible(node)
                }
              }
              setMenuVisible(null)
            }}
          >
            {m.title}
          </li>
        ))}
      </ul>
    )
  }, [])

  const treeNodeRender = useCallback(
    (node, { selected }, treeNodeRef, onSelectNode) => {
      return (
        <CustomTreeNode
          node={node}
          status={{ selected }}
          onSelectNode={onSelectNode}
          searchValue={searchValue}
          editingNodes={editingNodes}
          menuVisible={menuVisible}
          searchable={searchable}
          onValueChange={onValueChange}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          cancelAddNode={cancelAddNode}
          setMenuVisible={setMenuVisible}
          editable={editable}
          menuRender={menuRender}
        />
      )
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
            append={<Button icon='search' />}
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
        expandedIds={filteredIds.length ? filteredIds : expanded}
        onExpand={(expandedNode, isExpanded, ids) => {
          setExpanded(ids)
        }}
        data={filter && searchable && searchValue !== '' ? showData : cacheData}
      />
      <Modal
        title={'提示'}
        visible={modalVisible !== null}
        onConfirm={() => {
          deleteNode(modalVisible)
          setModalVisible(null)
        }}
        onCancel={() => {
          setModalVisible(null)
        }}
      >
        删除节点将删除所有子节点，确定删除吗？
      </Modal>
    </React.Fragment>
  )
}
const WrapperTree = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Tree {...props} />
    </DndProvider>
  )
}
export default WrapperTree
