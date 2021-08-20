/**
 * 表格相关的查询、排序功能；图标占位、以及点击图标的回调函数
 * @returns ReactNode
 * - [x] 排序功能
 * - [ ] 筛选功能
 */
import React from 'react'

import Sorter from './Sorter'
import CustomFilter from './CustomFilter'
import Select from './select'

import './style'
const AdvanceHeader = (props) => {
  const {
    showColMenu,
    columnData: { dataKey, sorter, filterIcon, selectFilters }
  } = props

  return (
    <>
      {sorter && !showColMenu && <Sorter {...props} columnKey={dataKey} />}
      {selectFilters && <Select {...selectFilters} />}
      {filterIcon && <CustomFilter {...props} />}
    </>
  )
}

export default AdvanceHeader
