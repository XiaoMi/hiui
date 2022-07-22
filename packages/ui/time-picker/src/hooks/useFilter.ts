import {
  TimePickerDisabledHoursFunction,
  TimePickerDisabledMinutesFunction,
  TimePickerDisabledSecondsFunction,
  TimePickerFilter,
  TimePickerFilterProps,
} from '../@types'
import { useMemo } from 'react'

export const useFilter = (original: TimePickerFilterProps): Required<TimePickerFilter> => {
  return useMemo(() => {
    function disabledCompatibility<T>(disposeValue: any): T {
      if (Array.isArray(disposeValue)) {
        return ((() => disposeValue) as any) as T
      }
      return disposeValue as T
    }
    return {
      disabledHours: disabledCompatibility<TimePickerDisabledHoursFunction>(original.disabledHours),
      disabledMinutes: disabledCompatibility<TimePickerDisabledMinutesFunction>(
        original.disabledMinutes
      ),
      disabledSeconds: disabledCompatibility<TimePickerDisabledSecondsFunction>(
        original.disabledSeconds
      ),
    }
  }, [original.disabledHours, original.disabledSeconds, original.disabledMinutes])
}
