import React, { Component } from 'react'
import {CheckboxLegacy as Checkbox} from '../../../checkbox'
import { DragSource, DropTarget } from 'react-dnd'
import classNames from 'classnames'
import Input from '../../../input'
import { findDOMNode } from 'react-dom'
import TreeDivider from './TreeDivider'
import IconLoading from './IconLoading'
import Provider from '../../../context'
const Types = {
  TreeNode: 'treeNode'
}
class TreeItem extends Component {
  state={ loading: false }
  loadingTimer = null
  componentWillUnmount () {
    clearTimeout(this.loadingTimer)
  }
  render () {
    const {
      level,
      editable,
      draggable,
      direction,
      checked,
      expanded,
      highlight,
      editNodes,
      editingNodes,
      prefixCls,
      semiChecked,
      onClick,
      highlightable,
      item,
      checkable,
      itemStyle,
      onExpanded,
      onValueChange,
      cancelEditNode,
      cancelAddSiblingNode,
      renderTree,
      onCheckChange,
      onSetHighlight,
      showRightClickMenu,
      closeRightClickMenu,
      renderSwitcher,
      connectDragSource,
      connectDropTarget,
      isOver,
      isDragging,
      saveEditNode,
      origin,
      loadChildren,
      isRoot,
      showLine,
      localeDatas,
      apperance,
      theme
    } = this.props

    const themeColor = {
      'orange': '#f63',
      'cyan': '#46bc99',
      'magenta': '#ff5975',
      'lavender': '#b450de',
      'blue': '#3da8f5',
      'purple': '#8a8acb',
      'hiui-blue': '#4284f5'
    }
    const { nodePlaceholder, confirm, cancel } = localeDatas.tree
    const treeItem = (
      <li
        key={item.id}
        className={classNames(
          { 'is-root': isRoot },
          {
            'no-expanded':
              !item.children || item.children.length === 0 || (item.children && !expanded)
          }
        )}
      >
        { direction === 'up' && isOver && (
          <TreeDivider placement='top' theme={theme} />
        )}
        <div
          className={classNames('item__wrapper', {
            'can-expand': item.children && item.children.length > 0,
            'item__wrapper--expanded': expanded
          })}
        >
          {(!item.children || (item.children && !expanded)) &&
            direction === 'down' &&
            isOver && <TreeDivider theme={theme} placement='bottom' />}
          {
            <span
              onClick={() => {
                onExpanded(expanded, item)
                if (origin && (!item.children || item.children.length === 0)) {
                  this.setState({loading: true})
                  loadChildren(item.id).finally(() => {
                    this.loadingTimer = setTimeout(() => {
                      this.setState({loading: false})
                    }, 300)
                  })
                }
              }}
              style={{ position: 'relative' }}
              className={`${prefixCls}_item-icon`}
            >
              {(item.children && item.children.length > 0) || (origin && !expanded)
                ? renderSwitcher(expanded)
                : ((showLine && <span className='hi-tree-legacy__dot' />) || (apperance === 'folder' && <i className='hi-icon icon-File' />))}
              {this.state.loading && <IconLoading theme={theme} />}
            </span>
          }
          {checkable ? (
            <Checkbox
              semi={semiChecked.includes(item.id)}
              checked={checked}
              onChange={() => onCheckChange(checked, item)}
              onTitleClick={e => {
                if (item.disabled) {
                  return false
                }
                onClick && onClick(item)
                highlightable && onSetHighlight(item)
                e.stopPropagation()
              }}
              highlight={highlight === item.id}
              text={item.title}
              disabled={item.disabled}
            />
          ) : item.status === 'editable' || editNodes.map(node => node.id).includes(item.id) ? (
            <div className='editing'>
              <Input
                placeholder={nodePlaceholder}
                value={(editingNodes.find(node => node.id === item.id) || {}).title}
                onChange={e => {
                  onValueChange(e.target.value, item.id)
                }}
              />
              <span
                style={(editingNodes.find(node => node.id === item.id) || {}).title === '' ? { marginRight: 12, color: '#999', cursor: 'not-allowed' } : { cursor: 'pointer', marginRight: 12, color: themeColor[theme] }}
                onClick={() => {
                  if ((editingNodes.find(node => node.id === item.id) || {}).title !== '') {
                    saveEditNode(item.id, level)
                  }
                }}
              >
                {confirm}
              </span>
              <span
                style={{ cursor: 'pointer', color: '#999' }}
                onClick={() => {
                  if (editNodes.map(node => node.id).includes(item.id)) {
                    cancelEditNode(item.id)
                  } else {
                    cancelAddSiblingNode(item.id)
                  }
                }}
              >
                {cancel}
              </span>
            </div>
          ) : draggable ? (
            connectDragSource(
              <span
                style={item.style}
                className={`${prefixCls}_item-text ${itemStyle} ${
                  highlight === item.id ? 'highlight' : ''
                } ${isDragging ? 'dragging' : ''} ${item.disabled ? prefixCls + '_item-text--disabled' : ''}`}
                onContextMenu={e => {
                  if (item.disabled) {
                    return false
                  }
                  if (editable) {
                    e.preventDefault()
                    showRightClickMenu(item, e, level)
                  }
                }}
                onClick={e => {
                  if (item.disabled) {
                    return false
                  }
                  closeRightClickMenu()
                  onClick && onClick(item)
                  highlightable && onSetHighlight(item)
                  e.stopPropagation()
                }}
              >
                {item.title}
                {/* {renderRightClickMenu(item)} */}
                { direction === 'sub' && isOver && (
                  <TreeDivider placement='inner' theme={this.props.theme} />
                )}
              </span>
            )
          ) : (
            <span
              style={item.style}
              className={`${prefixCls}_item-text ${itemStyle} ${
                highlight === item.id ? 'highlight' : ''
              } ${isDragging ? 'dragging' : ''} ${item.disabled ? prefixCls + '_item-text--disabled' : ''}`}
              onContextMenu={e => {
                if (item.disabled) {
                  return false
                }
                if (this.props.editable) {
                  e.preventDefault()
                  showRightClickMenu(item, e, level)
                }
              }}
              onClick={e => {
                if (item.disabled) {
                  return false
                }
                closeRightClickMenu()
                onClick && onClick(item)
                highlightable && onSetHighlight(item)
                e.stopPropagation()
              }}
            >
              {item.title}
              {/* {renderRightClickMenu(item)} */}
            </span>
          )}
        </div>
        {item.children && item.children.length > 0 && expanded ? renderTree(item.children, [], level + 1) : null}
        {item.children &&
          expanded &&

          direction === 'down' &&
          isOver && <TreeDivider placement='bottom' theme={this.props.theme} />}
      </li>
    )
    return draggable ? connectDropTarget(treeItem) : treeItem
  }
}
const source = {
  beginDrag (props) {
    // 开始拖拽前，如果已经展开，则需要收起
    if (props.expanded) {
      props.closeExpandedTreeNode(props.item.id)
    }
    props.onDragStart(props.item)
    return { sourceItem: props.item, originalExpandStatus: props.expanded, sourceLevel: props.level }
  }
}
const target = {
  drop (props, monitor) {
    const { sourceItem, originalExpandStatus, sourceLevel } = monitor.getItem()
    const {
      item: targetItem,
      dropNode,
      expandTreeNode,
      direction,
      level
    } = props
    // 先看下是不是在最近得组件
    if (monitor.isOver({ shallow: true })) {
      if (
        sourceItem.id === targetItem.id ||
        (targetItem.children &&
          targetItem.children.map(t => t.id).includes(sourceItem.id) &&
          direction === 'sub')
      ) {
        // 如果源节点就是目的节点或者源节点是目的节点的子节点（直系）再或者源节点是目的节点的父节点，那么什么都不做
        // 如果什么都不做，原来展开则现在还展开
        if (originalExpandStatus) {
          expandTreeNode(sourceItem.id)
        }
      } else {
        // 移动节点到相应位置
        dropNode(sourceItem, targetItem, direction, {before: sourceLevel, after: level})
      }
    }
  },
  hover (props, monitor, component) {
    const {
      setDirection
    } = props
    // 先看下是不是在最近得组件
    if (monitor.isOver({ shallow: true })) {
      const sourcePosition = monitor.getClientOffset()
      const targetComponent = findDOMNode(component).getBoundingClientRect()
      if (sourcePosition.y <= targetComponent.y + targetComponent.height / 3) {
        setDirection('up')
      } else if (
        targetComponent.y + targetComponent.height / 3 < sourcePosition.y &&
        sourcePosition.y <= targetComponent.y + (targetComponent.height * 2) / 3
      ) {
        setDirection('sub')
      } else {
        setDirection('down')
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
function targetCollect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true })
  }
}

const DraggableTreeItem = DropTarget(Types['TreeNode'], target, targetCollect)(
  DragSource(Types['TreeNode'], source, sourceCollect)(TreeItem)
)
const HOCTreeItem = TreeItemComponent => {
  return class WrapperTreeItem extends Component {
    state={direction: null}
    setDirection = (direction) => {
      this.setState({direction})
    }
    render () {
      const { draggable } = this.props

      return draggable ? (
        <DraggableTreeItem {...this.props} direction={this.state.direction} setDirection={this.setDirection} />
      ) : (
        <TreeItemComponent {...this.props} />
      )
    }
  }
}
export default Provider(HOCTreeItem(TreeItem))
