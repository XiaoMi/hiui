import React, { useContext, useEffect, useState } from 'react'

import FormContext from './FormContext'

const List = props => {
  const { formState } = useContext(FormContext)
  const { children, name } = props

  // 初始化FormItem的内容
  const { fields } = formState
  const [listCount, setListCount] = useState([])
  useEffect(() => {
    const _fields = fields.filter(item => {
      return item._type === 'list'
    })
    setListCount(
      _fields.map((item, index) => {
        return {
          fields: item,
          id: index
        }
      })
    )
  }, [fields])

  if (typeof children !== 'function') {
    warning(false, 'Form.List only accepts function as children.')
    return null
  }

  const add = () => {
    setListCount(
      listCount.concat({
        id: listCount.length,
        fields: null
      })
    )
  }
  const remove = id => {
    const _listCount = listCount.filter(item => {
      return item.id !== id
    })
    _listCount.forEach((item, index) => {
      item.id = index
    })
    setListCount(_listCount)
  }
  return (
    <div>
      <FormContext.Provider
        value={{ ...useContext(FormContext), _type: 'list', listname: name }}
      >
        <div>
          {listCount.length > 0 ? name + ':' : ''}
          {children(listCount, { add, remove })}
        </div>
      </FormContext.Provider>
    </div>
  )
}

export default List
