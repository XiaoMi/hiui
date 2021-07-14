import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { findNode } from '../utils'
import cloneDeep from 'lodash.clonedeep'

export const useExpand = (
  defaultExpandedIds: React.ReactText[],
  expandedIds?: React.ReactText[],
  onExpand?: (node: any) => void
) => {
  const [_expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    defaultExpandedIds,
    expandedIds,
    onExpand
  )

  const expandedNodeIdsMp = useMemo(() => new Set<React.ReactText>(), [])

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      // TODO：多选逻辑抽离复用
      if (isExpanded) {
        expandedNodeIdsMp.add(expandedNode.id)
      } else {
        expandedNodeIdsMp.delete(expandedNode.id)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdsMp))
    },
    [expandedNodeIdsMp, tryToggleExpandedIds]
  )

  return [_expandedIds, onExpandNode, expandedNodeIdsMp] as const
}

// ----

export const useSingleSelect = (
  defaultSelectedId?: string,
  selectedId?: string,
  onSelect?: (node: any) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (_: string | undefined, node: any) => {
      onSelect?.(node)
    },
    [onSelect]
  )

  const [_selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedId,
    // import is `id` but export `rawData`
    proxyOnSelect
  )

  const onNodeSelect = useCallback(
    (selectedNode) => {
      if (disabled) return

      tryChangeSelectedId(selectedNode.id, selectedNode)
    },
    [disabled, tryChangeSelectedId]
  )

  return [_selectedId, onNodeSelect] as const
}

// ----

export const useTreeDrop = (treeData, flattedData, onDrop, onDropEnd) => {
  // 移动节点
  const switchNode = useCallback(
    (targetItemId, sourceItemId, data, allData, dropDividerPosition) => {
      const sourceNode = findNode(sourceItemId, allData)
      const _data = [...data]
      _data.forEach((item, idx) => {
        if (item.id === targetItemId) {
          const position = dropDividerPosition === 'down' ? idx + 1 : idx
          data.splice(position, 0, sourceNode)
        } else {
          if (item.children) {
            if (item.children.some((e) => e.id === targetItemId)) {
              const index = item.children.findIndex((i) => i.id === targetItemId)
              const position = dropDividerPosition === 'down' ? index + 1 : index
              item.children.splice(position, 0, sourceNode)
            } else {
              switchNode(targetItemId, sourceItemId, item.children, allData, dropDividerPosition)
            }
          }
        }
      })
    },
    []
  )

  const addDropNode = useCallback((targetId, sourceId, data, allData) => {
    data.forEach((d) => {
      if (d.id === targetId) {
        const sourceNode = findNode(sourceId, allData)
        if (!d.children) {
          d.children = []
        }
        d.children.push(sourceNode)
      } else {
        if (d.children) {
          addDropNode(targetId, sourceId, d.children, allData)
        }
      }
    })
  }, [])

  // 删除拖动的节点
  const _delDragNode = useCallback((itemId, data) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        data.splice(index, 1)
      } else {
        if (d.children) {
          _delDragNode(itemId, d.children)
        }
      }
    })
  }, [])

  const moveNode = useCallback(
    ({ targetId, sourceId, direction, depth }) => {
      const nextTreeData = cloneDeep(treeData)

      // 阻止将节点拖拽到自己或者自己的子树当中
      const _sourceNode = flattedData.find((item) => item.id === sourceId)
      let sourceChildrenIds = []

      if (_sourceNode.children) {
        sourceChildrenIds = _sourceNode.children.map((node) => node.id)
      }
      console.log(_sourceNode, sourceChildrenIds)

      if (sourceChildrenIds.includes(targetId) || sourceId === targetId) {
        return
      }

      _delDragNode(sourceId, nextTreeData)

      //
      const sourceNode = findNode(sourceId, treeData)
      const targetNode = findNode(targetId, treeData)

      if (direction === 'in') {
        addDropNode(targetId, sourceId, nextTreeData, treeData)
      } else {
        switchNode(targetId, sourceId, nextTreeData, treeData, direction)
      }

      if (onDrop) {
        console.log(depth, sourceNode, targetNode)

        const result = onDrop(
          sourceNode,
          targetNode,
          { before: treeData, after: nextTreeData },
          { before: depth.source, after: direction === 'in' ? depth.target + 1 : depth.target }
        )

        if (result === true) {
          // setTreeData(nextTreeData)
          if (onDropEnd) {
            onDropEnd(sourceNode, targetNode)
          }
        } else if (result && typeof result.then === 'function') {
          result.then((res) => {
            // setTreeData(nextTreeData)
            if (onDropEnd) {
              onDropEnd(sourceNode, targetNode)
            }
          })
        }
      } else {
        // setTreeData(nextTreeData)
      }
    },
    [treeData, _delDragNode, addDropNode, switchNode, onDrop, onDropEnd]
  )

  return moveNode
}
