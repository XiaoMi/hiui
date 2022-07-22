import React from 'react'
import Breadcrumb from '../src'

/**
 * @title 基础用法
 * @desc 明确访问路径的每一个节点
 */
export const Basic = () => {
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
      <h1>基础用法</h1>
      <div className="breadcrumb-basic__wrap">
        <Breadcrumb
          data={data}
          onClick={(evt, item) => {
            console.log('get item: ', item)
          }}
        />
      </div>
    </>
  )
}
