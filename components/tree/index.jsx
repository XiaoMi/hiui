import React, { useState, useCallback, useEffect } from 'react'
import BaseTree from './BaseTree'
import Input from '../input'
import Button from '../button'
import Modal from '../modal'
import { getAncestorIds, findNode } from './util'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import CustomTreeNode from './customTreeNode'
import axios from 'axios'
import Provider from '../context'
import './style/index'

const PREFIX = 'hi-tree'

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

const getDefaultIds = (data, collections = []) => {
  data.forEach((d) => {
    if (d.children) {
      collections.push(d.id)
      getDefaultIds(d.children, collections)
    }
  })
  return collections
}

const Tree = (props) => {
  const {
    searchable,
    searchConfig = {},
    data,
    expandedIds,
    defaultExpandedIds,
    defaultExpandAll = false,
    filter = false,
    contextMenu,
    editable,
    onBeforeSave,
    onSave,
    onBeforeDelete,
    onDelete,
    onLoadChildren,
    onExpand,
    onDragStart,
    onDrop,
    onDropEnd,
    theme
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
  const [expanded, setExpanded] = useState(
    expandedIds || defaultExpandedIds || (defaultExpandAll && getDefaultIds(data)) || []
  )

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
  // 加载节点
  const loadChildren = useCallback(
    (node) => {
      if (onLoadChildren) {
        return axios(onLoadChildren(node)).then(
          (res) => {
            const dataCache = _.cloneDeep(cacheData)
            const loadNode = findNode(node.id, dataCache)
            loadNode.children = res.data
            updateCacheData(dataCache)
            return res
          },
          (error) => {
            return error
          }
        )
      }
    },
    [onLoadChildren, cacheData]
  )
  // 移动节点
  const switchNode = useCallback((targetItemId, sourceItemId, data, allData, dropDividerPosition) => {
    const sourceNode = findNode(sourceItemId, allData)
    const _data = [...data]
    _data.forEach((item, idx) => {
      if (item.id === targetItemId) {
        const position = dropDividerPosition === 'down' ? idx + 1 : idx
        data.splice(position, 0, sourceNode)
      } else {
        if (item.children) {
          if (item.children.some((e) => e.id === targetItemId)) {
            const index = item.children.findIndex((i) => i.id === targetItemId)
            const position = dropDividerPosition === 'down' ? index + 1 : index
            item.children.splice(position, 0, sourceNode)
          } else {
            switchNode(targetItemId, sourceItemId, item.children, allData, dropDividerPosition)
          }
        }
      }
    })
  }, [])

  const addDropNode = useCallback((targetItemId, sourceItemId, data, allData) => {
    data.forEach((d, index) => {
      if (d.id === targetItemId) {
        const sourceNode = findNode(sourceItemId, allData)
        if (!d.children) {
          d.children = []
        }
        d.children.push(sourceNode)
      } else {
        if (d.children) {
          addDropNode(targetItemId, sourceItemId, d.children, allData)
        }
      }
    })
  }, [])
  // 删除拖动的节点
  const _delDragNode = useCallback((itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          _delDragNode(itemId, d.children)
        }
      }
    })
  }, [])

  const moveNode = useCallback(
    ({ targetId, sourceId, direction, depth }) => {
      const _dataCache = _.cloneDeep(cacheData)
      _delDragNode(sourceId, _dataCache)
      if (direction === 'in') {
        addDropNode(targetId, sourceId, _dataCache, cacheData)
      } else {
        switchNode(targetId, sourceId, _dataCache, cacheData, direction)
      }
      if (onDrop) {
        const sourceNode = findNode(sourceId, cacheData)
        const dragNode = findNode(targetId, cacheData)
        const result = onDrop(
          sourceNode,
          dragNode,
          { before: cacheData, after: _dataCache },
          { before: depth.source, after: direction === 'in' ? depth.target + 1 : depth.target }
        )
        if (result === true) {
          updateCacheData(_dataCache)
          if (onDropEnd) {
            onDropEnd(sourceNode, dragNode)
          }
        } else if (result && typeof result.then === 'function') {
          result.then((res) => {
            updateCacheData(_dataCache)
            if (onDropEnd) {
              onDropEnd(sourceNode, dragNode)
            }
          })
        }
      } else {
        updateCacheData(_dataCache)
      }
    },
    [cacheData, _delDragNode, addDropNode, switchNode, onDrop, onDropEnd]
  )

  // 编辑节点
  const editNode = (node) => {
    setEditingNodes(editingNodes.concat(node))
  }
  // 同步编辑值
  const onValueChange = useCallback(
    (value, nodeId) => {
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
    },
    [editingNodes]
  )
  // 取消编辑
  const cancelEdit = useCallback(
    (nodeId) => {
      setEditingNodes(editingNodes.filter((n) => n.id !== nodeId))
    },
    [editingNodes]
  )

  // 添加兄弟节点
  const _addSibNode = useCallback((node, data, addNode) => {
    data.forEach((d, index) => {
      if (d.id === node.id) {
        data.splice(index + 1, 0, addNode)
      } else {
        if (d.children) {
          _addSibNode(node, d.children, addNode)
        }
      }
    })
  }, [])

  const addSiblingNode = useCallback(
    (node) => {
      const dataCache = _.cloneDeep(cacheData)
      const addNode = { id: uuidv4(), title: '', TREE_NODE_TYPE: 'add' }
      _addSibNode(node, dataCache, addNode)
      setEditingNodes(editingNodes.concat(addNode))
      updateCacheData(dataCache)
    },
    [cacheData, editingNodes, _addSibNode]
  )

  // 添加子节点
  const _addChildNode = useCallback((node, data, addNode) => {
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
  }, [])
  const addChildNode = useCallback(
    (node) => {
      const dataCache = _.cloneDeep(cacheData)
      const addNode = { id: uuidv4(), title: '', TREE_NODE_TYPE: 'add' }
      _addChildNode(node, dataCache, addNode)
      setEditingNodes(editingNodes.concat(addNode))
      updateCacheData(dataCache)
      setExpanded(expanded.concat(node.id))
    },
    [editingNodes, cacheData, _addChildNode, expanded]
  )

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
  const cancelAddNode = useCallback(
    (node) => {
      const dataCache = _.cloneDeep(cacheData)
      _cancelAddNode(node, dataCache)
      updateCacheData(dataCache)
    },
    [cacheData, _cancelAddNode]
  )
  // 保存
  const _saveEdit = (itemId, data, nodeEdited) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        d.title = nodeEdited.title
        delete d.TREE_NODE_TYPE
      } else {
        if (d.children) {
          _saveEdit(itemId, d.children, nodeEdited)
        }
      }
    })
  }
  const saveEdit = useCallback(
    (enode) => {
      const nodeEdited = { ...editingNodes.find((node) => node.id === enode.id) }
      const dataCache = _.cloneDeep(cacheData)
      _saveEdit(enode.id, dataCache, nodeEdited)
      if (onBeforeSave) {
        const result = onBeforeSave(nodeEdited, { before: cacheData, after: dataCache }, enode.depth)
        if (result === true) {
          updateCacheData(dataCache)
          onSave(nodeEdited, dataCache)
        }
      } else {
        updateCacheData(dataCache)
        onSave(enode, dataCache)
      }
      setEditingNodes(editingNodes.filter((n) => n.id !== enode.id))
    },
    [editingNodes, cacheData, _saveEdit]
  )

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
  const deleteNode = useCallback(
    (node) => {
      const dataCache = _.cloneDeep(cacheData)
      _deleteNode(node.id, dataCache)
      if (onBeforeDelete) {
        const result = onBeforeDelete(node, { before: cacheData, after: dataCache }, node.depth)
        if (result === true) {
          updateCacheData(dataCache)
          onDelete(node, dataCache)
        }
      } else {
        updateCacheData(dataCache)
        onDelete(node, dataCache)
      }
    },
    [cacheData, _deleteNode]
  )

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
        <ul className={`${PREFIX}__menu theme__${theme}`}>
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
    },
    [editNode, addChildNode, addSiblingNode]
  )

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
        <div className={`${PREFIX}__searcher theme__${theme}`}>
          <Input
            value={searchValue}
            type="text"
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
              setExpanded(_.uniq(filteredNodes))
            }}
            append={<Button icon="search" />}
            style={{ width: '250px', marginBottom: '24px' }}
          />
          {matchedNodes.length === 0 && searchValue !== '' && (
            <div className="searcher__result--empty">{emptyContent}</div>
          )}
        </div>
      )}
      <BaseTree
        {...props}
        className={`theme__${theme}`}
        onLoadChildren={onLoadChildren ? loadChildren : null}
        treeNodeRender={treeNodeRender}
        expandedIds={expanded}
        onExpand={(expandedNode, isExpanded, ids) => {
          setExpanded(ids)
          if (onExpand) {
            onExpand(expandedNode, isExpanded, ids)
          }
        }}
        onDrop={moveNode}
        onDragStart={onDragStart}
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
export default Provider(Tree)
