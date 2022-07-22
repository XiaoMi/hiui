import React from 'react'
import Search from '../src'

/**
 * @title 异步搜索
 */
export const Async = () => {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])

  return (
    <>
      <h1>Async</h1>
      <div className="search-async__wrap">
        <Search
          style={{ width: 260 }}
          placeholder="搜索关键字"
          loading={loading}
          data={data}
          onSearch={(keyword) => {
            console.log('onSearch', keyword)
          }}
          onChange={(value) => {
            if (!value) {
              // 清空操作
              setData([])
              return
            }

            // 模拟异步请求数据
            setLoading(true)
            setTimeout(() => {
              const mockDataItem = (str: string, value: number) => ({
                id: str.repeat(value),
                title: str.repeat(value),
              })

              setData([mockDataItem(value, 1), mockDataItem(value, 2), mockDataItem(value, 3)])
              setLoading(false)
            }, 1000)
          }}
        />
      </div>
    </>
  )
}
