import React from 'react'
import List from '../src'

/**
 * @title 不带分割线
 */
export const NoSplit = () => {
  return (
    <>
      <h1>不带分割线</h1>
      <div className="list-basic__wrap">
        <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
          <List
            split={false}
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
            data={[
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              },
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              },
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
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
