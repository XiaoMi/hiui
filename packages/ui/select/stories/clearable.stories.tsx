import React from 'react'
import Select from '../src'

/**
 * @title 清空选中项
 */
export const Clearable = () => {
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
      <h1>Clearable</h1>
      <div className="select-clearable__wrap">
        <Select style={{ width: 240 }} clearable data={data} onChange={console.log} />
      </div>
    </>
  )
}
