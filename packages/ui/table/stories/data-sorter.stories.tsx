import React from 'react'
import Table from '../src'

/**
 * @title 数据排序
 */
export const DataSorter = () => {
  const [columns] = React.useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
      key: 1,
    },
    {
      title: 'Age',
      dataKey: 'age',
      key: 2,
      width: 80,
      sorter(pre, next) {
        return pre.raw.age - next.raw.age
      },
    },
    {
      title: 'Home phone',
      width: 180,
      dataKey: 'tel',
      key: 3,
    },
    {
      title: 'Home phone1',
      dataKey: 'tel1',
      width: 180,
      key: 4,
    },
    {
      title: 'Home phone2',
      width: 180,
      dataKey: 'tel2',
      key: 5,
    },
    {
      title: 'Home phone3',
      width: 180,
      dataKey: 'tel3',
      key: 6,
    },
    {
      title: 'Home phone4',
      width: 180,
      dataKey: 'tel4',
      key: 7,
    },
    {
      title: 'Home phone5',
      width: 180,
      dataKey: 'tel5',
      key: 8,
    },
    {
      title: 'Home phone6',
      width: 180,
      dataKey: 'tel6',
      key: 9,
    },
    {
      title: 'Home phone7',
      width: 180,
      dataKey: 'tel7',
      key: 10,
    },
    {
      title: 'Home phone8',
      width: 180,
      dataKey: 'tel8',
      key: 11,
    },
    {
      title: 'Home phone9',
      width: 180,
      dataKey: 'tel9',
      key: 12,
    },
    {
      title: 'Home phone10',
      width: 180,
      dataKey: 'tel10',
      key: 13,
    },
    {
      title: 'Home phone11',
      width: 180,
      dataKey: 'tel11',
      key: 14,
    },

    {
      title: 'Home phone12',
      width: 180,
      dataKey: 'tel12',
      key: 15,
    },

    {
      title: 'Phone',
      dataKey: 'phone',
      width: 180,
      key: 16,
      sorter(pre, next) {
        return pre.phone - next.phone
      },
    },
    {
      title: 'Address',
      width: 240,
      dataKey: 'address',
      key: 17,
    },
  ])
  const [data] = React.useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      tel: '0571-22098909',
      tel1: '0571-22098909',
      tel2: '0571-22098909',
      tel3: '0571-22098909',
      tel4: '0571-22098909',
      tel5: '0571-22098909',
      tel6: '0571-22098909',
      tel7: '0571-22098909',
      tel8: '0571-22098909',
      tel9: '0571-22098909',
      tel10: '0571-22098909',
      tel11: '0571-22098909',
      tel12: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      tel1: '0571-22098909',
      tel2: '0571-22098909',
      tel3: '0571-22098909',
      tel4: '0571-22098909',
      tel5: '0571-22098909',
      tel6: '0571-22098909',
      tel: '0575-22098909',
      tel7: '0571-22098909',
      tel8: '0571-22098909',
      tel9: '0571-22098909',
      tel10: '0571-22098909',
      tel11: '0571-22098909',
      tel12: '0571-22098909',
      phone: 18900010002,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      tel1: '0571-22098909',
      tel2: '0571-22098909',
      tel3: '0571-22098909',
      tel4: '0571-22098909',
      tel5: '0571-22098909',
      tel6: '0571-22098909',
      tel: '0575-22098909',
      tel7: '0571-22098909',
      tel8: '0571-22098909',
      tel9: '0571-22098909',
      tel10: '0571-22098909',
      tel11: '0571-22098909',
      tel12: '0571-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park',
    },
    {
      key: '5',
      name: 'Jake White',
      age: 18,
      tel1: '0571-22098909',
      tel2: '0571-22098909',
      tel3: '0571-22098909',
      tel4: '0571-22098909',
      tel5: '0571-22098909',
      tel6: '0571-22098909',
      tel: '0575-22098909',
      tel7: '0571-22098909',
      tel8: '0571-22098909',
      tel9: '0571-22098909',
      tel10: '0571-22098909',
      tel11: '0571-22098909',
      tel12: '0571-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      phone: 18889898888,
      tel: '0571-22098909',
      tel1: '0571-22098909',
      tel2: '0571-22098909',
      tel3: '0571-22098909',
      tel4: '0571-22098909',
      tel5: '0571-22098909',
      tel6: '0571-22098909',
      tel7: '0571-22098909',
      tel8: '0571-22098909',
      tel9: '0571-22098909',
      tel10: '0571-22098909',
      tel11: '0571-22098909',
      tel12: '0571-22098909',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
  ])

  return (
    <>
      <h1>DataSorter for Table</h1>
      <div className="table-data-sorter__wrap" style={{ minWidth: 660, background: '#fff' }}>
        <Table columns={columns} data={data} onChange={console.log} />
      </div>
    </>
  )
}
