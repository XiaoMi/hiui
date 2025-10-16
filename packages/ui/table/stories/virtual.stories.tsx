import React from 'react'
import Table, { TableHelper } from '../src'
import Button from '@hi-ui/button'
/**
 * @title 虚拟列表
 */
export const Virtual = () => {
  const MockData: any = []
  for (let index = 0; index < 10000; index++) {
    MockData.push({
      name: '小米-' + index,
      type: '手机',
      size: '6G+64G 幻彩蓝',
      price: '3299.00',
      operation: '查看',
    })
  }
  const [column] = React.useState([
    {
      title: '商品名',
      dataKey: 'name',
      width: 300,
    },
    {
      title: '品类',
      dataKey: 'type',
      width: 200,
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
      title: '操作',
      dataKey: 'operation',
      width: 150,
    },
  ])
  const [data] = React.useState(MockData)
  const tableRef = React.useRef<TableHelper>(null)

  return (
    <>
      <h1>Virtual for Table</h1>
      <div className="table-virtual__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <div style={{ marginBottom: '1em' }}>
          <Button
            onClick={() => {
              // key 为节点 id
              tableRef.current?.scrollTo?.({ key: '小米-1000', align: 'top' })
            }}
          >
            scroll to key: 小米-1000
          </Button>
        </div>
        <Table
          fieldKey="name"
          columns={column}
          data={data}
          virtual={true}
          innerRef={tableRef}
          // virtual={{
          //   onVisibleChange(...args) {
          //     console.log('onVisibleChange', ...args)
          //   },
          // }}
          fixedToColumn={{ right: 'operation' }}
        />
      </div>
    </>
  )
}
