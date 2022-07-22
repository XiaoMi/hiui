import React from 'react'
import Table from '../src'

/**
 * @title 表脚底部
 */
export const StickyFooter = () => {
  const [columns] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
    },
    {
      title: '品类',
      dataKey: 'type',
    },
    {
      title: '规格',
      dataKey: 'size',
    },
    {
      title: '单价',
      dataKey: 'price',
    },
    {
      title: '门店',
      dataKey: 'address',
    },
    {
      title: '库存',
      dataKey: 'stock',
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
    {
      name: '小米8 SE',
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '699.00',
      address: '双安店',
      stock: '12,000',
      key: 10,
    },
  ])

  const [paginationState, setPaginationState] = React.useState({
    current: 0,
    data: dataSource.slice(0, 5),
  })

  console.log('paginationState', paginationState)

  return (
    <>
      <h1>StickyFooter for Table</h1>
      <div className="table-sticky-footer__wrap" style={{ minWidth: 660 }}>
        <Table
          stickyFooter
          maxHeight={200}
          pagination={{
            showTotal: true,
            showJumper: true,
            pageSize: 5,
            total: dataSource.length,
            current: paginationState.current,
            onChange: (page, pre, size = 5) => {
              console.log('onPaginationChange', page, pre, size)

              setPaginationState({
                current: page,
                data: dataSource.slice(size * (page - 1), size * page),
              })
            },
          }}
          columns={columns}
          data={paginationState.data}
        />
      </div>
    </>
  )
}
