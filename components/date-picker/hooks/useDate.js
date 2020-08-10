import { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
const parseValue = (value) => {
  if (!value) return [null]
  const _value = moment(value)
  const isValid = moment(value).isValid()
  if (value && typeof value === 'object' && (value.start || value.end)) {
    return [value.start ? moment(value.start) : null, value.end ? moment(value.end) : null]
  }
  return [isValid ? _value : null]
}
const useDate = ({ value, defaultValue, cacheDate }) => {
  const [outDate, setOutDate] = useState([])
  const changeOutDate = (dates) => {
    setOutDate(_.cloneDeep(dates))
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue)
    setOutDate(d)
    cacheDate.current = d
  }, [value])

  return [outDate, changeOutDate]
}

export default useDate
