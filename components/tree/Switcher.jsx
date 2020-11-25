import React, { useState, useCallback, useMemo, memo } from 'react'
import Loading from './IconLoading'
import Icon from '../icon'

const switcherApperanceMap = {
  default: ['caret-right', 'caret-down'],
  folder: ['folder', 'folder-open'],
  line: ['plus-square', 'minus-square']
}

const Switcher = memo(({ apperance, onLoadChildren, node, onExpandNode, expanded }) => {
  const [loading, setLoading] = useState(false)

  const iconStyle = useMemo(() => {
    return { cursor: 'pointer', marginRight: 8, fontSize: 16 }
  }, [])

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (onLoadChildren && !node.children) {
        setLoading(true)
        onLoadChildren(node).then(
          (res) => {
            setLoading(false)
            onExpandNode(node, !expanded)
          },
          () => {
            setLoading(false)
          }
        )
      } else {
        onExpandNode(node, !expanded)
      }
    },
    [node, expanded, onLoadChildren, onExpandNode]
  )

  return loading ? (
    <Loading />
  ) : (
    <Icon
      style={iconStyle}
      name={expanded ? switcherApperanceMap[apperance][1] : switcherApperanceMap[apperance][0]}
      onClick={handleClick}
    />
  )
})

export default Switcher
