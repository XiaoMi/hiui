import React, { useState } from 'react'
import List from '@hi-ui/list'
import Table, { TableSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 对表格各区域进行细粒度样式控制
 */
export const Semantic = () => {
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

  const [selected, setSelected] = useState<TableSemanticName>()

  return (
    <>
      <h1>Semantic for Table</h1>
      <div
        className="table-semantic__wrap"
        style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Table
            columns={columns}
            data={data}
            // fixedToColumn={{ left: 'name', right: 'email' }}
            pagination={{ pageSize: 10, total: 100 }}
            classNames={{
              root: 'my-table__root',
              wrapper: 'my-table__wrapper',
              content: 'my-table__content',
              table: 'my-table__table',
              header: 'my-table__header',
              headerRow: 'my-table__header-row',
              headerCell: 'my-table__header-cell',
              body: 'my-table__body',
              bodyRow: 'my-table__body-row',
              bodyCell: 'my-table__body-cell',
              cell: 'my-table__cell',
              footer: 'my-table__footer',
              freezeShadowLeft: 'my-table__freeze-left',
              freezeShadowRight: 'my-table__freeze-right',
            }}
            styles={{
              content: { overflow: 'unset' },
              ...(selected ? { [selected]: { outline: '2px solid #ffbe0a' } } : {}),
            }}
          />
        </div>
        <div style={{ width: 280, flexShrink: 0 }}>
          <List
            split={false}
            data={[
              { title: 'root', description: '表格根容器' },
              { title: 'wrapper', description: '表格包装层' },
              { title: 'content', description: '表格内容滚动区' },
              { title: 'table', description: '原生 table 元素' },
              { title: 'headerRow', description: '表头行 (thead tr)' },
              { title: 'headerCell', description: '表头单元格 (th)' },
              { title: 'bodyRow', description: '表体行 (tbody tr)' },
              { title: 'bodyCell', description: '表体单元格 (td)' },
              { title: 'cell', description: '单元格通用（同时作用于 th/td）' },
              { title: 'footer', description: '页脚（如分页）' },
            ]}
            render={(dataItem) => (
              <div
                onMouseEnter={() => setSelected(dataItem.title as TableSemanticName)}
                onMouseLeave={() => setSelected(undefined)}
              >
                <List.Item title={dataItem.title} description={dataItem.description} />
              </div>
            )}
          />
        </div>
      </div>
    </>
  )
}
