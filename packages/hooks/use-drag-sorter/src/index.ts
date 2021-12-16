import React, { useState, useCallback, useRef } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { ValueOf } from '@hi-ui/core'
import { isFunction } from '@hi-ui/type-assertion'

export const useDrop = ({
  draggable,
  onDropEnd,
  onSwap: onSwapProp,
  idFieldName = 'id',
}: UseDropProps) => {
  const dragInfoRef = useRef<any>(null)

  const onDropEndLatest = useLatestCallback(onDropEnd)
  const swapLatest = useLatestCallback(onSwapProp)

  const onSwap = useCallback(
    async (sourceId, targetId, dragDirection) => {
      if (!draggable) return
      if (targetId === sourceId) return
      if (!dragInfoRef.current) return

      // TODO： 根据 id 查询数据原始数据或者直接使用引用值，两者选择，避免bug
      const info = dragInfoRef.current
      dragInfoRef.current = null
      const { dragItem, dropItem } = info

      if (!dragItem || !dropItem) {
        // console.log('未找到任何节点(sourceNode, targetNode)', sourceNode, targetNode)
        return
      }

      if (dragItem[idFieldName] !== sourceId || targetId !== dropItem[idFieldName]) {
        return
      }

      const result = await swapLatest(dragItem, dropItem, dragDirection, info)

      if (result === true) {
        onDropEndLatest(dragItem, dropItem, dragDirection)
      }
    },
    [draggable, onDropEndLatest, idFieldName, swapLatest]
  )

  return {
    draggable,
    dragInfoRef,
    onSwap,
  }
}

export interface UseDropProps {
  /**
   * 节点可拖拽
   */
  draggable?: boolean
  /**
   * 节点拖拽成功时触发，`onDrop` 不拦截或者返回 `false` 才会触发
   */
  onDropEnd?: (dragItem: any, dropItem: any, direction: UseDropNodeDirection) => void
  /**
   * 配置式 id
   */
  idFieldName?: string
  /**
   * 数据交换
   */
  onSwap: (
    dragItem: any,
    dropItem: any,
    direction: UseDropNodeDirection,
    dropInfo: any
  ) => Promise<boolean>
}

export type UseDropPropsReturn = ReturnType<typeof useDrop>

/**
 * TODO: What is UseDrag
 */
