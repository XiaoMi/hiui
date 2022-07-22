import React from 'react'
import Table from '../src'

/**
 * @title 合并单元格
 */
export const MergedCell = () => {
  return (
    <>
      <h1>MergedCell for Table</h1>
      <div className="table-merged-cell__wrap" style={{ minWidth: 660 }}>
        <Table
          striped
          columns={[
            {
              title: 'Name',
              dataKey: 'name',
              width: 150,
              render: (text, row, index) => {
                return {
                  children: <span>{text}</span>,
                  props: {
                    // 自定义单元格列合并
                    colSpan: index === 4 ? 4 : undefined,
                  },
                }
              },
            },
            {
              title: 'Age',
              dataKey: 'age',
              width: 150,
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    // 自定义单元格行合并（第 2 ~ 3 行）
                    rowSpan: index === 1 ? 2 : index === 2 ? 0 : undefined,
                    // 自定义单元格列合并（第 4 行）
                    colSpan: index === 4 ? 0 : undefined,
                  },
                }
              },
            },
            {
              title: 'Home phone',
              dataKey: 'tel',
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    colSpan: index === 4 ? 0 : undefined,
                  },
                }
              },
            },
            {
              title: 'Address',
              dataKey: 'address',
              render: (value, row, index) => {
                return {
                  children: value,
                  props: {
                    colSpan: index === 4 ? 0 : undefined,
                  },
                }
              },
            },
          ]}
          data={[
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              tel: '0571-22098909',
              address: 'New York No. 1 Lake Park',
            },
            {
              key: '2',
              name: 'Jim Green',
              tel: '0571-22098333',
              age: 42,
              address: 'London No. 1 Lake Park',
            },
            {
              key: '3',
              name: 'Joe Black',
              age: 32,
              tel: '0575-22098909',
              address: 'Sidney No. 1 Lake Park',
            },
            {
              key: '4',
              name: 'Jim Red',
              age: 18,
              tel: '0575-22098909',
              address: 'London No. 2 Lake Park',
            },
            {
              key: '5',
              name: 'Jake White',
              age: 18,
              tel: '0575-22098909',
              address: 'Dublin No. 2 Lake Park',
            },
          ]}
        />
      </div>
    </>
  )
}
