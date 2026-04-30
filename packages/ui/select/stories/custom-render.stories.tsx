import React from 'react'
import Input from '@hi-ui/input'
import Select from '../src'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
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
      <h1>CustomRender</h1>
      <div className="select-custom-render__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          customRender={(data) => {
            return <Input value={!data ? '' : data.title + ''} readOnly placeholder="请选择" />
          }}
        />
      </div>
    </>
  )
}
