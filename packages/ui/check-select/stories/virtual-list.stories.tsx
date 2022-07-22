import React from 'react'
import CheckSelect from '../src'

/**
 * @title 大数据
 */
export const VirtualList = () => {
  const [data] = React.useState(() => {
    const data: any[] = []
    for (let i = 0; i < 5000; i++) {
      const value = `${i.toString(36)}-${i}`
      data.push({
        id: value,
        title: value,
        disabled: i === 10,
      })
    }

    return data
  })

  console.log('data', data)

  return (
    <>
      <h1>VirtualList</h1>
      <div className="check-select-search__wrap">
        <CheckSelect
          style={{ width: 240 }}
          data={data}
          searchable
          height={260}
          defaultValue={data.map((v) => v.id)}
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
        ></CheckSelect>
      </div>
    </>
  )
}
