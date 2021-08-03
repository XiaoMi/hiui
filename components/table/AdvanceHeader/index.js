/**
 * 表格相关的查询、排序功能；图标占位、以及点击图标的回调函数
 * @returns ReactNode
 * - [ ] 排序功能
 */
import React from 'react'
import Icon from '../../icon'

import Sorter from './Sorter'

import './style'
const AdvanceHeader = ({ sorter }) => {
  return (
    <>
      <Sorter></Sorter>
    </>
  )
}

export default AdvanceHeader
