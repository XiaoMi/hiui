import React, { Component } from 'react'
import Checkbox from '../checkbox/index'
import classNames from 'classnames'

export default class TreeNode extends Component {
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
    this.props[name].map((item) => {
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

  renderSwitcher = (expanded) => {
    const { prefixCls, openIcon, closeIcon } = this.props
    const switcherClsName = classNames(`${prefixCls}-switcher`, 'hi-icon', `icon-${expanded ? (closeIcon || 'minus') : (openIcon || 'plus')}`)
    return (
      <i className={switcherClsName} />
    )
  }

  renderItemIcon = () => {
    const { prefixCls, itemIcon } = this.props
    const switcherClsName = classNames(`${prefixCls}-switcher`, 'hi-icon', `icon-${itemIcon || 'document'}`)
    return (
      <i
        className={switcherClsName}
      />
    )
  }

  renderTree (data) {
    const { draggable, prefixCls, dragNodePosition, dragNode, withLine } = this.props

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

          const itemContainerStyle = classNames(
            withLine && 'with-line'
          )

          return (<li
            onDragStart={this.onDragStart.bind(this, item, data)}
            onDragEnter={this.onDragEnter.bind(this, item, data)}
            onDragOver={this.onDragOver.bind(this, item, data)}
            onDragLeave={this.onDragLeave.bind(this, item, data)}
            onDrop={this.onDrop.bind(this, item, data)}
            draggable={draggable}
            key={item.id}
            className={itemContainerStyle}
          >
            <span onClick={() => this.onExpanded(expanded, item)} className={`${prefixCls}_item-icon`}>{item.children && item.children.length > 0 ? this.renderSwitcher(expanded) : (withLine && this.renderItemIcon())}</span>

            {this.props.checkable ? <Checkbox
              checked={checked}
              onChange={() => this.onCheckChange(checked, item)}
              disabled={item.disabled} /> : null}

            <span style={item.style} className={`${prefixCls}_item-text ${itemStyle}`}>{this.renderText(item.title)}</span>
            {item.children && item.children.length > 0 && expanded ? this.renderTree(item.children) : null}
          </li>)
        })}
      </ul>
    )
  }
  renderText (text) {
    return text
  }
  render () {
    const {data} = this.props
    return (
      <div>
        {this.renderTree(data)}
      </div>
    )
  }
}
