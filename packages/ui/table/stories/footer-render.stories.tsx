import React from 'react'
import Table from '../src'

/**
 * @title 自定义页脚
 */
export const FooterRender = () => {
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
    current: 1,
    data: dataSource.slice(0, 5),
  })

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<any>([])

  return (
    <>
      <h1>FooterRender for Table</h1>
      <div className="table-footer-render__wrap" style={{ minWidth: 660 }}>
        <Table
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
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, target, shouldChecked, rows) => {
              console.log(keys, target, shouldChecked, rows)

              setSelectedRowKeys(keys)
            },
          }}
          footerRender={(pagination) => {
            return (
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  已选 <span style={{ color: '#237ffa' }}>{selectedRowKeys.length}</span> 项
                </div>
                {pagination}
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
