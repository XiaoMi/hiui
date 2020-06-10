import { useState, useEffect, useCallback } from 'react'

const useSelect = ({ defaultExpandedIds, expandedIds, onExpand }) => {
  const [_expandedIds, setExpandedId] = useState(expandedIds || defaultExpandedIds || [])

  useEffect(() => {
    if (expandedIds) {
      setExpandedId(expandedIds)
    }
  }, [expandedIds])

  const onExpandNode = useCallback(
    (expandedNode, isExpanded, epdIds) => {
      const ids = [...epdIds]
      if (expandedNode !== undefined && !expandedIds) {
        setExpandedId(
          isExpanded ? ids.concat(expandedNode.id) : ids.filter((id) => id !== expandedNode.id)
        )
      }
      if (onExpand) {
        onExpand(
          expandedNode,
          isExpanded,
          isExpanded ? ids.concat(expandedNode.id) : ids.filter((id) => id !== expandedNode.id)
        )
      }
    },
    [expandedIds]
  )
  return [_expandedIds, onExpandNode]
}

export default useSelect
