import { RightOutlined } from '@hi-ui/icons'
import React from 'react'
import Breadcrumb from '../src'

export const Separator = () => {
  const [data] = React.useState([
    {
      title: '首页',
      path: '/home',
    },
    {
      title: '列表',
      path: '/list',
    },
    {
      title: '手机详情',
      path: '/phone',
    },
  ])

  return (
    <>
      <h1>自定义分隔符</h1>
      <div className="breadcrumb-separator__wrap">
        <Breadcrumb
          data={data}
          separator={<RightOutlined style={{ fontSize: 16 }} />}
          onClick={(path) => {
            console.log('go path: ', path)
          }}
        />
      </div>
    </>
  )
}
