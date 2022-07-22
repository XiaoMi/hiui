import React from 'react'
import Search from '../src'
import { SearchOutlined } from '@hi-ui/icons'

/**
 * @title 自定义按钮
 */
export const Addon = () => {
  const [data] = React.useState([
    {
      id: 'miphone',
      title: '手机',
      children: [
        {
          id: 1,
          title: '小米9 Pro',
        },
        {
          id: 2,
          title: '小米9 探索版',
        },
        {
          id: 3,
          title: '小米9 CC 美图定制版',
        },
      ],
    },
    {
      id: 'live',
      title: '智能生活',
      children: [
        {
          id: 4,
          title: '小米 手环',
        },
        {
          id: 5,
          title: '小米 净水器',
        },
        {
          id: 6,
          title: '小米 小爱音响',
        },
      ],
    },
  ])

  return (
    <>
      <h1>Addon</h1>
      <div className="search-addon__wrap">
        <Search
          style={{ width: 260 }}
          placeholder="搜索关键字"
          prefix={<SearchOutlined />}
          append={null}
          data={data}
        />
      </div>
    </>
  )
}
