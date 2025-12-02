import React from 'react'
import Select from '../src'

/**
 * @title 禁用状态
 * @desc 暂不可操作的状态
 */
export const Disabled = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao', disabled: true },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
  ])

  return (
    <>
      <h1>Disabled</h1>
      <div className="select-disabled__wrap">
        <h2>整体禁用</h2>
        <Select style={{ width: 240 }} disabled data={data} defaultValue="2" />

        <h2>局部禁用</h2>
        <Select style={{ width: 240 }} data={data} defaultValue="2" />
      </div>
    </>
  )
}
