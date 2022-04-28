import React from 'react'
import IconButton from '../src'
import { CloseOutlined } from '@hi-ui/icons'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="icon-button-basic__wrap">
        <IconButton icon={<CloseOutlined />} />
        <br />
        <br />
        <IconButton icon={<CloseOutlined />} active />
        <br />
        <br />
        <IconButton icon={<CloseOutlined />} effect />
        <br />
        <br />
        <IconButton icon={<CloseOutlined />} effect active />
        <br />
        <br />
        测试
        <IconButton icon={<CloseOutlined />} effect />
        文档流空间是否占用
      </div>
    </>
  )
}
