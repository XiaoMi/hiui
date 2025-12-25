import React from 'react'
import CheckSelect from '../src'

/**
 * @title 基础用法
 * @desc 展示从全部备选项选出的部分选项
 */
export const Basic = () => {
  const [data] = React.useState([
    { title: '手机', id: '1' },
    { title: '电脑', id: '2' },
    { title: '电视', id: '3' },
    { title: '平板', id: '4' },
    { title: '冰箱', id: '5' },
    { title: '洗衣机', id: '6' },
    { title: '空调', id: '7' },
    { title: '其它', id: '8' },
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="check-select-basic__wrap">
        <CheckSelect style={{ width: 240 }} placeholder="请选择" searchable clearable data={data} />
      </div>
    </>
  )
}
