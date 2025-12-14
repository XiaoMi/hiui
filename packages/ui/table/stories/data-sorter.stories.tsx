import React from 'react'
import Table from '../src'

/**
 * @title 数据排序
 */
export const DataSorter = () => {
  const [columns] = React.useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 80,
      // defaultSortOrder: 'descend' as const,
      sorter(pre, next) {
        return pre.raw.age - next.raw.age
      },
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 180,
    },
    {
      title: 'Address',
      width: 240,
      dataKey: 'address',
    },
  ])
  const [data] = React.useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      phone: '18889898989',
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
  ])

  return (
    <>
      <h1>DataSorter for Table</h1>
      <div className="table-data-sorter__wrap">
        <Table columns={columns} data={data} onChange={console.log} />
      </div>
    </>
  )
}
