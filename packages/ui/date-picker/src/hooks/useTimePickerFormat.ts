import { useMemo } from 'react'
import { TimePickerFormat } from '@hi-ui/time-picker'

export const useTimePickerFormat = (original: string) => {
  return useMemo(() => {
    let result = ''
    if (original.toLowerCase().includes('h')) {
      result += 'HH:'
    }

    if (original.toLowerCase().includes('m')) {
      result += 'mm:'
    }

    if (original.toLowerCase().includes('s')) {
      result += 'ss:'
    }

    return result.slice(0, result.length - 1) as TimePickerFormat
  }, [original])
}
