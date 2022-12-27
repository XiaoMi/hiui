import React from 'react'
import Table from '../src'

/**
 * @title 异步加载 children
 */
export const OnLoadChildren = () => {
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

  const [data] = React.useState([
    {
      name: '小米9',
      type: '手机',
      size: '6G+64G',
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
      stock: '13,000',
      key: 5,
    },
  ])

  return (
    <>
      <h1>OnLoadChildren for Table</h1>
      <div className="table-basic__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table
          columns={columns}
          data={data}
          fieldKey="stock"
          onLoadChildren={(item) => {
            const { depth } = item
            console.log('item', item)
            return new Promise((resolve) => {
              setTimeout(() => {
                // 模拟无子节点情况处理
                if (depth > 0) {
                  resolve([])
                } else {
                  const children = [
                    {
                      name: '小米10',
                      type: '手机',
                      size: '6G+64G',
                      price: '3299.00',
                      address: '华润五彩城店',
                      stock: '100',
                      key: new Date().getTime(),
                    },
                    {
                      name: '小米11',
                      type: '手机',
                      size: '6G+64G',
                      price: '3299.00',
                      address: '华润五彩城店',
                      stock: '200',
                      key: new Date().getTime() + 1,
                    },
                  ]
                  resolve(children)
                }
              }, 1000)
            })
          }}
        />
      </div>
    </>
  )
}
