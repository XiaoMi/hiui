import { useMemo } from 'react'
import { TimePickerFormat } from '@hi-ui/time-picker'

export const useTimePickerFormat = (original: string) => {
  const timeFormat = original.split(' ')[1] ?? ''

  return useMemo(() => {
    let result = ''
    if (timeFormat.toLowerCase().includes('h')) {
      result += 'HH:'
    }

    if (timeFormat.toLowerCase().includes('m')) {
      result += 'mm:'
    }

    if (timeFormat.toLowerCase().includes('s')) {
      result += 'ss:'
    }

    return result.slice(0, result.length - 1) as TimePickerFormat
  }, [timeFormat])
}
