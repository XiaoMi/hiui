import { FORMATS } from '../constants'

const useFormat = ({ type, showTime, format, locale = 'zh-CN' }) => {
  let _format = format || FORMATS(locale)[type]
  if (showTime && !/[H|h|m|s]/.test(_format)) {
    _format += ' HH:mm:ss'
  }
  return [_format]
}

export default useFormat
