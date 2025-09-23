import React, { useMemo } from 'react'
import { cx } from '@hi-ui/classname'
import { CloseCircleFilled, TimeOutlined, CalendarOutlined } from '@hi-ui/icons'
import { DatePickerTypeEnum } from '../types'

const PickerIcon = ({
  focus,
  type,
  clearable,
  showTime,
  disabled,
  onClick,
  showIndicator,
}: {
  focus: boolean
  clearable?: boolean
  showTime: boolean
  disabled?: boolean
  type: DatePickerTypeEnum
  onClick: (status: boolean) => void
  showIndicator?: boolean
}) => {
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
    if (focus && clearable && !disabled) {
      return CloseCircleFilled
    }

    if (showIndicator) {
      if (type.includes('time') || showTime) {
        return TimeOutlined
      } else {
        return CalendarOutlined
      }
    }

    return React.Fragment
  }, [clearable, disabled, focus, showIndicator, showTime, type])

  return (
    <MatchIcon
      className={cls}
      onClick={(evt) => {
        evt.stopPropagation()

        if (disabled) return

        onClick(!!(focus && clearable))
      }}
    />
  )
}

export default PickerIcon
