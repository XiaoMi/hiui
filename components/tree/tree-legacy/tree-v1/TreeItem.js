import React, { Component } from 'react'
import { CheckboxLegacy as Checkbox } from '../../../checkbox'
import { DragSource, DropTarget } from 'react-dnd'
import Input from '../../../input'
import { findDOMNode } from 'react-dom'
import TreeDivider from './TreeDivider'
const Types = {
  TreeNode: 'treeNode'
}
class TreeItem extends Component {
  render() {
    const {
      editable,
      draggable,
      dropDividerPosition,
      checked,
      expanded,
      highlight,
      editNodes,
      editingNodes,
      prefixCls,
      semiChecked,
      onNodeClick,
      onClick,
      highlightable,
      item,
      draggingNode,
      checkable,
      itemStyle,
      onExpanded,
      onValueChange,
      cancelEditNode,
      cancelAddSiblingNode,
      renderTree,
      renderRightClickMenu,
      onCheckChange,
      onSetHighlight,
      showRightClickMenu,
      closeRightClickMenu,
      renderSwitcher,
      connectDragSource,
      connectDropTarget,
      isOver,
      targetNode,
      saveEditNode,
      origin,
      loadChildren
    } = this.props
    const treeItem = (
      <li key={item.id}>
        <div className="item--wrapper">
          {targetNode === item.id && dropDividerPosition === 'down' && isOver && <TreeDivider top />}
          {
            <span
              onClick={() => {
                onExpanded(expanded, item)
                if (origin) {
                  loadChildren(item.id)
                }
              }}
              className={`${prefixCls}_item-icon`}
            >
              {((item.children && item.children.length > 0) || (origin && !expanded)) && renderSwitcher(expanded)}
            </span>
          }
          {checkable ? (
            <Checkbox
              semi={semiChecked.includes(item.id)}
              checked={checked}
              onChange={() => onCheckChange(checked, item)}
              onTitleClick={(e) => {
                onNodeClick && onNodeClick(item)
                onClick && onClick(item)
                highlightable && onSetHighlight(item)
                e.stopPropagation()
              }}
              highlight={highlight === item.id}
              text={item.title}
              disabled={item.disabled}
            />
          ) : item.status === 'editable' || editNodes.map((node) => node.id).includes(item.id) ? (
            <div className="editing">
              <Input
                placeholder="请输入菜单名称"
                value={(editingNodes.find((node) => node.id === item.id) || {}).title}
                onChange={(e) => {
                  onValueChange(e.target.value, item.id)
                }}
              />
              <span
                style={{ cursor: 'pointer', marginRight: 12, color: '#4284F5' }}
                onClick={() => {
                  saveEditNode(item.id)
                }}
              >
                确定
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (editNodes.map((node) => node.id).includes(item.id)) {
                    cancelEditNode(item.id)
                  } else {
                    cancelAddSiblingNode(item.id)
                  }
                }}
              >
                取消
              </span>
            </div>
          ) : draggable ? (
            connectDragSource(
              <span
                style={item.style}
                className={`${prefixCls}_item-text ${itemStyle} ${highlight === item.id ? 'highlight' : ''} ${
                  draggingNode === item.id ? 'dragging' : ''
                }`}
                onContextMenu={(e) => {
                  if (editable) {
                    e.preventDefault()
                    showRightClickMenu(item)
                  }
                }}
                onClick={(e) => {
                  closeRightClickMenu()
                  onNodeClick && onNodeClick(item)
                  onClick && onClick(item)
                  highlightable && onSetHighlight(item)
                  e.stopPropagation()
                }}
              >
                {item.title}
                {renderRightClickMenu(item)}
                {targetNode === item.id && dropDividerPosition === 'sub' && isOver && <TreeDivider />}
              </span>
            )
          ) : (
            <span
              style={item.style}
              className={`${prefixCls}_item-text ${itemStyle} ${highlight === item.id ? 'highlight' : ''} ${
                draggingNode === item.id ? 'dragging' : ''
              }`}
              onContextMenu={(e) => {
                if (this.props.editable) {
                  e.preventDefault()
                  showRightClickMenu(item)
                }
              }}
              onClick={(e) => {
                closeRightClickMenu()
                onNodeClick && onNodeClick(item)
                onClick && onClick(item)
                highlightable && onSetHighlight(item)
                e.stopPropagation()
              }}
            >
              {item.title}
              {renderRightClickMenu(item)}
            </span>
          )}
        </div>
        {item.children && item.children.length > 0 && expanded ? renderTree(item.children) : null}
      </li>
    )
    return draggable ? connectDropTarget(treeItem) : treeItem
  }
}
const source = {
  beginDrag(props) {
    // 开始拖拽前，如果已经展开，则需要收起
    if (props.expanded) {
      props.closeExpandedTreeNode(props.item.id)
    }
    props.onDragStart(props.item)
    return { sourceItem: props.item, originalExpandStatus: props.expanded }
  },
  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult()
    if (!dropResult) {
      const { removeTargetNode, removeDraggingNode } = props
      removeDraggingNode()
      removeTargetNode()
    }
  }
}
const target = {
  drop(props, monitor) {
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
      if (
        sourceItem.id === targetItem.id ||
        (targetItem.children && targetItem.children.map((t) => t.id).includes(sourceItem.id))
      ) {
        // 如果源节点就是目的节点或者源节点是目的节点的子节点（直系）再或者源节点是目的节点的父节点，那么什么都不做
        // 如果什么都不做，原来展开则现在还展开
        if (originalExpandStatus) {
          expandTreeNode(sourceItem.id)
        }
        removeDraggingNode()
        removeTargetNode()
      } else {
        // 移动节点到相应位置
        dropNode(sourceItem, targetItem, dropDividerPosition)
        removeDraggingNode()
        removeTargetNode()
      }
    }
  },
  hover(props, monitor, component) {
    const { sourceItem } = monitor.getItem()
    const { item: targetItem, setDraggingNode, setTargetNode, positionX, positionY, setPosition } = props
    // 先看下是不是在最近得组件
    if (monitor.isOver({ shallow: true })) {
      const sourcePosition = monitor.getClientOffset()
      const targetComponent = findDOMNode(component).getBoundingClientRect()
      if (!(sourcePosition.x === positionX && sourcePosition.y === positionY)) {
        setPosition(sourcePosition.x, sourcePosition.y)
        // 如果在节点的上半部分，则为移动其内部，如果为下半部分，则为节点下方
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
function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const DraggableTreeItem = DropTarget(
  Types.TreeNode,
  target,
  targetCollect
)(DragSource(Types.TreeNode, source, sourceCollect)(TreeItem))
const HOCTreeItem = (TreeItemComponent) => {
  return class WrapperTreeItem extends Component {
    render() {
      const { draggable } = this.props

      return draggable ? <DraggableTreeItem {...this.props} /> : <TreeItemComponent {...this.props} />
    }
  }
}
export default HOCTreeItem(TreeItem)
