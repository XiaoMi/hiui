import React from 'react'
import PageHeader from '../src'

/**
 * @title 基础用法
 * @desc 默认不带背景色和左右边距
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="page-header-basic__wrap">
        <PageHeader
          style={{ backgroundColor: '#f5f8fc', paddingLeft: 16, paddingRight: 16 }}
          title="页面标题"
          backIcon={false}
        />
      </div>
    </>
  )
}
