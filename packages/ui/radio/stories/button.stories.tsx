import React from 'react'
import Radio from '../src'

/**
 * @title 按钮组用法
 * @desc 样式突出，突显在页面的重要级别，选项数5个左右为宜
 */
export const Button = () => {
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
      <h1>Button</h1>
      <div className="radio-button__wrap">
        <div>
          <RadioGroup
            defaultValue={0}
            type={'button'}
            data={data}
            onChange={(value) => {
              console.log('onChange', value)
            }}
          />
        </div>
        <h2>vertical</h2>
        <div>
          <RadioGroup
            defaultValue={0}
            placement={'vertical'}
            type={'button'}
            data={data}
            onChange={(value) => {
              console.log('onChange', value)
            }}
          />
        </div>
      </div>
    </>
  )
}
