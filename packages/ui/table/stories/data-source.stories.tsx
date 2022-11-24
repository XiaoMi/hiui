import React from 'react'
import Table from '../src'

/**
 * @title 异步加载数据
 * @desc 封装了分页加载数据的逻辑
 */
export const DataSource = () => {
  const [columns] = React.useState([
    { title: 'ID', dataKey: 'id' },
    { title: 'Title', dataKey: 'title' },
  ])

  const [pageState, setPageState] = React.useState({
    total: 0,
    pageSize: 10,
  })

  const handleDataSource = React.useCallback(
    (current, pageSize) => {
      return {
        url: 'https://mife-gallery.test.mi.com/hiui/stores',
        params: {
          page: current,
          pageSize: pageSize,
        },
        transformResponse: (res) => {
          const data = JSON.parse(res).data

          // 设置 total
          setPageState({
            ...pageState,
            // 正常情况下接口会返回这个 total 值，此处做演示写了一个固定值
            total: 28,
          })

          return data.map((item, i) => {
            return {
              key: i,
              title: item.title + current,
              id: item.id,
            }
          })
        },
      }
    },
    [pageState]
  )

  return (
    <>
      <h1>DataSource for Table</h1>
      <div className="table-data-source__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table
          columns={columns}
          dataSource={handleDataSource}
          pagination={{
            showTotal: true,
            total: pageState.total,
            pageSizeOptions: [5, 10, 20],
            pageSize: pageState.pageSize,
            onPageSizeChange(pageSize) {
              setPageState({
                ...pageState,
                pageSize,
              })
            },
          }}
        />
      </div>
    </>
  )
}
