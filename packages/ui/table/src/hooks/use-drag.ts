import React, { useCallback } from 'react'
import { FlattedTableRowData } from '../types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { cloneTree, deleteNodeById, findNodeById, insertNodeById } from '@hi-ui/tree-utils'
import { isFunction, isPromise } from '@hi-ui/type-assertion'

export const useTableDrag = ({
  cacheData,
  setCacheData,
  draggable,
  flattedData,
  onDropEnd,
  onDrop: onDropProp,
}: {
  cacheData: any
  setCacheData: any
  draggable: boolean
  flattedData: FlattedTableRowData[]
  onDropEnd: any
  onDrop: any
}) => {
  const dragRowRef = React.useRef<any | null>(null)

  const onDropEndLatest = useLatestCallback(onDropEnd)

  const onDrop = useCallback(
    (evt, sourceId, targetId, dragDirection) => {
      // console.log(sourceId, targetId, dragDirection)

      if (!draggable) return
      if (targetId === sourceId) return

      // TODO： 根据 id 查询数据原始数据或者直接使用引用值，两者选择，避免bug
      // const { rowData, dropRowData, level } = dragRowRef.current

      const sourceNode = findNodeById(cacheData, sourceId, { idFieldName: 'key' })
      const targetNode = findNodeById(cacheData, targetId, { idFieldName: 'key' })

      if (!sourceNode || !targetNode) {
        // console.log('未找到任何节点(sourceNode, targetNode)', sourceNode, targetNode)
        return
      }

      const nextTreeData = cloneTree(cacheData)

      deleteNodeById(nextTreeData, sourceId, { idFieldName: 'key' })
      insertNodeById(nextTreeData, targetId, sourceNode, dragDirection === 'top' ? 0 : 1, {
        idFieldName: 'key',
      })

      const resultMaybePromise = isFunction(onDropProp)
        ? // TODO: 支持 tree 拖拽层级，第四个参数
          onDropProp(evt, {
            dragNode: sourceNode,
            dropNode: targetNode,
            dataStatus: { before: cacheData, after: nextTreeData },
          })
        : true

      if (isPromise(resultMaybePromise)) {
        resultMaybePromise.then((returnResult) => {
          if (returnResult === true) {
            setCacheData(nextTreeData)
            onDropEndLatest({
              dragNode: sourceNode,
              dropNode: targetNode,
              dataStatus: { before: cacheData, after: nextTreeData },
            })
          }
        })
      } else if (resultMaybePromise === true) {
        setCacheData(nextTreeData)
        onDropEndLatest({
          dragNode: sourceNode,
          dropNode: targetNode,
          dataStatus: { before: cacheData, after: nextTreeData },
        })
      }
    },
    [draggable, onDropProp, cacheData, onDropEndLatest, setCacheData]
  )

  return {
    onDrop,
    dragRowRef,
  }
}
