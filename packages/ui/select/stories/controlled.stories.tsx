import React from 'react'
import Select from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value, setValue] = React.useState<React.ReactText>('shouji')
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
      <h1>Controlled</h1>
      <div className="select-controlled__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          value={value}
          onChange={(selectedId) => {
            setValue(selectedId)
          }}
        />
      </div>
    </>
  )
}
