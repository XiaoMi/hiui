import { useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'

const parseValue = (value, type, format) => {
  if (!value) return [null]
  const _value = moment(value)
  const isValid = moment(value).isValid()
  if (value && typeof value === 'object' && type.includes('range')) {
    if (type === 'weekrange') {
      return [
        value.start ? moment(value.start).startOf('week') : null,
        value.end ? moment(value.end).endOf('week') : null
      ]
    }
    return [value.start ? moment(value.start, format) : null, value.end ? moment(value.end, format) : null]
  }
  return [isValid ? _value : null]
}

const useDate = ({ value, defaultValue, cacheDate, type, format }) => {
  const [outDate, setOutDate] = useState([])
  const changeOutDate = (dates) => {
    setOutDate(_.cloneDeep(dates))
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue, type, format)
    setOutDate(d)
    cacheDate.current = d
  }, [value])
  return [outDate, changeOutDate]
}

export default useDate
