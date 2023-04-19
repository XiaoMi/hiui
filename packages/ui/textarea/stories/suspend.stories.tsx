import React from 'react'
import TextArea from '../src'
import { CopyFilled } from '@hi-ui/icons'

/**
 * @title 输入框浮层内容
 * @desc 默认在最右边垂直居中展示，可根据需求自行定义样式
 */
export const Suspend = () => {
  return (
    <>
      <h1>Suspend for TextArea</h1>
      <div className="text-suspend__wrap">
        <TextArea style={{ paddingRight: 58 }} placeholder="请输入" suspend=".com"></TextArea>
        <br />
        <br />
        <TextArea
          style={{ paddingRight: 38 }}
          placeholder="请输入"
          suspend={<CopyFilled style={{ alignSelf: 'flex-start' }} />}
        ></TextArea>
      </div>
    </>
  )
}
