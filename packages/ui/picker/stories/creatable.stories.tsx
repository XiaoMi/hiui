import React from 'react'
import Picker from '../src'
import Button from '@hi-ui/button'

/**
 * @title 创建选项
 */
export const Creatable = () => {
  return (
    <>
      <h1>Creatable</h1>
      <div className="picker-creatable__wrap">
        <Picker
          searchable
          creatableInSearch
          trigger={<Button>Trigger</Button>}
          onCreate={(keyword) => {
            console.log(keyword)
          }}
        ></Picker>
      </div>
    </>
  )
}
