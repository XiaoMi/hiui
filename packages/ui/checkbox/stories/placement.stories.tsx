import React from 'react'
import { CheckboxGroup } from '../src'

export const Placement = () => {
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
      <h1>垂直样式</h1>
      <div className="checkbox-placement__wrap">
        <CheckboxGroup
          data={data}
          placement="vertical"
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
