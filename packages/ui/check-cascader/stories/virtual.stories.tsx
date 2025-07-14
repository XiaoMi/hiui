import React from 'react'
import CheckCascader from '../src'

/**
 * @title 基础用法
 * @desc 展示从多个收起的备选项中选出的多个选项
 */
export const Virtual = () => {
  const [dataOnlyLeafCheckable] = React.useState(() => {
    const data = [
      // 随机生成 100 * 100 * 100 条的级联数据
      ...Array.from({ length: 100 }, (_, index) => ({
        id: `item-${index}`,
        title: `item-${index}`,
        children: Array.from({ length: 100 }, (_, index2) => ({
          id: `item-${index}-${index2}`,
          title: `item-${index}-${index2}`,
          children: Array.from({ length: 100 }, (_, index3) => ({
            id: `item-${index}-${index2}-${index3}`,
            title: `item-${index}-${index2}-${index3}`,
          })),
        })),
      })),
    ]

    const getDataOnlyLeafCheckable = (data: any) => {
      return data.map((item: any) => {
        if (item.children) {
          item.checkable = item.checkable ?? false
          item.children = getDataOnlyLeafCheckable(item.children)
        }

        return item
      })
    }

    const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

    return dataOnlyLeafCheckable
  })

  return (
    <>
      <h1>Virtual</h1>
      <div className="cascader-virtual__wrap">
        <CheckCascader
          style={{ width: 240 }}
          searchable={false}
          virtual
          data={dataOnlyLeafCheckable}
          onChange={console.log}
        ></CheckCascader>
      </div>
    </>
  )
}
