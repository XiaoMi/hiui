import React, { Component } from 'react'
import Checkbox from '../table/checkbox/index'
import { DragSource, DropTarget } from 'react-dnd'
import Input from '../input'
import { findDOMNode } from 'react-dom'
import TreeDivider from './TreeDivider'
const Types = {
  TreeNode: 'treeNode'
}
class TreeItem extends Component {
  render () {
    const {
      dropDividerPosition,
      // setDraggingNode,
      // removeDraggingNode,
      checked,
      expanded,
      // dropNode,
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
      draggingNode,
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
      connectDragSource,
      connectDropTarget,
      targetNode
    } = this.props
    return connectDropTarget(
      connectDragSource(
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
          {targetNode === item.id && dropDividerPosition === 'down' && <TreeDivider top />}
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
              } ${draggingNode === item.id ? 'dragging' : ''}`}
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
              {targetNode === item.id && dropDividerPosition === 'sub' && <TreeDivider />}
            </span>
          )}
          {item.children && item.children.length > 0 && expanded ? renderTree(item.children) : null}
        </li>
      )
    )
  }
}
const source = {
  beginDrag (props) {
    // 开始拖拽前，如果已经展开，则需要收起
    if (props.expanded) {
      props.closeExpandedTreeNode(props.item.id)
    }
    return { sourceItem: props.item, originalExpandStatus: props.expanded }
  }
}
const target = {
  // canDrop () {
  //   return true
  // },
  drop (props, monitor) {
    const { sourceItem, originalExpandStatus } = monitor.getItem()
    const {
      item: targetItem,
      dropNode,
      removeDraggingNode,
      expandTreeNode,
      removeTargetNode,
      dropDividerPosition
    } = props

    // 先看下是不是在最近得组件
    if (monitor.isOver({ shallow: true })) {
      // 1.移入该组件时则其及其所有祖先组件全部展开，移出时，恢复原状
      if (
        sourceItem.id === targetItem.id ||
        (targetItem.children && targetItem.children.map(t => t.id).includes(sourceItem.id)) ||
        (sourceItem.children && sourceItem.children.map(s => s.id).includes(targetItem.id))
      ) {
        // 2.如果源节点就是目的节点或者源节点是目的节点的子节点（直系）再或者源节点是目的节点的父节点，那么什么都不做
        // 如果什么都不做，原来展开则现在还展开
        if (originalExpandStatus) {
          expandTreeNode(sourceItem.id)
        }
        removeDraggingNode()
        removeTargetNode()
      } else {
        // // 3.移动节点到相应位置
        // console.log('>>>>>>>>>>>>>>>>', targetItem, sourceItem)
        dropNode(sourceItem, targetItem, dropDividerPosition)
        removeDraggingNode()
        removeTargetNode()
      }
    }
  },
  hover (props, monitor, component) {
    const { sourceItem } = monitor.getItem()
    const { item: targetItem, setDraggingNode, setTargetNode } = props

    // 先看下是不是在最近得组件
    if (monitor.isOver({ shallow: true })) {
      // 1.移入该组件时则其及其所有祖先组件全部展开，移出时，恢复原状
      if (
        sourceItem.id === targetItem.id ||
        (targetItem.children && targetItem.children.map(t => t.id).includes(sourceItem.id)) ||
        (sourceItem.children && sourceItem.children.map(s => s.id).includes(targetItem.id))
      ) {
        // 2.如果源节点就是目的节点或者源节点是目的节点的子节点（直系）再或者源节点是目的节点的父节点，那么什么都不做
        return false
      } else {
        const sourcePosition = monitor.getClientOffset()
        const targetComponent = findDOMNode(component).getBoundingClientRect()
        // 如果在节点的上半部分，则为移动其内部，如果为下半部分，则为节点下方
        console.log(
          '>>>>>>>>>>>>>>>>',
          targetItem.id,
          sourceItem.id,
          sourcePosition,
          targetComponent
        )
        // // 3.移动节点到相应位置
        // console.log()
        if (sourcePosition.y <= targetComponent.y + targetComponent.height / 2) {
          setTargetNode(targetItem.id, 'sub')
        } else {
          setTargetNode(targetItem.id, 'down')
        }

        setDraggingNode(sourceItem.id)
      }
    }
  }
}
function sourceCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
function targetCollect (connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}
export default DropTarget(Types['TreeNode'], target, targetCollect)(
  DragSource(Types['TreeNode'], source, sourceCollect)(TreeItem)
)
