import React from 'react'
import Radio, { RadioGroup } from '../src'

export const Group = () => {
  const [value, setValue] = React.useState<React.ReactText>(0)
  const data = [
    {
      id: 0,
      content: '手机类',
    },
    {
      id: 1,
      content: '电脑类',
    },
    {
      id: 2,
      content: '生活类',
    },
    {
      id: 3,
      content: '其它',
    },
    {
      id: 4,
      content: '禁用未选',
      disabled: true,
    },
  ]

  return (
    <>
      <h1>Group</h1>
      <div className="radio-group__wrap">
        <RadioGroup
          value={value}
          onChange={(value) => {
            console.log('onChange', value)
            setValue(value)
          }}
        >
          {data.map((item) => {
            return (
              <Radio key={item.id} disabled={item.disabled} value={item.id}>
                {item.content}
              </Radio>
            )
          })}
        </RadioGroup>
      </div>
    </>
  )
}
