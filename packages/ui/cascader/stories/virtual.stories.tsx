import React from 'react'
import Cascader from '../src'

/**
 * @title 基础用法
 * @desc 展示从多个收起的备选项中选出的一个选项
 */
export const Virtual = () => {
  const [data] = React.useState([
    // 随机生成 100 * 100 * 100 条的级联数据
    ...Array.from({ length: 10 }, (_, index) => ({
      id: `item-${index}`,
      title: `item-${index}`,
      children: Array.from({ length: 100 }, (_, index2) => ({
        id: `item-${index}-${index2}`,
        title: `item-${index}-${index2}`,
        children: Array.from({ length: 1000 }, (_, index3) => ({
          id: `item-${index}-${index2}-${index3}`,
          title: `item-${index}-${index2}-${index3}`,
        })),
      })),
    })),
  ])

  return (
    <>
      <h1>Virtual</h1>
      <div className="cascader-virtual__wrap">
        <Cascader
          style={{ width: 240 }}
          clearable
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
          virtual
        ></Cascader>
      </div>
    </>
  )
}
