import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 表头吸顶
 */
export const StickyHeader = () => {
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
      <h1>StickyHeader for Table</h1>
      <div className="table-sticky-header__wrap" style={{ maxHeight: 500, overflow: 'scroll' }}>
        <Table sticky stickyTop={0} columns={columns} data={data} />
        <div style={{ height: 400, paddingTop: 48, textAlign: 'center' }}>模拟外层滚动</div>
      </div>
    </>
  )
}
