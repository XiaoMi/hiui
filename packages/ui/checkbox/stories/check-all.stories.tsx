import React from 'react'
import Checkbox from '../src'

export const CheckAll = () => {
  const CheckboxGroup = Checkbox.Group

  const [data] = React.useState([
    {
      title: '手机',
      id: 'Phone',
    },
    {
      title: '电脑',
      id: 'Computer',
    },
    {
      title: '智能',
      id: 'Intelli',
    },
    {
      title: '出行',
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
