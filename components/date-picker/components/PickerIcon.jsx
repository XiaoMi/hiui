import React from 'react'
import classNames from 'classnames'

const PickerIcon = ({ focus, type, clearable, showTime, disabled, onClick }) => {
  const cls = classNames(
    'hi-icon',
    focus && clearable ?
       'icon-close-circle clear'
      : type.includes('time') || showTime
      ? 'icon-time'
      : 'icon-date'
  )
  return <span
    className={cls}
    onClick={(e) => {
      if (disabled) return
      onClick(focus && clearable)
    }}
  />
}

export default PickerIcon
