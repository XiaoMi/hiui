import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 列筛选
 */
export const ColMenu = () => {
  const [columns] = useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 200,
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
    },
    {
      title: 'Email',
      dataKey: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataKey: 'phone',
      width: 150,
    },
    {
      title: 'Phone2',
      dataKey: 'phone2',
      width: 150,
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
      <h1>ColMenu for Table</h1>
      <div className="table-col-menu__wrap">
        <Table
          columns={columns}
          data={data}
          showColMenu
          onHighlightedCol={(changedColInfo, highlightedColKeys) => {
            console.log(changedColInfo, highlightedColKeys)
          }}
          onChange={(sorter, extra) => {
            console.log(sorter, extra)
          }}
        />
      </div>
    </>
  )
}
