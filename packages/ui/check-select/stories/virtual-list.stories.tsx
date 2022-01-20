import React from 'react'
import CheckSelect from '../src'

const data = []
for (let i = 0; i < 10000; i++) {
  const value = `${i.toString(36)}-${i}`
  data.push({
    id: value,
    title: value,
    disabled: i === 10,
  })
}

export const VirtualList = () => {
  console.log('data', data)

  return (
    <>
      <h1>VirtualList</h1>
      <div className="check-select-search__wrap">
        <CheckSelect
          data={data}
          searchable
          height={300}
          wrap={false}
          defaultValue={data.map((v) => v.id)}
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
        ></CheckSelect>
      </div>
    </>
  )
}
