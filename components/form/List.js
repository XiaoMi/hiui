import React, { useContext, useEffect, useState } from 'react'

import FormContext from './FormContext'
import { FILEDS_REMOVE } from './FormReducer'
const List = props => {
  const { dispatch } = useContext(FormContext)
  const { children, name } = props

  const [listCount, setListCount] = useState([])

  if (typeof children !== 'function') {
    warning(false, 'Form.List only accepts function as children.')
    return null
  }

  const add = () => {
    const id = parseInt((Math.random() * 9 + 1) * 100000)
    setListCount(
      listCount.concat({
        field: name + '-' + id
      })
    )
  }
  const remove = fieldItem => {
    const _listCount = listCount.filter(item => {
      return item.field !== fieldItem.field
    })
    setListCount(_listCount)

    dispatch({ type: FILEDS_REMOVE, payload: fieldItem.field })
  }
  return (
    <div>
      <FormContext.Provider
        value={{ ...useContext(FormContext), _type: 'list', listname: name }}
      >
        {children(listCount, { add, remove })}
      </FormContext.Provider>
    </div>
  )
}

export default List
