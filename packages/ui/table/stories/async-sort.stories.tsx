import React from 'react'
import Table, { TableColumnSortOrder } from '../src'

/**
 * @title 远程排序
 * @desc 使用远程排序，需结合 sortOrder 和 onChange 一起使用，并且将 sorter 设置为 true
 */
export const AsyncSort = () => {
  const [loading, setLoading] = React.useState(false)
  const [sortOrder, setSortOrder] = React.useState<TableColumnSortOrder>(null)

  const columns = [
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
      key: 1,
    },
    {
      title: 'Age',
      dataKey: 'age',
      key: 2,
      width: 80,
      sortOrder,
      sorter: true,
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 180,
      key: 16,
    },
    {
      title: 'Address',
      width: 240,
      dataKey: 'address',
      key: 17,
    },
  ]
  const initialData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      phone: 18889898989,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 41,
      phone: '18900010002',
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      phone: '18900010002',
      address: 'London No. 2 Lake Park',
    },
  ]
  const [data, setData] = React.useState(initialData)

  return (
    <>
      <h1>Async Sort for Table</h1>
      <div className="table-async-sort__wrap">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          onChange={(action, extra) => {
            console.log(action, extra)

            if (!action.sorter?.column) {
              setData(initialData)
              setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
              return
            }

            // 对指定列进行远程排序
            if (action.sorter?.column?.dataKey === 'age') {
              setLoading(true)

              // 模拟远程排序，实际情况是调用接口获取排序后的数据
              return new Promise((resolve) => {
                setTimeout(() => {
                  const newData = [...data]
                  resolve(
                    newData.sort((a, b) => {
                      if (action.sorter?.order === 'ascend') {
                        return a.age - b.age
                      } else {
                        return b.age - a.age
                      }
                    })
                  )
                  setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
                  setData(newData)
                  setLoading(false)
                }, 1000)
              })
            }
          }}
        />
      </div>
    </>
  )
}
