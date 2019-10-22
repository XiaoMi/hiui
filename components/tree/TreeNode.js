import React, { Component } from 'react'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import Input from '../input'
import Icon from '../icon'
import uuidv4 from 'uuid/v4'
import TreeItem from './TreeItem'
import Modal from '../modal'
import { collectExpandId, findNode } from './util'
import axios from 'axios'
import qs from 'qs'
import Provider from '../context'

class TreeNode extends Component {
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
      // 放置线的位置,分为上线、下线和子线，上线则放置在该节点上方，下线则放置在该节点下侧，子线为放置在该节点内部
      dropDividerPosition: null,
      searchValue: '',
      showModal: false,
      currentDeleteNode: null,
      // 总共高亮的项
      highlightNum: 0,
      positionX: null,
      positionY: null
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
  setPosition = (x, y) => {
    const { positionX, positionY } = this.state
    if (!(x === positionX && y === positionY)) {
      this.setState({
        positionX: x,
        positionY: y
      })
    }
  }

  setHighlightNum = () => {
    this.setState({
      highlightNum: this.state.highlightNum + 1
    })
  }
  // 高亮检索值
  highlightData = (data, highlightValue) => {
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
        this.highlightData(item.children, highlightValue)
      }
      return item
    })
  }
  // 统计高亮项
  recordHighlight = (data, highlightValue, count = []) => {
    data.forEach(item => {
      if (typeof item.title === 'string' && item.title.includes(highlightValue)) {
        count.push(item)
      }
      if (item.children) {
        this.recordHighlight(item.children, highlightValue, count)
      }
    })
    return count
  }
  renderSwitcher = expanded => {
    const { prefixCls, openIcon, closeIcon, showLine } = this.props
    const switcherClsName = classNames(
      `${prefixCls}-switcher`,
      'hi-icon',
      `icon-${
        expanded
          ? openIcon || (showLine && 'TreeMinus') || 'open'
          : closeIcon || (showLine && 'TreePlus') || 'packup'
      }`
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
    const node = findNode(itemId, dataCache)
    this.props.onSave(node, _dataCache)
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
        const sourceNode = findNode(sourceItemId, allData)
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
  // 异步加载子节点
  loadChildren = itemId => {
    const { origin } = this.props
    const { method, url, headers, data, params, transformResponse } = origin
    const { dataCache } = this.state
    const that = this
    axios({
      method: method,
      url: url,
      headers,
      data,
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' })
      }
    })
      .then(function (res) {
        const _dataCache = cloneDeep(dataCache)
        const node = findNode(itemId, _dataCache)
        if (!node.children) {
          node.children = transformResponse(res.data)
          that.setState({
            dataCache: _dataCache
          })
        }
      })
      .catch(error => {
        transformResponse(error)
      })
  }
  switchDropNode = (targetItemId, sourceItemId, data, allData, dropDividerPosition) => {
    const sourceNode = findNode(sourceItemId, allData)
    const _data = [...data]
    _data.forEach((item, idx) => {
      if (item.id === targetItemId) {
        const position = dropDividerPosition === 'down' ? idx + 1 : idx
        data.splice(position, 0, sourceNode)
      } else {
        if (item.children) {
          if (item.children.some(e => e.id === targetItemId)) {
            const index = item.children.findIndex(i => i.id === targetItemId)
            const position = dropDividerPosition === 'down' ? index + 1 : index
            item.children.splice(position, 0, sourceNode)
          } else {
            this.switchDropNode(
              targetItemId,
              sourceItemId,
              item.children,
              allData,
              dropDividerPosition
            )
          }
        }
      }
    })
  }
  dropNode = (sourceItem, targetItem, dropDividerPosition) => {
    const { dataCache } = this.state
    const _dataCache = cloneDeep(dataCache)
    this._delDragNode(sourceItem.id, _dataCache)
    if (dropDividerPosition === 'sub') {
      // 这里为什么用 sourceItem.id不用 sourceItem 是因为 sourceItem 有可能是 highlight 过得
      this._addDropNode(targetItem.id, sourceItem.id, _dataCache, dataCache)
    } else {
      this.switchDropNode(targetItem.id, sourceItem.id, _dataCache, dataCache, dropDividerPosition)
    }
    const _sourceItem = findNode(sourceItem.id, dataCache)
    const _targetItem = findNode(targetItem.id, dataCache)
    if (this.props.onDrop) {
      if (this.props.onDrop(_sourceItem, _targetItem)) {
        this.props.onDropEnd(_sourceItem, _targetItem)
        this.setState({
          dataCache: _dataCache
        })
      }
    } else {
      this.props.onDropEnd(_sourceItem, _targetItem)
      this.setState({
        dataCache: _dataCache
      })
    }
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
    const node = findNode(itemId, dataCache)
    this.props.onDelete(node, _dataCache)
  }
  // 渲染右键菜单
  renderRightClickMenu = item => {
    const { localeDatas } = this.props
    const { addNode, addChildNode, edit, del } = localeDatas.tree
    return (
      item.id === this.state.showRightClickMenu && (
        <ul className='right-click-menu'>
          <li onClick={() => this.addSiblingNode(item.id)}>{addNode}</li>
          <li onClick={() => this.addChildNode(item)}>{addChildNode}</li>
          <li onClick={() => this.editNode(item)}>{edit}</li>
          <li
            onClick={() => {
              this.setCurrentDeleteNode(item.id)
              this.openModal()
            }}
          >
            {del}
          </li>
        </ul>
      )
    )
  }
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
  setTargetNode = (id, position) => {
    this.setState({ targetNode: id, dropDividerPosition: position })
  }
  removeTargetNode = () => {
    this.setState({ targetNode: null })
  }
  openModal = () => {
    this.setState({
      showModal: true
    })
  }
  setCurrentDeleteNode = nodeId => {
    this.setState({
      currentDeleteNode: nodeId
    })
  }
  renderTree = (data, allData = []) => {
    const {
      draggable,
      prefixCls,
      semiChecked,
      onClick,
      highlightable,
      checkable,
      closeExpandedTreeNode,
      expandTreeNode,
      onCheckChange,
      onExpanded,
      editable,
      checked,
      expanded,
      origin,
      onDragStart,
      showLine
    } = this.props
    const {
      highlight,
      editNodes,
      editingNodes,
      draggingNode,
      targetNode,
      dropDividerPosition,
      positionX,
      positionY
    } = this.state
    return (
      <ul>
        {data.map((item, index) => {
          return (
            <TreeItem
              origin={origin}
              showLine={showLine}
              key={item.id}
              isRoot={allData.some(d => d.id === item.id)}
              isLevelLast={index === data.length - 1}
              editable={editable}
              dropDividerPosition={dropDividerPosition}
              prefixCls={prefixCls}
              draggable={draggable}
              onDragStart={onDragStart}
              checked={!!checked.includes(item.id)}
              highlight={highlight}
              highlightable={highlightable}
              editNodes={editNodes}
              editingNodes={editingNodes}
              expanded={!!expanded.includes(item.id)}
              expandTreeNode={expandTreeNode}
              itemStyle={classNames(checkable && 'has_checkbox')}
              semiChecked={semiChecked}
              checkable={checkable}
              onExpanded={onExpanded}
              onValueChange={this.onValueChange}
              renderTree={this.renderTree}
              setPosition={this.setPosition}
              positionX={positionX}
              positionY={positionY}
              renderSwitcher={this.renderSwitcher}
              cancelAddSiblingNode={this.cancelAddSiblingNode}
              renderRightClickMenu={this.renderRightClickMenu}
              onCheckChange={onCheckChange}
              saveEditNode={this.saveEditNode}
              renderItemIcon={this.renderItemIcon}
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
              cancelEditNode={this.cancelEditNode}
              item={item}
              loadChildren={this.loadChildren}
            />
          )
        })}
      </ul>
    )
  }
  render () {
    const { dataCache, searchValue, highlightNum } = this.state
    const { searchable, localeDatas } = this.props
    const { searchPlaceholder, searchEmptyResult, modalTitle, delTips } = localeDatas.tree
    return (
      <div>
        {searchable && (
          <div className='hi-tree__searcher'>
            <Input
              value={this.state.searchValue}
              type='text'
              placeholder={searchPlaceholder}
              onChange={e => {
                this.setState({
                  searchValue: e.target.value,
                  highlightNum: this.recordHighlight(dataCache, e.target.value, []).length
                })

                this.props.setExpandTreeNodes(
                  collectExpandId(dataCache, e.target.value, [], dataCache)
                )
              }}
              append={<Icon name='search' style={{ color: '#4284F5', fontSize: '24px' }} />}
              style={{ width: '272px' }}
            />
            {highlightNum === 0 && searchValue !== '' && (
              <div className='hi-tree__searcher--empty'>{searchEmptyResult}</div>
            )}
          </div>
        )}

        {searchable
          ? this.renderTree(this.highlightData(cloneDeep(dataCache), searchValue), dataCache)
          : this.renderTree(cloneDeep(dataCache), dataCache)}

        <Modal
          title={modalTitle}
          show={this.state.showModal}
          onConfirm={() => {
            this.deleteNode(this.state.currentDeleteNode)
            this.setState({
              showModal: false
            })
          }}
          onCancel={() => {
            this.setState({
              showModal: false
            })
          }}
        >
          <span>{delTips}</span>
        </Modal>
      </div>
    )
  }
}
export default Provider(TreeNode)
