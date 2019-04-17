import React, { Component } from 'react'
// import Checkbox from '../table/checkbox/index'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import Input from '../input'
import Icon from '../icon'
import uuidv4 from 'uuid/v4'
import TreeItem from './TreeItem'

const highlightData = (data, highlightValue) => {
  return data.map(item => {
    if (typeof item.title === 'string' && item.title.includes(highlightValue)) {
      const index = item.title.indexOf(highlightValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + highlightValue.length)
      item.title = (
        <span>
          {beforeStr}
          <span style={{ color: '#4284f5' }}>{highlightValue}</span>
          {afterStr}
        </span>
      )
    }
    if (item.children) {
      highlightData(item.children, highlightValue)
    }
    return item
  })
}
// 寻找某一节点的父节点
const getParentId = (id, data) => {
  let parentId
  data.forEach(item => {
    if (item.children) {
      if (item.children.some(item => item.id === id)) {
        parentId = item.id
      } else if (getParentId(id, item.children)) {
        parentId = getParentId(id, item.children)
      }
    }
  })
  return parentId
}
// 寻找某一节点的所有祖先节点
const getAncestorIds = (id, data, arr = []) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}
// 收集所有需要展开的节点 id
const collectExpandId = (data, searchValue, collection = [], allData) => {
  data.forEach(item => {
    if (item.title.includes(searchValue)) {
      const parentIds = getAncestorIds(item.id, allData, [])
      // console.log('parentIds', parentIds)
      collection.splice(collection.length - 1, 0, ...parentIds)
      // console.log('collection', collection)
    }
    if (item.children) {
      collectExpandId(item.children, searchValue, collection, allData)
    }
  })
  return collection
}
// const TreeNoder = DragSourceWrapper(TreeItem)
export default class TreeNode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      highlight: null,
      showRightClickMenu: null,
      dataCache: [],
      prevData: [],
      // 存储编辑节点编辑前的状态
      editNodes: [],
      // 存储编辑节点的状态
      editingNodes: [],
      // 处于拖拽状态的节点
      draggingNode: null,
      // 处于目标状态的节点
      targetNode: null,
      searchValue: ''
    }
  }
  static getDerivedStateFromProps (props, state) {
    if (!isEqual(props.data, state.prevData)) {
      return {
        ...state,
        prevData: props.data,
        dataCache: props.data
      }
    }
    return state
  }
  onDragEnter (item, data, e) {
    this.props.onDragEnter(e, item, data)
  }
  onDragOver (item, data, e) {
    this.props.onDragOver(e, item, data)
  }
  onDragLeave (item, data, e) {
    this.props.onDragLeave(e, item, data)
  }
  onDrop (item, data, e) {
    this.props.onDrop(e, item, data)
  }
  onDragStart (item, data, e) {
    this.props.onDragStart(e, item, data)
  }

  getItem (name, treeItem) {
    let has = false
    this.props[name].map(item => {
      if (treeItem.id === item) {
        has = true
      }
    })
    return has
  }

  onCheckChange (checked, item) {
    this.props.onCheckChange(checked, item)
  }

  onExpanded = (expanded, item) => {
    this.props.onExpanded(expanded, item)
  }
  nodeClick = item => {
    this.props.onNodeClick(item)
  }

  renderSwitcher = expanded => {
    // const { prefixCls, openIcon, closeIcon } = this.props
    const { prefixCls } = this.props
    const switcherClsName = classNames(
      `${prefixCls}-switcher`,
      'hi-icon',
      `icon-${expanded ? 'down' : 'right'}`
    )
    return <i className={switcherClsName} />
  }

  renderItemIcon = () => {
    const { prefixCls, itemIcon } = this.props
    const switcherClsName = classNames(
      `${prefixCls}-switcher`,
      'hi-icon',
      `icon-${itemIcon || 'document'}`
    )
    return <i className={switcherClsName} />
  }
  // TODO:调整添加节点的策略，由深度遍历改为按层修改！
  // 添加兄弟节点
  _addSibNode = (itemId, data, editingNodes) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        const addNode = { id: uuidv4(), title: '', status: 'editable' }
        data.splice(index + 1, 0, addNode)
        editingNodes.push(addNode)
      } else {
        if (d.children) {
          this._addSibNode(itemId, d.children, editingNodes)
        }
      }
    })
  }
  // 设置拖拽中的节点
  setDraggingNode = itemId => {
    this.setState({
      draggingNode: itemId
    })
  }
  // 移除拖拽中的节点
  removeDraggingNode = () => {
    this.setState({
      draggingNode: null
    })
  }
  addSiblingNode = itemId => {
    const { dataCache, editingNodes } = this.state
    const _dataCache = cloneDeep(dataCache)
    const _editingNodes = [...editingNodes]
    this._addSibNode(itemId, _dataCache, _editingNodes)
    this.setState({ dataCache: _dataCache, editingNodes: _editingNodes })
  }

  // 取消添加节点
  _cancelAddSiblingNode = (itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          this._cancelAddSiblingNode(itemId, d.children)
        }
      }
    })
  }
  cancelAddSiblingNode = itemId => {
    const { dataCache } = this.state
    const _dataCache = cloneDeep(dataCache)
    this._cancelAddSiblingNode(itemId, _dataCache)
    this.setState({ dataCache: _dataCache })
  }
  // 添加子节点
  _addChildNode = (itemId, data, editingNodes) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        if (!d.children) {
          d.children = []
        }
        const addNode = { id: uuidv4(), title: '', status: 'editable' }
        d.children.push(addNode)
        editingNodes.push(addNode)
      } else {
        if (d.children) {
          this._addChildNode(itemId, d.children, editingNodes)
        }
      }
    })
  }
  addChildNode = item => {
    const { dataCache, editingNodes } = this.state
    const { expandTreeNode } = this.props
    expandTreeNode(item.id)
    const _dataCache = cloneDeep(dataCache)
    const _editingNodes = [...editingNodes]
    this._addChildNode(item.id, _dataCache, _editingNodes)
    this.setState({ dataCache: _dataCache, editingNodes: _editingNodes })
  }
  // 编辑节点
  editNode = item => {
    const _editNodes = [...this.state.editNodes]
    const _editingNodes = [...this.state.editingNodes]
    _editNodes.push(item)
    _editingNodes.push(item)
    this.setState({ editNodes: _editNodes, editingNodes: _editingNodes })
  }
  // 同步编辑值
  onValueChange = (value, itemId) => {
    this.setState({
      editingNodes: this.state.editingNodes
        .filter(item => item.id !== itemId)
        .concat(
          Object.assign({}, this.state.editingNodes.find(item => item.id === itemId), {
            title: value
          })
        )
    })
  }
  // 取消编辑节点
  _cancelEditNode = (itemId, data, nodeBeforeEdit) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        d.title = nodeBeforeEdit.title
      } else {
        if (d.children) {
          this._cancelEditNode(itemId, d.children, nodeBeforeEdit)
        }
      }
    })
  }
  cancelEditNode = itemId => {
    const { editNodes, dataCache, editingNodes } = this.state
    const nodeBeforeEdit = editNodes.find(node => node.id === itemId)
    const _dataCache = cloneDeep(dataCache)
    this._cancelEditNode(itemId, _dataCache, nodeBeforeEdit)
    this.setState({
      dataCache: _dataCache,
      editNodes: editNodes.filter(node => node.id !== itemId),
      editingNodes: editingNodes.filter(node => node.id !== itemId)
    })
  }
  // 保存编辑
  _saveEditNode = (itemId, data, nodeEdited) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        d.title = nodeEdited.title
        delete d.status
      } else {
        if (d.children) {
          this._saveEditNode(itemId, d.children, nodeEdited)
        }
      }
    })
  }
  saveEditNode = itemId => {
    const { editNodes, dataCache, editingNodes } = this.state
    const nodeEdited = editingNodes.find(node => node.id === itemId)
    const _dataCache = cloneDeep(dataCache)
    this._saveEditNode(itemId, _dataCache, nodeEdited)
    this.setState({
      dataCache: _dataCache,
      editNodes: editNodes.filter(node => node.id !== itemId),
      editingNodes: editingNodes.filter(node => node.id !== itemId)
    })
  }
  // 删除拖动的节点
  _delDragNode = (itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          this._delDragNode(itemId, d.children)
        }
      }
    })
  }
  // 新增放置的节点
  _addDropNode = (targetItemId, sourceItemId, data, allData) => {
    data.forEach((d, index) => {
      if (d.id === targetItemId) {
        const sourceNode = this.findNode(sourceItemId, allData)
        if (!d.children) {
          d.children = []
        }
        d.children.push(sourceNode)
      } else {
        if (d.children) {
          this._addDropNode(targetItemId, sourceItemId, d.children, allData)
        }
      }
    })
  }
  findNode = (itemId, data) => {
    // console.log('allData', data)
    let node
    data.forEach((d, index) => {
      if (d.id === itemId) {
        node = d
      } else {
        if (d.children && this.findNode(itemId, d.children)) {
          node = this.findNode(itemId, d.children)
        }
      }
    })
    return node
  }
  dropNode = (sourceItem, targetItem) => {
    const { dataCache } = this.state
    const _dataCache = cloneDeep(dataCache)
    this._delDragNode(sourceItem.id, _dataCache)
    this._addDropNode(targetItem.id, sourceItem.id, _dataCache, dataCache)
    this.setState({
      dataCache: _dataCache
    })
  }
  // 删除节点
  _deleteNode = (itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          this._deleteNode(itemId, d.children)
        }
      }
    })
  }
  deleteNode = itemId => {
    const { dataCache } = this.state
    const _dataCache = cloneDeep(dataCache)
    this._deleteNode(itemId, _dataCache)
    this.setState({ dataCache: _dataCache })
  }
  // 渲染右键菜单
  renderRightClickMenu = item => {
    return (
      item.id === this.state.showRightClickMenu && (
        <ul className='right-click-menu'>
          <li onClick={() => this.addSiblingNode(item.id)}>添加节点</li>
          <li onClick={() => this.addChildNode(item)}>添加子节点</li>
          <li onClick={() => this.editNode(item)}>编辑</li>
          <li onClick={() => this.deleteNode(item.id)}>删除</li>
        </ul>
      )
    )
  }
  //* *** */
  onSetHighlight = item => {
    this.setState({
      highlight: item.id
    })
  }
  showRightClickMenu = item => {
    this.setState({
      showRightClickMenu: item.id,
      highlight: item.id
    })
  }
  closeRightClickMenu = () => {
    this.setState({
      showRightClickMenu: null
    })
  }
  setTargetNode = id => {
    this.setState({ targetNode: id })
  }
  removeTargetNode = () => {
    this.setState({ targetNode: null })
  }
  renderTree = data => {
    const {
      draggable,
      prefixCls,
      dragNodePosition,
      dragNode,
      withLine,
      semiChecked,
      onNodeClick,
      onClick,
      highlightable,
      checkable,
      closeExpandedTreeNode,
      expandTreeNode
    } = this.props
    const { highlight, editNodes, editingNodes, draggingNode, targetNode } = this.state

    return (
      <ul>
        {data.map(item => {
          const checked = this.getItem('checked', item)
          const expanded = this.getItem('expanded', item)
          const itemStyle = classNames(
            dragNode === item.id && dragNodePosition === 0 && 'dragTo',
            dragNode === item.id && dragNodePosition === -1 && 'dragToGapTop',
            dragNode === item.id && dragNodePosition === 1 && 'dragToGapBottom',
            this.props.checkable && 'has_checkbox'
          )
          const itemContainerStyle = classNames(withLine && 'with-line')

          return (
            <TreeItem
              key={item.id}
              prefixCls={prefixCls}
              draggable={draggable}
              checked={checked}
              highlight={highlight}
              highlightable={highlightable}
              editNodes={editNodes}
              editingNodes={editingNodes}
              expanded={expanded}
              expandTreeNode={expandTreeNode}
              itemStyle={itemStyle}
              itemContainerStyle={itemContainerStyle}
              semiChecked={semiChecked}
              checkable={checkable}
              onExpanded={this.onExpanded}
              onValueChange={this.onValueChange}
              renderTree={this.renderTree}
              renderSwitcher={this.renderSwitcher}
              cancelAddSiblingNode={this.cancelAddSiblingNode}
              renderRightClickMenu={this.renderRightClickMenu}
              renderText={this.renderText}
              onCheckChange={this.onCheckChange}
              saveEditNode={this.saveEditNode}
              renderItemIcon={this.renderItemIcon}
              onNodeClick={onNodeClick}
              onClick={onClick}
              onSetHighlight={this.onSetHighlight}
              showRightClickMenu={this.showRightClickMenu}
              closeRightClickMenu={this.closeRightClickMenu}
              dropNode={this.dropNode}
              setDraggingNode={this.setDraggingNode}
              removeDraggingNode={this.removeDraggingNode}
              draggingNode={draggingNode}
              closeExpandedTreeNode={closeExpandedTreeNode}
              setTargetNode={this.setTargetNode}
              targetNode={targetNode}
              removeTargetNode={this.removeTargetNode}
              item={item}
            />
          )
        })}
      </ul>
    )
  }
  renderText (text) {
    return text
  }
  render () {
    const { dataCache, searchValue } = this.state
    return (
      <div>
        <div className='hi-tree_searcher'>
          <Input
            value={this.state.searchValue}
            type='text'
            placeholder='关键词搜索'
            onChange={e => {
              this.setState({ searchValue: e.target.value })
              this.props.setExpandTreeNodes(
                collectExpandId(dataCache, e.target.value, [], dataCache)
              )
            }}
            append={<Icon name='search' style={{ color: '#4284F5', fontSize: '24px' }} />}
            style={{ width: '250px' }}
          />
        </div>

        {this.renderTree(highlightData(cloneDeep(dataCache), searchValue))}
        {/* this.renderTree(cloneDeep(dataCache)) */}
      </div>
    )
  }
}
