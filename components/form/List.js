import React, { useContext, useState, useEffect } from 'react'

import FormContext from './FormContext'
import { FILEDS_REMOVE, FILEDS_INIT_LIST, FILEDS_UPDATE } from './FormReducer'
const List = (props) => {
  const { dispatch, formState } = useContext(FormContext)
  const { children, name } = props
  const [listCount, setListCount] = useState([])
  const { listValues } = formState

  useEffect(() => {
    // init listName
    dispatch({ type: FILEDS_INIT_LIST, payload: name })
  }, [])

  // manage default value
  useEffect(() => {
    const cachelistCount = []
    const { fields } = formState

    const _fields = fields.filter((item) => {
      return item.listname !== name
    })
    const values = listValues[name] ? listValues[name] : []
    values.forEach((value, index) => {
      const uuid = parseInt((Math.random() * 9 + 1) * 100000)
      cachelistCount.push({
        field: name + '-' + uuid,
        listItemValue: value,
        sort: index
      })
    })
    dispatch({ type: FILEDS_UPDATE, payload: _fields })
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
    dispatch({ type: FILEDS_REMOVE, payload: fieldItem.field })
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
