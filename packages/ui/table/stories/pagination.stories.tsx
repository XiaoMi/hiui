import React from 'react'
import Table from '../src'

/**
 * @title 表格分页
 */
export const Pagination = () => {
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

  console.log('paginationState', paginationState)

  return (
    <>
      <h1>Pagination for Table</h1>
      <div className="table-pagination__wrap" style={{ minWidth: 660 }}>
        <Table
          pagination={{
            showTotal: true,
            showJumper: true,
            pageSize: paginationState.pageSize,
            pageSizeOptions: [5, 10, 20],
            pageSizeOptionsOverlay: {
              // 该参数用来配置分页器下拉框的挂载容器，默认是 body，设置为 true 时，会自动寻找最近的元素作为父节点
              // 在浏览器原生的全屏模式中，需要将此值设成 true，否则无法正常显示，若无需在全屏状态下使用，则不需要做任何处理
              disabledPortal: true,
            },
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
