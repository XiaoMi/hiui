import React from 'react'
import Select from '../src'

/**
 * @title 自定义回显展示
 */
export const DisplayRender = () => {
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
      <h1>DisplayRender</h1>
      <div className="select-display-render__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          displayRender={(item) => {
            console.log(item)
            return (
              <span style={{ float: 'left' }}>
                {item.title}
                <span style={{ float: 'right', color: '#999', fontSize: 14 }}>({item.id})</span>
              </span>
            )
          }}
        />
      </div>
    </>
  )
}
