import React from 'react'
import List from '../src'

/**
 * @title 基础用法
 * @desc 常用在数据管理、信息展示等领域
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="list-basic__wrap">
        <div style={{ backgroundColor: '#f5f8fc', padding: 16 }}>
          <List
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
            data={[
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
                avatar: 'https://xiaomi.github.io/hiui/logo.png',
              },
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
                avatar: 'https://xiaomi.github.io/hiui/logo.png',
              },
              {
                title: '当前这里是标题信息',
                description:
                  '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
                avatar: 'https://xiaomi.github.io/hiui/logo.png',
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
