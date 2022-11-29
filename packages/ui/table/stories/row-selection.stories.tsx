import React from 'react'
import Table from '../src'

/**
 * @title 行选中
 */
export const RowSelection = () => {
  const [columns] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
      width: 120,
    },
    {
      title: '品类',
      dataKey: 'type',
      width: 80,
    },
    {
      title: '规格',
      dataKey: 'size',
      width: 150,
    },
    {
      title: '单价',
      dataKey: 'price',
      width: 150,
    },
    {
      title: '门店',
      dataKey: 'address',
      width: 240,
    },
    {
      title: '库存',
      dataKey: 'stock',
      width: 150,
    },
  ])
  const [dataSource] = React.useState([
    {
      name: '小米9',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      address: '华润五彩城店',
      stock: '29,000',
      key: 1,
    },
    {
      name: '小米9 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '1999.00',
      address: '清河店',
      stock: '10,000',
      key: 2,
    },
    {
      name: '小米8',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '2599.00',
      address: '双安店',
      stock: '12,000',
      key: 3,
    },
    {
      name: 'Redmi Note7',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '999.00',
      address: '华润五彩城店',
      stock: '140,000',
      key: 4,
    },
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      address: '双安店',
      stock: '12,000',
      key: 5,
    },
    {
      name: '小米10',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      address: '华润五彩城店',
      stock: '29,000',
      key: 6,
    },
    {
      name: '小米10 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '1999.00',
      address: '清河店',
      stock: '10,000',
      key: 7,
    },
    {
      name: '小米8',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '2599.00',
      address: '双安店',
      stock: '12,000',
      key: 8,
    },
    {
      name: 'Redmi Note7',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '999.00',
      address: '华润五彩城店',
      stock: '140,000',
      key: 9,
    },
    // {
    //   name: '小米8 SE',
    //   type: '手机',
    //   size: '6G+64G 幻彩蓝',
    //   price: '699.00',
    //   address: '双安店',
    //   stock: '12,000',
    //   key: 10,
    // },
  ])

  const [paginationState, setPaginationState] = React.useState({
    current: 1,
    data: dataSource.slice(0, 5),
    pageSize: 5,
  })

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<any>([])

  return (
    <>
      <h1>RowSelection for Table</h1>
      <div className="table-row-selection__wrap" style={{ minWidth: 660 }}>
        <Table
          fixedToColumn={{ left: 'type' }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, target, shouldChecked, rows) => {
              console.log(keys, target, shouldChecked, rows)

              setSelectedRowKeys(keys)
            },
          }}
          pagination={{
            showTotal: true,
            showJumper: true,
            pageSize: paginationState.pageSize,
            pageSizeOptions: [5, 10, 20],
            onPageSizeChange: (pageSize) => {
              setPaginationState((prev) => ({
                ...prev,
                pageSize,
              }))
            },
            total: dataSource.length,
            current: paginationState.current,
            onChange: (page, pre, size = 5) => {
              console.log('onPaginationChange', page, pre, size)

              setPaginationState((prev) => ({
                ...prev,
                current: page,
                data: dataSource.slice(size * (page - 1), size * page),
              }))
            },
          }}
          columns={columns}
          data={paginationState.data}
        />
      </div>
    </>
  )
}
