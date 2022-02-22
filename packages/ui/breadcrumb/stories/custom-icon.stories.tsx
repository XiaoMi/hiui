import React from 'react'
import Breadcrumb from '../src'
import { HomeOutlined } from '@hi-ui/icons'

export const CustomIcon = () => {
  const [data] = React.useState([
    {
      icon: <HomeOutlined />,
      title: '首页',
      path: '/home',
    },
    {
      icon: <HomeOutlined />,
      title: '列表',
      path: '/list',
    },
    {
      icon: <HomeOutlined />,
      title: '手机详情',
      path: '/phone',
    },
  ])

  return (
    <>
      <h1>自定义 Icon </h1>
      <div className="breadcrumb-custom-icon__wrap">
        <Breadcrumb
          data={data}
          onClick={(path) => {
            console.log('go path: ', path)
          }}
        />
      </div>
    </>
  )
}
