import React, { useContext, useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import FormContext from './FormContext'
import { FILEDS_REMOVE, FILEDS_INIT_LIST, FILEDS_UPDATE_LIST } from './FormReducer'
const List = (props) => {
  const { formState, initialValues, _Immutable } = useContext(FormContext)
  const { children, name } = props
  const [listCount, setListCount] = useState([])
  const { listValues } = formState
  const listValuesRef = useRef()
  if (!_.isEqual(listValues, listValuesRef.current)) {
    listValuesRef.current = listValues
    setListCount([])
  }
  useEffect(() => {
    // init listName
    _Immutable.current.setState({ type: FILEDS_INIT_LIST, payload: name })
    initialValues &&
      Object.keys(initialValues).forEach((key) => {
        key === name &&
          _Immutable.current.setState({
            type: FILEDS_UPDATE_LIST,
            payload: Object.assign({}, { ...listValues }, { [key]: initialValues[key] })
          })
      })
  }, [])
  // manage default value
  useEffect(() => {
    const { listValues } = _Immutable.current.currentState()
    listCount.forEach((item) => {
      _Immutable.current.setState({ type: FILEDS_REMOVE, payload: item.field })
    })
    const cachelistCount = []
    const values = listValues[name] ? listValues[name] : []
    values.forEach((value, index) => {
      const uuid = parseInt((Math.random() * 9 + 1) * 100000)
      cachelistCount.push({
        field: name + '-' + uuid,
        listItemValue: value,
        sort: index,
        column: index,
        uuid,
        name
      })
    })
    setListCount(cachelistCount)
  }, [listValues])

  if (typeof children !== 'function') {
    console.warning('Form.List only accepts function as children.')
    return null
  }

  const add = () => {
    const uuid = parseInt((Math.random() * 9 + 1) * 100000)
    setListCount(
      listCount.concat({
        field: name + '-' + uuid,
        sort: listCount.length
      })
    )
  }

  const remove = (fieldItem) => {
    const _listCount = listCount.filter((item) => {
      return item.field !== fieldItem.field
    })
    setListCount(_listCount)
    _Immutable.current.setState({ type: FILEDS_REMOVE, payload: fieldItem.field })
  }
  return (
    <div>
      <FormContext.Provider value={{ ...useContext(FormContext), _type: 'list', listname: name }}>
        {children(listCount, { add, remove })}
      </FormContext.Provider>
    </div>
  )
}

export default List
