import { useState, useEffect } from 'react'
import moment from 'moment'
import { parseValue } from '../utils'

const useDate = ({ value, defaultValue, cacheDate, type, format }) => {
  const [outDate, setOutDate] = useState([])
  const changeOutDate = (dates) => {
    const _datas = [
      dates[0] && moment(dates[0]).isValid() ? dates[0] : null,
      dates[1] && moment(dates[1]).isValid() ? dates[1] : null
    ]
    setOutDate(_datas)
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue, type, format)
    setOutDate(d)
    cacheDate.current = d
  }, [value, type])
  return [outDate, changeOutDate]
}

export default useDate
