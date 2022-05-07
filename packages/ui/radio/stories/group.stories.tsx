import React from 'react'
import Radio from '../src'

/**
 * @title 成组
 */
export const Group = () => {
  const RadioGroup = Radio.Group

  const [data] = React.useState([
    {
      id: 0,
      title: '手机类',
    },
    {
      id: 1,
      title: '电脑类',
    },
    {
      id: 2,
      title: '生活类',
    },
    {
      id: 3,
      title: '其它',
    },
    {
      id: 4,
      title: '禁用未选',
      disabled: true,
    },
  ])

  return (
    <>
      <h1>Group</h1>
      <div className="radio-group__wrap">
        <RadioGroup
          defaultValue={0}
          data={data}
          onChange={(value) => {
            console.log('onChange', value)
          }}
        />
      </div>
    </>
  )
}
