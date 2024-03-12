import React from 'react'
import Input from '@hi-ui/input'
import Select from '../src'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    {
      title: '生活周边超长文案展示超长文案展示',
      id: '5',
    },
    { title: '办公', id: '6' },
    { title: '生活周边7', id: '7' },
    { title: '办公8', id: '8' },
  ])

  return (
    <>
      <h1>CustomRender</h1>
      <div className="select-custom-render__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          customRender={(data) => {
            return <Input value={!data ? '' : data.title + ''} readOnly placeholder="请选择" />
          }}
        />
      </div>
    </>
  )
}
