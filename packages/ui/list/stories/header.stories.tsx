import React from 'react'
import List from '../src'

/**
 * @title 列表头部
 */
export const Header = () => {
  return (
    <>
      <h1>Header</h1>
      <div className="list-header__wrap">
        <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
          <List
            header={<div>列表头部</div>}
            data={[
              {
                title: '1、当前这里是标题信息',
              },
              {
                title: '2、当前这里是标题信息',
              },
              {
                title: '3、当前这里是标题信息',
              },
            ]}
            render={(dataItem) => {
              return <List.Item {...dataItem} />
            }}
          />
          <br />
          <List
            split={false}
            header={<div>列表头部</div>}
            data={[
              {
                title: '1、当前这里是标题信息',
              },
              {
                title: '2、当前这里是标题信息',
              },
              {
                title: '3、当前这里是标题信息',
              },
            ]}
            render={(dataItem) => {
              return <List.Item {...dataItem} />
            }}
          />
        </div>
      </div>
    </>
  )
}
