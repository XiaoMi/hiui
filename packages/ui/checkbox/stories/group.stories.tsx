import React from 'react'
import { CheckboxGroup } from '../src'

export const Group = () => {
  const [data] = React.useState([
    {
      content: '手机',
      id: 'Phone',
    },
    {
      content: '电脑',
      id: 'Computer',
    },
    {
      content: '智能',
      id: 'Intelli',
    },
    {
      content: '出行',
      id: 'Transfer',
      disabled: true,
    },
  ])
  const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

  return (
    <>
      <h1>CheckboxGroup</h1>
      <div className="checkbox-group__wrap">
        <CheckboxGroup
          data={data}
          value={selectedList}
          onChange={(value) => {
            console.log(value)
            setSelectedList(value)
          }}
        />
      </div>
    </>
  )
}
