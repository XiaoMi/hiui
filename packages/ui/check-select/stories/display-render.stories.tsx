import React from 'react'
import CheckSelect from '../src'

/**
 * @title 自定义回显展示
 */
export const DisplayRender = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>DisplayRender</h1>
      <div className="check-select-display-render__wrap">
        <CheckSelect
          style={{ width: 240 }}
          clearable={false}
          data={data}
          displayRender={(item) => {
            console.log(item)
            return (
              <React.Fragment>
                <span style={{ float: 'left' }}>{item.title}</span>
                <span style={{ float: 'right', color: '#999', fontSize: 14 }}>({item.id})</span>
              </React.Fragment>
            )
          }}
        />
      </div>
    </>
  )
}
