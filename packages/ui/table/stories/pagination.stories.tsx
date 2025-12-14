import React, { useState } from 'react'
import Table from '../src'

/**
 * @title 表格分页
 */
export const Pagination = () => {
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
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      email: 'jim.green@example.com',
      key: 4,
    },
    {
      name: 'Jane Doe',
      age: 30,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
      key: 5,
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      email: 'jim.green@example.com',
      key: 6,
    },
    {
      name: 'Jane Doe',
      age: 30,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
      key: 7,
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      email: 'jim.green@example.com',
      key: 8,
    },
  ])

  const [paginationState, setPaginationState] = React.useState({
    current: 1,
    data: data.slice(0, 5),
    pageSize: 5,
  })

  console.log('paginationState', paginationState)

  return (
    <>
      <h1>Pagination for Table</h1>
      <div className="table-pagination__wrap">
        <Table
          pagination={{
            showTotal: true,
            showJumper: true,
            pageSize: paginationState.pageSize,
            pageSizeOptions: [5, 10, 20],
            pageSizeOptionsOverlay: {
              // 该参数用来配置分页器下拉框的挂载容器，默认是 body，设置为 true 时，会自动寻找最近的元素作为父节点
              // 在浏览器原生的全屏模式中，需要将此值设成 true，否则无法正常显示，若无需在全屏状态下使用，则不需要做任何处理
              disabledPortal: true,
            },
            onPageSizeChange: (pageSize) => {
              setPaginationState((prev) => ({
                ...prev,
                pageSize,
              }))
            },
            total: data.length,
            current: paginationState.current,
            onChange: (page, pre, size = 5) => {
              console.log('onPaginationChange', page, pre, size)

              setPaginationState((prev) => ({
                ...prev,
                current: page,
                data: data.slice(size * (page - 1), size * page),
              }))
            },
          }}
          columns={columns}
          data={paginationState.data}
        />
      </div>
    </>
  )
}
