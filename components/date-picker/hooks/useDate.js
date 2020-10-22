import { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
const parseValue = (value, type) => {
  if (!value) return [null]
  const _value = moment(value)
  const isValid = moment(value).isValid()
  if (value && typeof value === 'object' && type.includes('range')) {
    return [value.start ? moment(value.start) : null, value.end ? moment(value.end) : null]
  }
  return [isValid ? _value : null]
}
const useDate = ({ value, defaultValue, cacheDate, type }) => {
  const [outDate, setOutDate] = useState([])
  const changeOutDate = (dates) => {
    setOutDate(_.cloneDeep(dates))
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue, type)
    setOutDate(d)
    cacheDate.current = d
  }, [value])

  return [outDate, changeOutDate]
}

export default useDate
