import React from 'react'
import Dropdown from '../src'
import { FileOutlined, FileExeOutlined, FileExcelOutlined } from '@hi-ui/icons'

/**
 * @title 带Icon
 */
export const Icon = () => {
  const [list] = React.useState([
    {
      id: 0,
      title: (
        <span>
          <FileOutlined />
          <span style={{ marginLeft: 4 }}>新建文件</span>
        </span>
      ),
    },
    {
      id: 1,
      title: (
        <span>
          <FileExeOutlined />
          <span style={{ marginLeft: 4 }}>复制文件</span>
        </span>
      ),
    },
    {
      id: 2,
      title: (
        <span>
          <FileExcelOutlined />
          <span style={{ marginLeft: 4 }}>删除文件</span>
        </span>
      ),
      split: true,
    },
    {
      id: 3,
      title: '菜单四',
    },
    {
      id: 6,
      title: '小米商城',
      href: 'https://www.mi.com',
      disabled: true,
    },
  ])

  return (
    <>
      <h1>Icon</h1>
      <div className="dropdown-icon__wrap">
        <Dropdown data={list} title="鼠标悬停" onClick={console.log} />
      </div>
    </>
  )
}
