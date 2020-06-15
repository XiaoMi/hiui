import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const useDragAndDrop = ({ id, type = 'MENU_TREE', move, accept = 'MENU_TREE' }) => {
  const ref = useRef(null)
  const [direction, setDirection] = useState(null)

  const [{ isDragging }, drag] = useDrag({
    item: { id, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ isOver }, drop] = useDrop({
    accept: accept,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    }),
    hover: (item, monitor) => {
      //鼠标位置（source）
      if (ref.current && item.id !== id && monitor.isOver({ shallow: true })) {
        const clientOffset = monitor.getClientOffset()
        //目的节点范围
        const targetBoundingRect = ref.current.getBoundingClientRect()

        const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
        const hoverTargetInsideY = hoverTargetSortY * 2

        // 鼠标垂直移动距离
        const hoverClientY = clientOffset.y - targetBoundingRect.top

        if (hoverClientY < hoverTargetSortY) {
          setDirection('up')
        } else if (hoverClientY >= hoverTargetSortY && hoverClientY < hoverTargetInsideY) {
          setDirection('in')
        } else {
          setDirection('down')
        }
      }
    },
    drop: (item, monitor) => {
      if (ref.current && item.id !== id && monitor.isOver({ shallow: true })) {
        /* 拖拽的源和目标不能是一个
         * 拖拽的源不能是目标的祖先
         * 拖拽的目标必须是源接触的最近一层
         */
        //鼠标位置（source）
        const clientOffset = monitor.getClientOffset()
        //目的节点范围
        const targetBoundingRect = ref.current.getBoundingClientRect()

        const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
        const hoverTargetInsideY = hoverTargetSortY * 2

        // 鼠标垂直移动距离
        const hoverClientY = clientOffset.y - targetBoundingRect.top

        if (hoverClientY < hoverTargetSortY) {
          move(item, { id }, 'up')
        } else if (hoverClientY < hoverTargetInsideY) {
          move(item, { id }, 'in')
        } else {
          move(item, { id }, 'down')
        }
      }
    }
  })

  drag(drop(ref))
  return [{ isDragging, isOver, direction }, ref]
}

export default useDragAndDrop
