import React from 'react'
import Checkbox from '../src'

/**
 * @title 垂直样式
 * @desc 选项的另一种布局形式，视页面空间选用
 */
export const Placement = () => {
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
