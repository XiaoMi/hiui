import React, { useMemo, memo } from 'react'
import Loading from './IconLoading'
import Icon from '../icon'

const switcherApperanceMap = {
  default: ['caret-right', 'caret-down'],
  folder: ['folder', 'folder-open'],
  line: ['plus-square', 'minus-square']
}

const Switcher = memo(({ apperance, expanded, loading, onClick }) => {
  const iconStyle = useMemo(() => {
    return { cursor: 'pointer', marginRight: 8, fontSize: 16 }
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <Icon
      style={iconStyle}
      name={expanded ? switcherApperanceMap[apperance][1] : switcherApperanceMap[apperance][0]}
      onClick={onClick}
    />
  )
})

export default Switcher
