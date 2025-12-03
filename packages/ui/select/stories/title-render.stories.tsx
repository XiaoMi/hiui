import React from 'react'
import Select from '../src'

/**
 * @title 自定义选项展示
 * @desc 可自定义选项的信息结构或样式
 */
export const TitleRender = () => {
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
      <h1>TitleRender</h1>
      <div className="select-TitleRender__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          render={(item) => {
            console.log(item)
            return (
              <React.Fragment>
                <span style={{ float: 'left' }}>{item.title}</span>
                <span style={{ float: 'right', color: '#999', fontSize: 14 }}>{item.id}</span>
              </React.Fragment>
            )
          }}
        />
      </div>
    </>
  )
}
