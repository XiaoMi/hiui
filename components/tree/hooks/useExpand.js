import { useState, useEffect, useCallback } from 'react'

const useExpand = ({ defaultExpandedIds, expandedIds, onExpand }) => {
  const [_expandedIds, setExpandedId] = useState(expandedIds || defaultExpandedIds || [])

  useEffect(() => {
    if (expandedIds) {
      setExpandedId(expandedIds)
    }
  }, [expandedIds])

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      if (expandedNode !== undefined && !expandedIds) {
        setExpandedId(
          isExpanded ? _expandedIds.concat(expandedNode.id) : _expandedIds.filter((id) => id !== expandedNode.id)
        )
      }
      if (onExpand) {
        onExpand(
          expandedNode,
          isExpanded,
          isExpanded ? _expandedIds.concat(expandedNode.id) : _expandedIds.filter((id) => id !== expandedNode.id)
        )
      }
    },
    [_expandedIds]
  )
  return [_expandedIds, onExpandNode]
}

export default useExpand
