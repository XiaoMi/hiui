import React, { Component } from 'react'
import Checkbox from '../table/checkbox/index'
import { DragSource } from 'react-dnd'
import Input from '../input'
const Types = {
  TreeNode: 'treeNode'
}
class TreeItem extends Component {
  render () {
    const {
      checked,
      expanded,
      // draggable,
      highlight,
      editNodes,
      editingNodes,
      prefixCls,
      // dragNodePosition,
      // dragNode,
      withLine,
      semiChecked,
      onNodeClick,
      onClick,
      highlightable,
      item,
      // data,
      checkable,
      itemContainerStyle,
      itemStyle,
      onExpanded,
      onValueChange,
      renderItemIcon,
      saveEditNode,
      cancelEditNode,
      cancelAddSiblingNode,
      renderTree,
      renderRightClickMenu,
      renderText,
      onCheckChange,
      onSetHighlight,
      showRightClickMenu,
      closeRightClickMenu,
      renderSwitcher,
      connectDragSource
    } = this.props
    return connectDragSource(
      <li
        // onDragStart={this.onDragStart.bind(this, item, data)}
        // onDragEnter={this.onDragEnter.bind(this, item, data)}
        // onDragOver={this.onDragOver.bind(this, item, data)}
        // onDragLeave={this.onDragLeave.bind(this, item, data)}
        // onDrop={this.onDrop.bind(this, item, data)}
        // draggable={draggable}
        key={item.id}
        className={itemContainerStyle}
      >
        <span onClick={() => onExpanded(expanded, item)} className={`${prefixCls}_item-icon`}>
          {item.children && item.children.length > 0
            ? renderSwitcher(expanded)
            : withLine && renderItemIcon()}
        </span>

        {checkable ? (
          <Checkbox
            semi={semiChecked.includes(item.id)}
            checked={checked}
            onChange={() => onCheckChange(checked, item)}
            onTitleClick={e => {
              onNodeClick && onNodeClick(item)
              onClick && onClick(item)
              highlightable && onSetHighlight(item)
              // this.setState({
              //   highlight: item.id
              // })
              e.stopPropagation()
            }}
            highlight={highlight === item.id}
            text={item.title}
            disabled={item.disabled}
          />
        ) : item.status === 'editable' || editNodes.map(node => node.id).includes(item.id) ? (
          <div style={{ display: 'flex' }}>
            <Input
              placeholder='请输入菜单名称'
              value={(editingNodes.find(node => node.id === item.id) || {}).title}
              onChange={e => {
                onValueChange(e.target.value, item.id)
              }}
            />
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                saveEditNode(item.id)
              }}
            >
              确定
            </span>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (editNodes.map(node => node.id).includes(item.id)) {
                  cancelEditNode(item.id)
                } else {
                  cancelAddSiblingNode(item.id)
                }
              }}
            >
              取消
            </span>
          </div>
        ) : (
          <span
            style={item.style}
            className={`${prefixCls}_item-text ${itemStyle} ${
              highlight === item.id ? 'highlight' : ''
            }`}
            onContextMenu={e => {
              //
              // if (this.props.editable) {
              //   e.preventDefault()
              // }
              e.preventDefault()
              // this.setState({
              //   showRightClickMenu: item.id,
              //   highlight: item.id
              // })
              showRightClickMenu(item)
            }}
            onClick={e => {
              // this.setState({
              //   showRightClickMenu: null
              // })
              closeRightClickMenu()
              onNodeClick && onNodeClick(item)
              onClick && onClick(item)
              highlightable &&
                // this.setState({
                //   highlight: item.id
                // })
                onSetHighlight(item)
              e.stopPropagation()
            }}
          >
            {renderText(item.title)}
            {renderRightClickMenu(item)}
          </span>
        )}
        {item.children && item.children.length > 0 && expanded ? renderTree(item.children) : null}
      </li>
    )
  }
}
const treeNodeSource = {
  beginDrag (props) {
    return { id: props.item.id }
  }
}
function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
export default DragSource(Types['TreeNode'], treeNodeSource, collect)(TreeItem)
