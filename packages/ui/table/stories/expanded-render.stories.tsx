import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 内嵌面板
 */
export const ExpandedRender = () => {
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

  return (
    <>
      <h1>ExpandedRender for Table</h1>
      <div className="table-expanded-render__wrap">
        <Table
          fixedToColumn={{ left: 'type' }}
          columns={columns}
          expandedRender={() => {
            return (
              <div style={{ backgroundColor: '#fff', padding: 24, textAlign: 'center' }}>
                此处是自定义展开渲染内容
              </div>
            )
          }}
          data={data}
        />
      </div>
    </>
  )
}
