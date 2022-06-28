import React from 'react'
import SvgIcon from '../src'

/**
 * @title 基础用法
 * @desc 作为 svg 容器快速绘制生成简单的 SvgIcon
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="svg-icon-basic__wrap">
        <SvgIcon aria-label="home">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
      </div>
    </>
  )
}
