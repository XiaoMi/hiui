import React from 'react'
import Button from '@hi-ui/button'
import List from '../src'

/**
 * @title 带边框
 */
export const Bordered = () => {
  return (
    <>
      <h1>Bordered</h1>
      <div className="list-bordered__wrap">
        <List
          bordered
          data={[
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'https://xiaomi.github.io/hiui/logo.png',
              action: (
                <Button type="primary" appearance="text">
                  操作
                </Button>
              ),
            },
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'https://xiaomi.github.io/hiui/logo.png',
              action: (
                <Button type="primary" appearance="text">
                  操作
                </Button>
              ),
            },
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'https://xiaomi.github.io/hiui/logo.png',
              action: (
                <Button type="primary" appearance="text">
                  操作
                </Button>
              ),
            },
          ]}
          render={(dataItem) => {
            return <List.Item {...dataItem} />
          }}
        />
      </div>
    </>
  )
}
