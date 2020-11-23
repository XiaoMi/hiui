import React, { useState, useCallback } from 'react'
import Loading from './IconLoading'
import Icon from '../icon'

const switcherApperanceMap = {
  default: ['caret-right', 'caret-down'],
  folder: ['folder', 'folder-open'],
  line: ['plus-square', 'minus-square']
}

const Switcher = ({ apperance, onLoadChildren, node, onExpandNode, expandedIds }) => {
  const expanded = expandedIds.includes(node.id)
  const [loading, setLoading] = useState(false)
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (onLoadChildren && !node.children) {
        setLoading(true)
        onLoadChildren(node).then(
          (res) => {
            setLoading(false)
            onExpandNode(node, !expanded, expandedIds)
          },
          () => {
            setLoading(false)
          }
        )
      } else {
        onExpandNode(node, !expanded, expandedIds)
      }
    },
    [node, expanded, onLoadChildren, onExpandNode, expandedIds]
  )

  return loading ? (
    <Loading />
  ) : (
    <Icon
      style={{ cursor: 'pointer', marginRight: 8, fontSize: 16 }}
      name={expanded ? switcherApperanceMap[apperance][1] : switcherApperanceMap[apperance][0]}
      onClick={handleClick}
    />
  )
}

export default Switcher
