import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TreeNodeData } from '../TreeNode'

export const useEdit = (data: TreeNodeData[], onBeforeSave: any) => {
  const _saveEdit = (itemId, data, nodeEdited) => {
    data.forEach((d, index) => {
      if (d.id === itemId) {
        d.title = nodeEdited.title
        delete d.TREE_NODE_TYPE
      } else {
        if (d.children) {
          _saveEdit(itemId, d.children, nodeEdited)
        }
      }
    })
  }

  const saveEdit = useCallback(
    (enode: TreeNodeData) => {
      // const dataCache = _.cloneDeep(cacheData)
      // _saveEdit(enode.id, dataCache, nodeEdited)

      if (onBeforeSave) {
        const result = onBeforeSave(
          nodeEdited,
          { before: cacheData, after: dataCache },
          enode.depth
        )

        if (result === true) {
          updateCacheData(dataCache)
          onSave(nodeEdited, dataCache)
        } else {
          cancelAddNode(enode)
        }
      } else {
        updateCacheData(dataCache)
        onSave(enode, dataCache)
      }
      setEditingNodes(editingNodes.filter((n) => n.id !== enode.id))
    },
    [editingNodes, cacheData, _saveEdit]
  )

  return [_selectedId, _onSelect] as const
}