export const useDrag = ({
  draggable,
  dragInfoRef,
  onHover,
  item,
  index,
  idFieldName = 'id',
  dataTransferKey = 'data',
  onDragStart: onDragStartProp,
  onDragOver: onDragOverProp,
  onDragLeave: onDragLeaveProp,
  onDragEnd: onDragEndProp,
  onDrop: onDropProp,
  onSwap: onSwapProp,
}: UseDragProps) => {
  const [dragging, setDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<UseDropNodeDirection>()

  const onDragStartPropLatest = useLatestCallback(onDragStartProp)
  const itemLatestRef = useLatestRef(item)

  const onDragStart = useCallback(
    (evt) => {
      if (!draggable) return

      evt.stopPropagation()

      const item = itemLatestRef.current
      const clientY = evt.clientY
      const dragId = item[idFieldName]

      console.log(item, idFieldName)

      dragInfoRef.current = {
        startClientY: clientY,
        dragId,
        dragItem: item,
        dragIndex: index,
      }

      setDragging(true)

      evt.dataTransfer.setData(dataTransferKey, JSON.stringify({ sourceId: dragId }))

      onDragStartPropLatest(evt, item)
    },
    [
      draggable,
      onDragStartPropLatest,
      idFieldName,
      dataTransferKey,
      itemLatestRef,
      dragInfoRef,
      index,
    ]
  )

  const hoverLatestRef = useLatestRef(onHover)
  const onDragOverPropLatest = useLatestCallback(onDragOverProp)

  const onDragOver = useCallback(
    (evt) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      if (!dragInfoRef.current) return

      const item = itemLatestRef.current
      const { startClientY, dragId } = dragInfoRef.current

      if (dragId === item[idFieldName]) return

      let nextDirection: undefined | UseDropNodeDirection

      if (isFunction(hoverLatestRef.current)) {
        nextDirection = hoverLatestRef.current(evt, item, dragInfoRef.current)
      } else {
        const hoverClientY = evt.clientY

        nextDirection =
          hoverClientY < startClientY ? UseDropNodeDirection.BEFORE : UseDropNodeDirection.AFTER
      }

      setDragDirection(nextDirection)
      onDragOverPropLatest(evt, item)
    },
    [draggable, onDragOverPropLatest, idFieldName, hoverLatestRef, dragInfoRef, itemLatestRef]
  )

  const onDragLeavePropLatest = useLatestCallback(onDragLeaveProp)
  const onDragLeave = useCallback(
    (evt: React.DragEvent) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      const item = itemLatestRef.current
      setDragDirection(undefined)
      onDragLeavePropLatest(evt, item)
    },
    [draggable, onDragLeavePropLatest, itemLatestRef]
  )

  const onDragEndPropLatest = useLatestCallback(onDragEndProp)
  const onDragEnd = useCallback(
    (evt: React.DragEvent) => {
      if (!draggable) return

      evt.preventDefault()
      evt.stopPropagation()

      const item = itemLatestRef.current

      evt.dataTransfer.clearData()
      dragInfoRef.current = null
      setDragDirection(undefined)
      setDragging(false)

      onDragEndPropLatest(evt, item)
    },
    [draggable, dragInfoRef, onDragEndPropLatest, itemLatestRef]
  )

  const onDropPropLatest = useLatestCallback(onDropProp)
  const onSwapPropLatest = useLatestCallback(onSwapProp)

  // 放置目标元素时触发事件
  const onDrop = useCallback(
    (evt: React.DragEvent) => {
      if (!draggable) return
      if (!dragInfoRef.current) return

      const item = itemLatestRef.current
      const { dragId } = dragInfoRef.current

      evt.preventDefault()
      evt.stopPropagation()

      setDragDirection(undefined)
      // dragInfoRef.current = null
      dragInfoRef.current.dropItem = item
      dragInfoRef.current.dropIndex = index

      const targetId = item[idFieldName]

      if (dragId === targetId) return

      try {
        const { sourceId } = JSON.parse(evt.dataTransfer.getData(dataTransferKey))

        onSwapPropLatest(sourceId, targetId, dragDirection)
      } catch (error) {
        console.error(error)
      }

      onDropPropLatest(evt, item)
    },
    [
      draggable,
      dragInfoRef,
      idFieldName,
      onDropPropLatest,
      dragDirection,
      dataTransferKey,
      onSwapPropLatest,
      itemLatestRef,
      index,
    ]
  )

  const getDragTriggerProps = useCallback(() => {
    return {
      draggable,
      'data-dragging': dragging,
      onDragStart,
      onDragLeave,
      onDragEnd,
    }
  }, [draggable, onDragStart, onDragLeave, onDragEnd, dragging])

  const getDropTriggerProps = useCallback(() => {
    return {
      'data-drop-direction': dragDirection,
      onDrop,
      onDragOver,
    }
  }, [onDrop, onDragOver, dragDirection])

  return {
    dragging: dragging,
    direction: dragDirection,
    getDragTriggerProps,
    getDropTriggerProps,
  }
}

export interface UseDragProps extends UseDropPropsReturn {
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
  onDrop?: (evt: React.DragEvent, dropItem: any) => void
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
  onHover?: (evt: React.DragEvent, targetItem: any, dragInfo: any) => UseDropNodeDirection
  dataTransferKey?: string
  item: any
  index: number
}

export type UseDragReturn = ReturnType<typeof useDrag>

// 表示拖拽放置位置
export const UseDropNodeDirection = {
  BEFORE: 'before',
  INSIDE: 'inside',
  AFTER: 'after',
} as const

// eslint-disable-next-line no-redeclare
export type UseDropNodeDirection = ValueOf<typeof UseDropNodeDirection> | null
