import React from 'react'
import PageHeader from '../src'
import IconButton from '@hi-ui/icon-button'
import { LeftOutlined } from '@hi-ui/icons'

/**
 * @title 带返回图标
 */
export const BackIcon = () => {
  return (
    <>
      <h1>BackIcon</h1>
      <div className="page-header-back-icon__wrap">
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          onBack={() => console.log('back button clicked')}
        />
        <br />
        <br />
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          backIcon={<IconButton icon={<LeftOutlined />} />}
          onBack={() => alert('back button clicked')}
        />
      </div>
    </>
  )
}
