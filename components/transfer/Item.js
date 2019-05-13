import React, { Component } from 'react'
import Checkbox from '../checkbox'
import { DragSource, DropTarget } from 'react-dnd'

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
      draggable
    } = this.props
    const sourceStyle =
      sourceNode === item.id && isDragging
        ? {
          background: 'rgba(246,246,246,1)',
          color: 'rgba(204,204,204,1)'
        }
        : {}
    const el = (
      <li style={sourceStyle} className='hi-transfer__item' onClick={onClick.bind(this)}>
        {targetNode === item.id && <div className='hi-transfer__underline' />}
        {mode !== 'basic' ? (
          <Checkbox
            text={item.content}
            value={item.id}
            checked={checked}
            onChange={checkboxOnChange.bind(this)}
          />
        ) : (
          item.content
        )}
      </li>
    )
    return (dir === 'right' && draggable) ? connectDropTarget(connectDragSource(el)) : el
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
    // const { sourceItem } = monitor.getItem()
    // const { item: targetItem } = props
    return true
  },

  drop (props, monitor, component) {
    const { sourceItem } = monitor.getItem()
    const { item: targetItem, removeTargetNode, move } = props
    move(sourceItem, targetItem)
    removeTargetNode()
    // const { item } = monitor.getItem()
    // const { id: dropId, contains } = props

    // props.move(item, dropId)
  },
  hover (props, monitor, component) {
    if (monitor.isOver({ shallow: true })) {
      const { item: targetItem, setTargetNode, positionX, positionY, setPosition } = props
      const sourcePosition = monitor.getClientOffset()
      console.log(positionX, positionY, sourcePosition.x, sourcePosition.y)
      if (!(sourcePosition.x === positionX && sourcePosition.y === positionY)) {
        setPosition(sourcePosition.x, sourcePosition.y)
        setTargetNode(targetItem.id)
      }
    }
  }
}
const DragItem = DropTarget(TYPE, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(TYPE, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }))(Item)
)

const HOCItem = ItemComponent => {
  return class WrapperItem extends Component {
    render () {
      const { dir, draggable } = this.props

      return draggable && dir === 'right' ? (
        <DragItem {...this.props} />
      ) : (
        <ItemComponent {...this.props} />
      )
    }
  }
}
export default HOCItem(Item)
// export default Item
