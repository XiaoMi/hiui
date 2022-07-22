import React from 'react'
import CheckSelect from '../src'

/**
 * @title 基础用法
 * @desc 展示从全部备选项选出的部分选项
 */
export const Basic = () => {
  const [data] = React.useState([
    { title: '手机', id: '2' },
    { title: '小米2', id: '2-1' },
    { title: '小米3', id: '2-2' },
    { title: '小米4', id: '2-3' },
    { title: '小米5', id: '2-4' },
    { title: '电脑', id: '3' },
    { title: '笔记本', id: '4' },
    {
      title: '生活周边超长文案展示超长文案展示超长文案展示超长文案展示超长文案展示',
      id: '5',
    },
    { title: '其它', id: '6' },
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="check-select-basic__wrap">
        <CheckSelect
          style={{ width: 240 }}
          placeholder="请选择"
          searchable
          clearable
          data={data}
          // render={(option) => {
          //   if (option.id === 'ABC1') {
          //     return '不限'
          //   }

          //   return true
          // }}
        />
      </div>
    </>
  )
}
