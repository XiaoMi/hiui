import { useState, useEffect } from 'react'
import _ from 'lodash'
import { parseValue } from '../utils'

const useDate = ({ value, defaultValue, cacheDate, type, format }) => {
  const [outDate, setOutDate] = useState([])
  const changeOutDate = (dates) => {
    setOutDate(_.cloneDeep(dates))
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue, type, format)
    setOutDate(d)
    cacheDate.current = d
  }, [value, type])
  return [outDate, changeOutDate]
}

export default useDate
