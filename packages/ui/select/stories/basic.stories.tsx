import React from 'react'
import Select from '../src'

/**
 * @title 基础用法
 * @desc 展示从多个收起的备选项中选出的一个选项
 */
export const Basic = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="select-basic__wrap">
        <Select style={{ width: 240 }} clearable={false} data={data} />
      </div>
    </>
  )
}
