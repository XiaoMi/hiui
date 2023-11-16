import React from 'react'
import Radio from '../src'

/**
 * @title 宽度自适应
 * @desc 仅支持横向按钮组
 */
export const AutoWidth = () => {
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
      <h1>AutoWidth</h1>
      <div className="radio-auto-width__wrap">
        <div>
          <RadioGroup
            defaultValue={0}
            type={'button'}
            data={data}
            autoWidth={true}
            onChange={(value) => {
              console.log('onChange', value)
            }}
          />
        </div>
      </div>
    </>
  )
}
