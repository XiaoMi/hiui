import type { TimePickerValue } from '@hi-ui/time-picker'
import type { DatePickerProps } from '../types'
import moment from 'moment'

export type ShowTimeProp = DatePickerProps['showTime']

export function isShowTimeEnabled(showTime: ShowTimeProp | undefined): boolean {
  return typeof showTime === 'object' && showTime !== null ? true : !!showTime
}

export function getShowTimeDefaultOpenValue(
  showTime: ShowTimeProp | undefined
): TimePickerValue[] | undefined {
  if (typeof showTime !== 'object' || showTime === null || showTime.defaultOpenValue == null) {
    return undefined
  }
  return Array.isArray(showTime.defaultOpenValue)
    ? showTime.defaultOpenValue
    : [showTime.defaultOpenValue]
}

export function getShowTimeDefaultMoment(
  showTime: ShowTimeProp | undefined,
  index = 0
): moment.Moment | null {
  const defaultOpenValue = getShowTimeDefaultOpenValue(showTime)
  const candidate = defaultOpenValue?.[index] ?? defaultOpenValue?.[0]
  if (candidate == null || candidate === '') return null

  if (typeof candidate === 'string') {
    const parsed = moment(candidate, ['HH:mm:ss', 'HH:mm', 'H:mm'], true)
    if (parsed.isValid()) return parsed
  }

  const parsed = moment(candidate)
  return parsed.isValid() ? parsed : null
}
