import { RightOutlined } from '@hi-ui/icons'
import React from 'react'
import Breadcrumb from '../src'

/**
 * @title 自定义分隔符
 */
export const Separator = () => {
  const [data] = React.useState([
    {
      title: '首页',
      href: '/home',
    },
    {
      title: '列表',
      href: '/list',
    },
    {
      title: '手机详情',
      href: '/phone',
    },
  ])

  return (
    <>
      <h1>自定义分隔符</h1>
      <div className="breadcrumb-separator__wrap">
        <Breadcrumb
          data={data}
          separator={<RightOutlined style={{ fontSize: 16 }} />}
          onClick={(evt, item) => {
            console.log('get item: ', item)
          }}
        />
      </div>
    </>
  )
}
