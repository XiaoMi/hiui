import React from 'react'
import Table from '../src'

/**
 * @title 表头列合并
 * @desc 只支持表头列合并，被合并的表头需要设置 colSpan 为 0，则该表头不显示
 */
export const HeaderColSpan = () => {
  return (
    <>
      <h1>Header ColSpan</h1>
      <div className="table-header-colspan__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table
          bordered
          columns={[
            {
              title: '商品名',
              dataKey: 'name',
              width: 100,
              align: 'center',
              render: (text, row) => {
                console.log(text, row)
                return text + '*'
              },
            },
            {
              title: '品类 + 型号',
              dataKey: 'type',
              align: 'center',
              width: 100,
              colSpan: 2,
            },
            {
              title: '规格',
              dataKey: 'size',
              width: 100,
              colSpan: 0,
            },
            {
              title: '单价',
              dataKey: 'price',
              width: 100,
            },
            {
              title: '门店 + 库存',
              dataKey: 'address',
              align: 'center',
              width: 100,
              colSpan: 2,
            },
            {
              title: '库存',
              dataKey: 'stock',
              width: 100,
              colSpan: 0,
            },
          ]}
          data={[
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
              stock: '12,000',
              key: 5,
            },
          ]}
        />
      </div>
    </>
  )
}
