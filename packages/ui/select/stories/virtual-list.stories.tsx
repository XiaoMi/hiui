import React from 'react'
import Select from '../src'

/**
 * @title 大数据
 */
export const VirtualList = () => {
  const [data] = React.useState(() => {
    const defaultData = []
    for (let i = 0; i < 5000; i++) {
      defaultData.push({
        id: `id${i}`,
        title: `title${i}`,
        disabled: i === 8,
      })
    }
    return defaultData
  })

  return (
    <>
      <h1>VirtualList</h1>
      <div className="select-display-render__wrap">
        <Select clearable={false} style={{ width: 200 }} data={data} height={260} />
      </div>
    </>
  )
}
