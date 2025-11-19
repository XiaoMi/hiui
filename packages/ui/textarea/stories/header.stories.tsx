import React from 'react'
import TextArea from '../src'
import { CopyOutlined, ExpressionOutlined } from '@hi-ui/icons'

/**
 * @title 输入框内置内容
 * @desc header默认在顶部展示，可根据需求自行定义样式
 */
export const Header = () => {
  return (
    <>
      <h1>Header</h1>
      <div className="text-header__wrap">
        <TextArea
          placeholder="请输入"
          header={
            <>
              <CopyOutlined style={{ marginRight: 6, fontSize: 16, color: '#5f6a7a' }} />
              <ExpressionOutlined style={{ fontSize: 16, color: '#5f6a7a' }} />
            </>
          }
        ></TextArea>
      </div>
    </>
  )
}
