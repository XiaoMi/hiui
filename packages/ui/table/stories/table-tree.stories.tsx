import React from 'react'
import Table from '../src'

/**
 * @title 树形表格
 */
export const TableTree = () => {
  return (
    <>
      <h1>TableTree for Table</h1>
      <div className="table-TableTree__wrap" style={{ minWidth: 660 }}>
        <Table
          // striped
          // fixedToColumn={'a'}
          // expandedRowKeys={[1]}
          // rowSelection={{}}
          // expandedRender={(row, index) => {
          //   return <div>12313</div>
          // }}
          // maxHeight={'calc(100vh - 900px)'}
          columns={[
            {
              title: 'A',
              dataKey: 'a',
              sorter(pre, next) {
                return pre.raw.b - next.raw.b
              },
            },
            { title: 'B', dataKey: 'b' },
            { title: 'C', dataKey: 'c' },
            { title: 'D', dataKey: 'd' },
          ]}
          data={[
            { a: 'a-4', b: '4', c: 'c-4', d: 'd-4', key: 4 },
            {
              a: 'a-3',
              b: '3',
              c: 'c-3',
              d: 'd-3',
              key: 3,
              children: [
                {
                  a: 'a-3-2',
                  b: '32',
                  c: 'c-3-2',
                  d: 'd-3-2',
                  key: 32,
                },
                {
                  a: 'a-3-1',
                  b: '31',
                  c: 'c-3-1',
                  d: 'd-3-1',
                  key: 31,
                },
              ],
            },
            {
              a: 'a-1',
              b: '1',
              c: 'c-1',
              d: 'd-1',
              key: 1,
              children: [
                { a: 'a-1-3', b: '13', c: 'c-1-3', d: 'd-1-3', key: 13 },
                {
                  a: 'a-1-1',
                  b: '11',
                  c: 'c-1-1',
                  d: 'd-1-1',
                  key: 11,
                  children: [
                    {
                      a: 'a-1-1-1',
                      b: '111',
                      c: 'c-1-1-1',
                      d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-1',
                      key: 111,
                    },
                    {
                      a: 'a-1-1-3',
                      b: '113',
                      c: 'c-1-1-3',
                      d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-3',
                      key: 113,
                    },
                    {
                      a: 'a-1-1-2',
                      b: '112',
                      c: 'c-1-1-2',
                      d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-2',
                      key: 112,
                    },
                  ],
                },
                { a: 'a-1-2', b: '12', c: 'c-1-2', d: 'd-1-2', key: 12 },
              ],
            },

            { a: 'a-2', b: '2', c: 'c-2', d: 'd-2', key: 2 },
          ]}
        />
      </div>
    </>
  )
}
