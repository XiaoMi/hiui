import React from 'react'
import Radio from '../src'

/**
 * @title 垂直样式
 * @desc 选项的另一种布局形式，视页面空间选用
 */
export const Placement = () => {
  const RadioGroup = Radio.Group

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
  const [selectedId, setSelectedId] = React.useState<React.ReactText>('Phone')

  return (
    <>
      <h1>垂直样式</h1>
      <div className="checkbox-placement__wrap">
        <RadioGroup
          data={data}
          placement="vertical"
          value={selectedId}
          onChange={(value) => {
            console.log(value)
            setSelectedId(value)
          }}
        />
      </div>
    </>
  )
}
