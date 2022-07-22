import React from 'react'
import SvgIcon from '../src'

/**
 * @title Viewbox
 * @desc 自定义 viewBox 设置 svg 显示区域
 */
export const Viewbox = () => {
  return (
    <>
      <h1>Viewbox</h1>
      <div className="svg-icon-viewbox__wrap">
        <SvgIcon aria-label="action" viewBox="0 0 16 16">
          <path d="M4.5,6.5 L4.5,9.5 L1.5,9.5 L1.5,6.5 L4.5,6.5 Z M9.5,6.5 L9.5,9.5 L6.5,9.5 L6.5,6.5 L9.5,6.5 Z M14.5,6.5 L14.5,9.5 L11.5,9.5 L11.5,6.5 L14.5,6.5 Z"></path>
        </SvgIcon>
      </div>
    </>
  )
}
