import React from 'react'
import Select from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
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
      <h1>Size</h1>
      <div className="select-size__wrap">
        <h2>xs</h2>
        <Select style={{ width: 240 }} size="xs" clearable={false} data={data} />
        <h2>sm</h2>
        <Select style={{ width: 240 }} size="sm" clearable={false} data={data} />
        <h2>md</h2>
        <Select style={{ width: 240 }} size="md" clearable={false} data={data} />
        <h2>lg</h2>
        <Select style={{ width: 240 }} size="lg" clearable={false} data={data} />
      </div>
    </>
  )
}
