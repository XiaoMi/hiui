import React, { useState } from 'react'
import Table from '../src'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 可调节列宽
 * @desc 表头分组不支持拖拽调节列宽
 */
export const Resizable = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
      render(text: string) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataKey: 'address',
      width: 200,
      // 注：当 title 长度过长时，可设置 minWidth 来保证列头最小宽度
      minWidth: 100,
      render(text: string) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
    },
    {
      title: 'Email',
      dataKey: 'email',
      width: 200,
      render(text: string) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 200,
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
      width: 200,
    },
  ])

  const [data] = useState([
    {
      name: 'Raynor Maverick',
      age: 31,
      address: '45 Sunbeam Lane, Mistville',
      email: 'raynor.mav@maildemo.net',
      phone: '1234567890',
      phone2: '1234567890',
      key: 1,
    },
    {
      name: 'Elina Voss',
      age: 26,
      address: '83 Dewdrop Road, Rivertown',
      email: 'elina.voss@sampleinbox.cc',
      phone: '1234567890',
      phone2: '1234567890',
      key: 2,
    },
    {
      name: 'Darin Poe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'darin.poe@mockpost.io',
      phone: '1234567890',
      phone2: '1234567890',
      key: 3,
    },
  ])

  return (
    <>
      <h1>Resizable for Table</h1>
      <div className="table-resizable__wrap" style={{ minWidth: 660 }}>
        <Table
          resizable
          // 可选，拖拽过程中想要实现表格宽度自由拉伸，可配置该参数
          tableWidthAdjustOnResize
          onResizeStop={(e, data, index, columnsWidth) => {
            console.log('onResizeStop', e, data, index, columnsWidth)
          }}
          columns={columns}
          data={data}
        />
      </div>
    </>
  )
}
