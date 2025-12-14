import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 页脚吸底
 */
export const StickyFooter = () => {
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
    {
      name: 'John Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'john.doe@example.com',
      key: 4,
    },
    {
      name: 'Jane Doe',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jane.doe@example.com',
      key: 5,
    },
    {
      name: 'Jim Beam',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jim.beam@example.com',
      key: 6,
    },
    {
      name: 'Jill Bean',
      age: 37,
      address: '12 Blossom Close, Newcrest',
      email: 'jill.bean@example.com',
      key: 7,
    },
  ])

  const [paginationState, setPaginationState] = React.useState({
    current: 0,
    data: data.slice(0, 5),
  })

  return (
    <>
      <h1>StickyFooter for Table</h1>
      <div className="table-sticky-footer__wrap">
        <Table
          stickyFooter
          maxHeight={200}
          pagination={{
            showTotal: true,
            showJumper: true,
            pageSize: 5,
            total: data.length,
            current: paginationState.current,
            onChange: (page, pre, size = 5) => {
              console.log('onPaginationChange', page, pre, size)

              setPaginationState({
                current: page,
                data: data.slice(size * (page - 1), size * page),
              })
            },
          }}
          columns={columns}
          data={paginationState.data}
        />
      </div>
    </>
  )
}
