import React from 'react'
import Button from '@hi-ui/button'
import Table, { TableColumnSortOrder } from '../src'

/**
 * @title 受控的数据排序
 */
export const DataSorterControl = () => {
  const [sortOrder, setSortOrder] = React.useState<TableColumnSortOrder>(null)

  const columns = [
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 80,
      sortOrder,
      sorter(pre, next) {
        return pre.raw.age - next.raw.age
      },
    },
    {
      title: 'Home phone',
      width: 180,
      dataKey: 'phone',
    },
    {
      title: 'Address',
      width: 240,
      dataKey: 'address',
    },
  ]
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
      <h1>Controlled DataSorter for Table</h1>
      <div className="table-data-sorter-control__wrap">
        <Button onClick={() => setSortOrder('descend')} style={{ marginBottom: 10 }}>
          Sort age
        </Button>
        <Table
          columns={columns}
          data={data}
          onChange={(action, extra) => {
            console.log('action', action, extra)
            setSortOrder((action.sorter?.order ?? null) as TableColumnSortOrder)
          }}
        />
      </div>
    </>
  )
}
