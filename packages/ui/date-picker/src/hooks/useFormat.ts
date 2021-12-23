import { getLocaleTypeFormatMap } from '../utils/constants'
import { DatePickerType } from '../types'
import { useMemo } from 'react'

interface UseFormatConfig {
  type: DatePickerType
  showTime: boolean
  format?: string
  locale?: string
}

/**
 * 根据上下文判断真实需要使用的format
 * @param config
 */
const useFormat = (config: UseFormatConfig) => {
  const { type, showTime, format, locale = 'zh-CN' } = config

  return useMemo(() => {
    let realFormat = format || getLocaleTypeFormatMap(locale)[type]
    if (showTime && !/[H|h|m|s]/.test(realFormat)) {
      realFormat += ' HH:mm:ss'
    }
    return realFormat
  }, [type, showTime, format, locale])
}

export default useFormat
