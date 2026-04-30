import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 设置表格行和单元格类名
 * @desc 用于自定义行和单元格的个性化样式
 */
export const RowClassName = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
    },
    {
      title: 'Age',
      dataKey: 'age',
    },
    {
      title: 'Address',
      dataKey: 'address',
    },
    {
      title: 'Email',
      dataKey: 'email',
    },
  ])

  const [data] = useState([
    {
      name: 'Raynor Maverick',
      age: 31,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 26,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      key: 3,
    },
  ])

  // 实际使用中可以直接将样式写在样式文件中，不必这样动态创建style标签，此处只是做示例展示
  React.useLayoutEffect(() => {
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.appendChild(
      document.createTextNode(`
        .table-row--price-normal .hi-v5-table-cell {
          background: #e5feeb;
        }
        .table-row--price-warning .hi-v5-table-cell {
          background: #fefae0;
        }
        .hi-v5-table-row .table-cell--stock-danger {
          background: #fee9e5;
        }
      `)
    )
    head.appendChild(style)
  }, [])

  return (
    <>
      <h1>RowClassName for Table</h1>
      <div className="table-row-class-name__wrap">
        <Table
          rowClassName={(record) => {
            const { age } = record.raw
            if (age > 30) {
              return 'table-row--price-warning'
            }
            return 'table-row--price-normal'
          }}
          cellClassName={(record, column) => {
            if (column.raw.dataKey === 'age' && record.raw.age <= 30) {
              return 'table-cell--stock-danger'
            }
            return ''
          }}
          columns={columns}
          data={data}
        />
      </div>
    </>
  )
}
