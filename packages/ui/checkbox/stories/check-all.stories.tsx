import React from 'react'
import { Checkbox, CheckboxGroup } from '../src'

export const CheckAll = () => {
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
    },
  ])
  const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

  return (
    <>
      <h1>全选操作</h1>
      <div className="checkbox-check-all__wrap">
        <Checkbox
          indeterminate={selectedList.length > 0 && selectedList.length < 4}
          checked={selectedList.length === 4}
          onChange={() => {
            setSelectedList((prev) => {
              return prev.length < 4 ? data.map(({ id }) => id) : []
            })
          }}
        >
          全选
        </Checkbox>
        <p />
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
