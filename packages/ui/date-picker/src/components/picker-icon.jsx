import React, { useMemo } from 'react'
import { cx } from '@hi-ui/classname'
import { CloseCircleFilled, TimeOutlined, DateOutlined } from '@hi-ui/icons'

const PickerIcon = ({ focus, type, clearable, showTime, disabled, onClick }) => {
  const cls = cx(
    'hi-icon',
    disabled && 'hi-icon--disabled',
    focus && clearable
      ? 'icon-close-circle clear'
      : type.includes('time') || showTime
      ? 'icon-time'
      : 'icon-date'
  )
  const MatchIcon = useMemo(() => {
    if (focus && clearable) {
      return CloseCircleFilled
    } else if (type.includes('time') || showTime) {
      return TimeOutlined
    } else {
      return DateOutlined
    }
  }, [clearable, focus, showTime, type])

  return (
    <MatchIcon
      className={cls}
      onClick={(e) => {
        if (disabled) return
        onClick(focus && clearable)
      }}
    />
  )
}

export default PickerIcon
