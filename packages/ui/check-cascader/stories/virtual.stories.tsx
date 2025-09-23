import React from 'react'
import CheckCascader from '../src'

/**
 * @title 大数据
 * @desc 支持大数据下的虚拟滚动
 */
export const Virtual = () => {
  const [dataOnlyLeafCheckable] = React.useState(() => {
    const data = [
      // 随机生成 10 * 100 * 1000 条的级联数据
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
