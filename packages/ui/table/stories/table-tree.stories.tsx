import React from 'react'
import Table from '../src'

export const TableTree = () => {
  return (
    <>
      <h1>TableTree for Table</h1>
      <div className="table-TableTree__wrap" style={{ width: 800 }}>
        <Table
          // 受控
          // expandedRowKeys={[1]}
          rowSelection={{}}
          expandedRender={(row, index) => {
            return <div>12313</div>
          }}
          // fixedToColumn={'a'}
          data={[
            {
              a: 'a-1',
              b: 'b-1',
              c: 'c-1',
              d: 'd-1',
              key: 1,
              children: [
                {
                  a: 'a-1-1',
                  b: 'b-1-1',
                  c: 'c-1-1',
                  d: 'd-1-1',
                  key: '1-1',
                  children: [
                    {
                      a: 'a-1-1-1',
                      b: 'b-1-1-1',
                      c: 'c-1-1-1',
                      d:
                        'd-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1',
                      key: '1-1-1',
                    },
                    { a: 'a-1-1-2', b: 'b-1-1-2', c: 'c-1-1-2', d: 'd-1-1-2', key: '1-1-2' },
                  ],
                },
                { a: 'a-1-2', b: 'b-1-2', c: 'c-1-2', d: 'd-1-2', key: '1-2' },
              ],
            },
            { a: 'a-2', b: 'b-2', c: 'c-2', d: 'd-2', key: 2 },
            { a: 'a-3', b: 'b-3', c: 'c-3', d: 'd-3', key: 3 },
            { a: 'a-4', b: 'b-4', c: 'c-4', d: 'd-4', key: 4 },
          ]}
          columns={[
            { title: 'A', dataKey: 'a' },
            { title: 'B', dataKey: 'b' },
            { title: 'C', dataKey: 'c' },
            { title: 'D', dataKey: 'd' },
          ]}
        />
      </div>
    </>
  )
}
