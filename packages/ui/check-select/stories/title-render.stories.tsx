import { CheckOutlined } from '@hi-ui/icons'
import React from 'react'
import CheckSelect from '../src'

export const TitleRender = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>TitleRender</h1>
      <div className="select-TitleRender__wrap">
        <CheckSelect
          clearable={false}
          style={{ width: 200 }}
          data={data}
          render={(item) => {
            return (
              <React.Fragment>
                <span style={{ float: 'left' }}>{item.title}</span>
                {item.checked ? (
                  <span style={{ float: 'right' }}>
                    <CheckOutlined />
                  </span>
                ) : null}
              </React.Fragment>
            )
          }}
        />
      </div>
    </>
  )
}
