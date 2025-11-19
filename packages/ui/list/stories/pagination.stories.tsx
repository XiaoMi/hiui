import React from 'react'
import Button from '@hi-ui/button'
import List from '../src'

/**
 * @title 带分页
 */
export const Pagination = () => {
  return (
    <>
      <h1>带分页</h1>
      <div className="list-basic__wrap">
        <List
          data={[
            {
              title: '当前这里是标题信息',
              description:
                '这里是一段比较长的描述信息这里是一段比较长的描述信息这里是一段比较长的描述信息',
              avatar: 'https://xiaomi.github.io/hiui/logo.png',
              action: (
                <Button type="primary" appearance="link">
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
                <Button type="primary" appearance="link">
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
                <Button type="primary" appearance="link">
                  操作
                </Button>
              ),
            },
          ]}
          pagination={{
            total: 200,
            pageSize: 10,
            placement: 'right',
          }}
          render={(dataItem) => {
            return <List.Item {...dataItem} />
          }}
        />
      </div>
    </>
  )
}
