import React from 'react'
import Table from '../src'

/**
 * @title 设置表格行类名
 */
export const RowClassName = () => {
  // 实际使用中可以直接将样式写在样式文件中，不必这样动态创建style标签，此处只是做示例展示
  React.useLayoutEffect(() => {
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.appendChild(
      document.createTextNode(`
        .table-row--price-normal .hi-v4-table-cell {
          background: #e5feeb;
        }
        .table-row--price-warning .hi-v4-table-cell {
          background: #fefae0;
        }
        .hi-v4-table-row .table-cell--stock-danger {
          background: #fee9e5;
        }
      `)
    )
    head.appendChild(style)
  }, [])

  return (
    <>
      <h1>RowClassName for Table</h1>
      <div className="table-row-class-name__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table
          rowClassName={(record, index) => {
            const { price } = record.raw
            if (price > 2000) {
              return 'table-row--price-warning'
            }
            return 'table-row--price-normal'
          }}
          cellClassName={(record, column, index) => {
            if (column.raw.dataKey === 'stock' && record.raw.stock <= 10000) {
              return 'table-cell--stock-danger'
            }
            return ''
          }}
          columns={[
            {
              title: '商品名',
              dataKey: 'name',
              render: (text, row) => {
                console.log(text, row)
                return text + '*'
              },
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
          ]}
          data={[
            {
              name: '小米9',
              type: '手机',
              size: '6G+64G',
              price: '3299.00',
              address: '华润五彩城店',
              stock: '29000',
              key: 1,
            },
            {
              name: '小米9 SE',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '1999.00',
              address: '清河店',
              stock: '10000',
              key: 2,
            },
            {
              name: '小米8',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '2599.00',
              address: '双安店',
              stock: '12000',
              key: 3,
            },
            {
              name: 'Redmi Note7',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '999.00',
              address: '华润五彩城店',
              stock: '140000',
              key: 4,
            },
            {
              name: '小米8 SE',
              type: '手机',
              size: '6G+64G 幻彩蓝',
              price: '699.00',
              address: '双安店',
              stock: '12000',
              key: 5,
            },
          ]}
        />
      </div>
    </>
  )
}
