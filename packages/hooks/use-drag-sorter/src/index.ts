import React, { useState, useCallback, useRef } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { ValueOf } from '@hi-ui/core'
import { isFunction } from '@hi-ui/type-assertion'

/**
 * TODO: What is useDragSorter
 */
export const useDragSorter = ({
  draggable,
  onDragStart: onDragStartProp,
  onDragOver: onDragOverProp,
  onDragLeave: onDragLeaveProp,
  onDragEnd: onDragEndProp,
  onDrop: onDropProp,
  hover,
  idFieldName = 'id',
  dataTransferKey = 'data',
}: UseDragSorterProps) => {
  const [dragId, setDragId] = useState<React.ReactText | null>(null)
  const [dragDirection, setDragDirection] = useState<UseDragSorterNodeDirection>()
  const dragInfoRef = useRef<any>(null)

  const onDragStartPropLatest = useLatestCallback(onDragStartProp)
  const onDragStart = useCallback(
    (evt, item) => {
      if (!draggable) return

      evt.stopPropagation()

      const clientY = evt.clientY
      const dragId = item[idFieldName]

      console.log(item, idFieldName)

      dragInfoRef.current = {
        startClientY: clientY,
        dragId,
        dragItem: item,
      }

      setDragId(dragId)

      evt.dataTransfer.setData(dataTransferKey, JSON.stringify({ sourceId: dragId }))

      onDragStartPropLatest(evt, item)
    },
    [draggable, onDragStartPropLatest, idFieldName, dataTransferKey]
  )

  const hoverLatestRef = useLatestRef(hover)
  const onDragOverPropLatest = useLatestCallback(onDragOverProp)
  const onDragOver = useCallback(
    (evt, item) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      if (!dragInfoRef.current) return

      const { startClientY, dragId } = dragInfoRef.current

      if (dragId === item[idFieldName]) return

      const hoverClientY = evt.clientY
      let nextDirection: undefined | UseDragSorterNodeDirection

      if (isFunction(hoverLatestRef.current)) {
        nextDirection = hoverLatestRef.current(evt, item, dragInfoRef.current)
      } else {
        nextDirection =
          hoverClientY < startClientY
            ? UseDragSorterNodeDirection.BEFORE
            : UseDragSorterNodeDirection.AFTER
      }

      setDragDirection(nextDirection)
      onDragOverPropLatest(evt, item)
    },
    [draggable, onDragOverPropLatest, idFieldName, hoverLatestRef]
  )

  const onDragLeavePropLatest = useLatestCallback(onDragLeaveProp)
  const onDragLeave = useCallback(
    (evt: React.DragEvent, item) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      setDragDirection(undefined)
      onDragLeavePropLatest(evt, item)
    },
    [draggable, onDragLeavePropLatest]
  )

  const onDragEndPropLatest = useLatestCallback(onDragEndProp)
  const onDragEnd = useCallback(
    (evt: React.DragEvent, item) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      evt.dataTransfer.clearData()
      dragInfoRef.current = null
      setDragDirection(undefined)
      setDragId(null)

      onDragEndPropLatest(evt, item)
    },
    [draggable, dragInfoRef, onDragEndPropLatest]
  )

  const onDropPropLatest = useLatestCallback(onDropProp)
  // 放置目标元素时触发事件
  const onDrop = useCallback(
    (evt: React.DragEvent, item) => {
      if (!draggable) return
      if (!dragInfoRef.current) return

      const { dragId } = dragInfoRef.current

      evt.preventDefault()
      evt.stopPropagation()

      setDragDirection(undefined)
      dragInfoRef.current = null

      const targetId = item[idFieldName]

      if (dragId === targetId) return

      try {
        const { sourceId } = JSON.parse(evt.dataTransfer.getData(dataTransferKey))

        onDropPropLatest(sourceId, targetId, dragDirection)
      } catch (error) {
        console.error(error)
      }
    },
    [draggable, dragInfoRef, idFieldName, onDropPropLatest, dragDirection, dataTransferKey]
  )

  const getDropDirection = useCallback(
    (id) => {
      console.log('getDropDirection', dragId, dragDirection, id)

      return dragId !== id ? dragDirection : undefined
    },
    [dragDirection, dragId]
  )

  const getDragTriggerProps = useCallback(
    (props) => {
      return {
        draggable,
        onDragStart: (evt: any) => onDragStart(evt, props.item),
        onDragLeave: (evt: any) => onDragLeave(evt, props.item),
        onDragEnd: (evt: any) => onDragEnd(evt, props.item),
      }
    },
    [draggable, onDragStart, onDragLeave, onDragEnd]
  )

  const getDropTriggerProps = useCallback(
    (props) => {
      const direction = getDropDirection(props.item[idFieldName])

      console.log('direction', direction)

      return {
        'data-drop-direction': direction,
        onDrop: (evt: any) => onDrop(evt, props.item),
        onDragOver: (evt: any) => onDragOver(evt, props.item),
      }
    },
    [onDrop, onDragOver, getDropDirection, idFieldName]
  )

  return {
    dragging: dragId !== null,
    dragId,
    direction: dragDirection,
    getDragTriggerProps,
    getDropTriggerProps,
  }
}

export interface UseDragSorterProps {
  /**
   * 节点可拖拽
   */
  draggable?: boolean
  /**
   * 节点开始拖拽时触发
   */
  onDragStart?: (evt: React.DragEvent, dragItem: any) => void
  /**
   * 节点结束拖拽时触发
   */
  onDragEnd?: (evt: React.DragEvent, dragItem: any) => void
  /**
   * 节点放开时触发，返回 true 表示允许更新拖拽后数据
   */
  onDrop?: (evt: React.DragEvent, dragItem: any, dropItem: any) => boolean | Promise<any>
  /**
   * 节点拖拽成功时触发，`onDrop` 不拦截或者返回 `false` 才会触发
   */
  onDropEnd?: (evt: React.DragEvent, dragItem: any, dropItem: any) => void
  /**
   * 节点 drag leaver 时调用
   */
  onDragLeave?: (evt: React.DragEvent, dragItem: any) => void
  /**
   * 节点 drag over 时调用
   */
  onDragOver?: (evt: React.DragEvent, dragItem: any) => void
  idFieldName?: string
  hover?: (evt: React.DragEvent, targetItem: any, dragInfo: any) => UseDragSorterNodeDirection
  dataTransferKey?: string
}

export type UseDragSorterReturn = ReturnType<typeof useDragSorter>

// 表示拖拽放置位置
export const UseDragSorterNodeDirection = {
  BEFORE: 'before',
  INSIDE: 'inside',
  AFTER: 'after',
} as const

// eslint-disable-next-line no-redeclare
export type UseDragSorterNodeDirection = ValueOf<typeof UseDragSorterNodeDirection> | null
