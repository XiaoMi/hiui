import React from 'react'
import Select, { SelectMergedItem } from '../src'

/**
 * @title 创建选项
 * @description 开启后，支持在搜索无结果时创建选项
 */
export const CreateItem = () => {
  const [data, setData] = React.useState<SelectMergedItem[]>([
    {
      id: 'up-1',
      title: 'up',
    },
    {
      id: '0',
      title: '0',
    },
    {
      id: '1',
      title: '1',
    },
    {
      id: '2',
      title: '2',
    },
  ])

  return (
    <>
      <h1>Create Item</h1>
      <div className="select-search__wrap">
        <Select
          style={{ width: 240 }}
          searchable
          creatableInSearch
          // createTitle="添加"
          onItemCreate={(item) => {
            console.log('onCreate', item)
            // setData([...data, item])
            setData([item, ...data])
          }}
          data={data}
        />
      </div>
    </>
  )
}
