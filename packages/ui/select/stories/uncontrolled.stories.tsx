import React from 'react'
import Select from '../src'

export const Uncontrolled = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Uncontrolled</h1>
      <div className="select-uncontrolled__wrap">
        <Select
          style={{ width: 200 }}
          data={data}
          defaultValue={'3'}
          onChange={(selectedId) => {
            console.log('onChange', selectedId)
          }}
        />
      </div>
    </>
  )
}
