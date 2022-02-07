import React from 'react'
import Breadcrumb from '../src'

const data = [
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
]

export const Basic = () => {
  return (
    <>
      <h1>基础用法</h1>
      <div className="breadcrumb-basic__wrap">
        <Breadcrumb
          data={data}
          separator={'/'}
          onClick={(path) => {
            console.log('go path: ', path)
          }}
        />
        <Breadcrumb
          data={data}
          size="sm"
          separator={'/'}
          onClick={(path) => {
            console.log('go path: ', path)
          }}
        />
      </div>
    </>
  )
}
