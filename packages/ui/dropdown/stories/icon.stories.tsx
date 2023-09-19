import React from 'react'
import Dropdown from '../src'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@hi-ui/icons'

/**
 * @title 带Icon
 */
export const Icon = () => {
  const [list] = React.useState([
    {
      id: 0,
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 8 }}>添加</span>
        </span>
      ),
    },
    {
      id: 1,
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 8 }}>编辑</span>
        </span>
      ),
    },
    {
      id: 2,
      title: (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <DeleteOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
          <span style={{ marginLeft: 8 }}>删除</span>
        </span>
      ),
    },
  ])

  return (
    <>
      <h1>Icon</h1>
      <div className="dropdown-icon__wrap">
        <Dropdown data={list} width={120} title="鼠标悬停" onClick={console.log} />
      </div>
    </>
  )
}
