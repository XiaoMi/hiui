import React from 'react'
import Breadcrumb from '../src'

/**
 * @title 不同尺寸
 * @desc 通过 size 设置不同大小的面包屑
 */
export const Size = () => {
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
      <h1>不同尺寸</h1>
      <div className="breadcrumb-size__wrap">
        <Breadcrumb
          data={data}
          size="sm"
          onClick={(evt, item) => {
            console.log('get item: ', item)
          }}
        />
        <br />
        <Breadcrumb
          data={data}
          size="md"
          onClick={(evt, item) => {
            console.log('get item: ', item)
          }}
        />
      </div>
    </>
  )
}
