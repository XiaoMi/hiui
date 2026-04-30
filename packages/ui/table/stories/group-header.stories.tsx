import React from 'react'
import Table, { TableColumnItem } from '../src'

/**
 * @title 表头分组
 * @desc 当列数较少且数据为空时，表头可能显示异常，可配置 <code>needDoubleTable</code> 为 <code>true</code> 来解决
 */
export const GroupHeader = () => {
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
          width: 80,
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
                  width: 90,
                },
                {
                  title: 'Door No.',
                  dataKey: 'number',
                  width: 90,
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
      title: 'Company',
      dataKey: 'company',
      children: [
        {
          title: 'Address',
          dataKey: 'companyAddress',
          width: 200,
        },
        {
          title: 'Name',
          dataKey: 'companyName',
          width: 150,
        },
      ],
    },
    {
      title: 'Gender',
      dataKey: 'gender',
      width: 100,
    },
  ])

  const [data] = React.useState(() => {
    const data: any[] = []
    for (let i = 0; i < 6; i++) {
      const item = {
        key: i + 1,
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        name: 'Flcwl',
        name2: 'Flcwl2',
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
      }

      data.push(item)
    }

    return data
  })

  return (
    <>
      <h1>GroupHeader for Table</h1>
      <div className="table-group-header__wrap">
        <Table
          rowSelection={{}}
          fixedToColumn={{
            left: 'name',
            right: 'gender',
          }}
          columns={columns}
          data={data}
        />
      </div>
    </>
  )
}
