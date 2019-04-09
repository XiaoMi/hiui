import React, { Component } from 'react'
import Checkbox from '../table/checkbox/index'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
export default class TreeNode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      highlight: null,
      showRightClickMenu: null,
      dataCache: [],
      prevData: []
    }
  }
  static getDerivedStateFromProps (props, state) {
    console.log('************', state.dataCache)
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

  onExpanded (expanded, item) {
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

  // 添加兄弟节点
  _addSibNode = (itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index + 1, 0, { id: '', title: '测试' })
      } else {
        if (d.children) {
          this._addSibNode(itemId, d.children)
        }
      }
    })
  }

  addSiblingNode = itemId => {
    console.log('^^^', itemId)
    const { dataCache } = this.state
    console.log(dataCache)
    const _dataCache = cloneDeep(dataCache)
    this._addSibNode(itemId, _dataCache)
    console.log(_dataCache)
    this.setState({ dataCache: _dataCache })
  }
  // 添加子节点
  addChildNode = itemId => {}
  // 编辑节点
  editNode = itemId => {}
  // 删除节点
  deleteNode = itemId => {}
  // 渲染右键菜单
  renderRightClickMenu = itemId => {
    return (
      itemId === this.state.showRightClickMenu &&
      <ul className='right-click-menu'>
        <li onClick={() => this.addSiblingNode(itemId)}>添加节点</li>
        <li onClick={() => this.addChildNode()}>添加子节点</li>
        <li onClick={() => this.editNode()}>编辑</li>
        <li onClick={() => this.deleteNode()}>删除</li>
      </ul>
    )
  }
  renderTree (data) {
    const {
      draggable,
      prefixCls,
      dragNodePosition,
      dragNode,
      withLine,
      semiChecked,
      onNodeClick,
      onClick,
      highlightable
    } = this.props
    const { highlight } = this.state
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
            <li
              onDragStart={this.onDragStart.bind(this, item, data)}
              onDragEnter={this.onDragEnter.bind(this, item, data)}
              onDragOver={this.onDragOver.bind(this, item, data)}
              onDragLeave={this.onDragLeave.bind(this, item, data)}
              onDrop={this.onDrop.bind(this, item, data)}
              draggable={draggable}
              key={item.id}
              className={itemContainerStyle}
            >
              <span
                onClick={() => this.onExpanded(expanded, item)}
                className={`${prefixCls}_item-icon`}
              >
                {item.children && item.children.length > 0
                  ? this.renderSwitcher(expanded)
                  : withLine && this.renderItemIcon()}
              </span>

              {this.props.checkable
                ? <Checkbox
                  semi={semiChecked.includes(item.id)}
                  checked={checked}
                  onChange={() => this.onCheckChange(checked, item)}
                  onTitleClick={e => {
                    onNodeClick && onNodeClick(item)
                    onClick && onClick(item)
                    highlightable &&
                        this.setState({
                          highlight: item.id
                        })
                    e.stopPropagation()
                  }}
                  highlight={highlight === item.id}
                  text={item.title}
                  disabled={item.disabled}
                />
                : <span
                  style={item.style}
                  className={`${prefixCls}_item-text ${itemStyle} ${highlight === item.id
                    ? 'highlight'
                    : ''}`}
                  onContextMenu={e => {
                    //
                    // if (this.props.editable) {
                    //   e.preventDefault()
                    // }
                    e.preventDefault()
                    this.setState({
                      showRightClickMenu: item.id,
                      highlight: item.id
                    })
                  }}
                  onClick={e => {
                    this.setState({
                      showRightClickMenu: null
                    })
                    onNodeClick && onNodeClick(item)
                    onClick && onClick(item)
                    highlightable &&
                        this.setState({
                          highlight: item.id
                        })
                    e.stopPropagation()
                  }}
                >
                  {this.renderText(item.title)}
                  {this.renderRightClickMenu(item.id)}
                </span>}
              {item.children && item.children.length > 0 && expanded
                ? this.renderTree(item.children)
                : null}
            </li>
          )
        })}
      </ul>
    )
  }
  renderText (text) {
    return text
  }
  render () {
    const { dataCache } = this.state
    return (
      <div>
        {this.renderTree(dataCache)}
      </div>
    )
  }
}
