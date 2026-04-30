import React from 'react'
import Select from '../src'

/**
 * @title 非受控
 */
export const Uncontrolled = () => {
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
      <h1>Uncontrolled</h1>
      <div className="select-uncontrolled__wrap">
        <Select
          style={{ width: 240 }}
          data={data}
          defaultValue={'3'}
          onChange={(selectedId) => {
            console.log('onChange', selectedId)
          }}
        />
      </div>
    </>
  )
}
