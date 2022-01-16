import React from 'react'
import Table, { TableColumnItem } from '../src'

export const StickyHeader = () => {
  const [columns] = React.useState<TableColumnItem[]>([
    {
      title: 'Name',
      dataKey: 'name',
      width: 100,
    },
    {
      title: 'Other',
      dataKey: 'other',
      children: [
        {
          title: 'Age',
          dataKey: 'age',
          width: 100,
        },
        {
          title: 'Address',
          dataKey: 'address',
          children: [
            {
              title: 'Street',
              dataKey: 'street',
              width: 100,
            },
            {
              title: 'Block',
              dataKey: 'block',
              children: [
                {
                  title: 'Building',
                  dataKey: 'building',
                  width: 100,
                },
                {
                  title: 'Door No.',
                  dataKey: 'number',
                  width: 100,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Name2',
      dataKey: 'name2',
      width: 100,
    },
    {
      title: 'Name3',
      dataKey: 'name3',
      width: 100,
    },
    {
      title: 'Name4',
      dataKey: 'name4',
      width: 100,
    },
    {
      title: 'Name5',
      dataKey: 'name5',
      width: 100,
    },
    {
      title: 'Name6',
      dataKey: 'name6',
      width: 100,
    },
    {
      title: 'Name7',
      dataKey: 'name7',
      width: 100,
    },
    {
      title: 'Name8',
      dataKey: 'name8',
      width: 100,
    },
    {
      title: 'Name9',
      dataKey: 'name9',
      width: 100,
    },
    {
      title: 'Name10',
      dataKey: 'name10',
      width: 100,
    },
    {
      title: 'Company',
      dataKey: 'company',
      children: [
        {
          title: 'Address',
          dataKey: 'companyAddress',
          width: 100,
        },
        {
          title: 'Name',
          dataKey: 'companyName',
          width: 100,
        },
      ],
    },
    {
      title: 'Name11',
      dataKey: 'name11',
      width: 100,
    },
    {
      title: 'Name12',
      dataKey: 'name12',
      width: 100,
    },
    {
      title: 'Name13',
      dataKey: 'name13',
      width: 100,
    },
    {
      title: 'Name14',
      dataKey: 'name14',
      width: 100,
    },
    {
      title: 'Gender',
      dataKey: 'gender',
      width: 100,
    },
  ])

  const [data] = React.useState(() => {
    const data = []
    for (let i = 0; i < 6; i++) {
      const item = {
        key: i + 1,
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        name: 'John Brown',
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
      }

      for (let j = 2; j <= 14; j++) {
        item[`name${j}`] = `name${j}`
      }

      data.push(item)
    }

    return data
  })

  return (
    <>
      <h1>StickyHeader for Table</h1>
      <div
        className="table-sticky-header__wrap"
        style={{ width: 800, maxHeight: 1000, overflow: 'scroll' }}
      >
        <Table
          sticky
          stickyTop={0}
          fixedToColumn={{
            // left: 'building',
            // left: 'address',
            left: 'number',
            right: 'gender',
            // right: 'companyName',
            // right: 'companyAddress',
          }}
          columns={columns}
          data={data}
        />
        <div style={{ height: 800 }}>模拟外层滚动</div>
      </div>
    </>
  )
}
