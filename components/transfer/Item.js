import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Checkbox from '../checkbox'
import { DragSource, DropTarget } from 'react-dnd'
import classNames from 'classnames'
class Item extends Component {
  render () {
    const {
      mode,
      item,
      onClick,
      checkboxOnChange,
      checked,
      isDragging,
      connectDragSource,
      connectDropTarget,
      targetNode,
      sourceNode,
      dir,
      draggable,
      dividerPosition
    } = this.props
    const sourceStyle =
      sourceNode === item.id && isDragging
        ? {
          background: 'rgba(246,246,246,1)',
          color: 'rgba(204,204,204,1)'
        }
        : {}
    const itemCls = classNames('hi-transfer__item', item.disabled && 'hi-transfer__item--disabled')
    const el = (
      <li style={sourceStyle} className={itemCls} onClick={onClick.bind(this)}>
        {targetNode === item.id &&
          isDragging &&
          <div className={`hi-transfer__divider--${dividerPosition}`} />}
        {mode !== 'basic'
          ? <Checkbox
            legacy
            text={item.content}
            value={item.id}
            checked={checked}
            disabled={item.disabled}
            onChange={checkboxOnChange.bind(this)}
          />
          : item.content}
      </li>
    )
    return dir === 'right' && draggable ? connectDropTarget(connectDragSource(el)) : el
  }
}

const TYPE = 'CARD'
const source = {
  beginDrag (props) {
    props.setSourceNode(props.item.id)
    return {
      sourceItem: props.item
    }
  },

  isDragging (props, monitor) {
    return props.id === monitor.getItem().id
  }
}

const target = {
  canDrop (props, monitor) {
    return true
  },

  drop (props, monitor, component) {
    const { sourceItem } = monitor.getItem()
    const { item: targetItem, removeTargetNode, move } = props
    move(sourceItem, targetItem)
    removeTargetNode()
  },
  hover (props, monitor, component) {
    if (monitor.isOver({ shallow: true })) {
      const { item: targetItem, setTargetNode, positionX, positionY, setPosition } = props
      const sourcePosition = monitor.getClientOffset()
      const targetComponent = findDOMNode(component).getBoundingClientRect()
      if (!(sourcePosition.x === positionX && sourcePosition.y === positionY)) {
        setPosition(sourcePosition.x, sourcePosition.y)
        const dividerPosition =
          sourcePosition.y <= targetComponent.y + targetComponent.height / 2 ? 'up' : 'down'
        setTargetNode(targetItem.id, dividerPosition)
      }
    }
  }
}
const DragItem = DropTarget(TYPE, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(TYPE, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(Item)
)

const HOCItem = ItemComponent => {
  return class WrapperItem extends Component {
    render () {
      const { dir, draggable } = this.props

      return draggable && dir === 'right'
        ? <DragItem {...this.props} />
        : <ItemComponent {...this.props} />
    }
  }
}
export default HOCItem(Item)
