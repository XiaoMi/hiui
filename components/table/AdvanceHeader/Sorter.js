import React, { useState } from 'react'

import Icon from '../../icon'
/**
 * 排序相关配置
 * @returns ReactNode
 */
/**
 * showSorterIcon 是否展示sorter,
 * sortDirections 排序的上下箭头判断
 */
const prefix = 'hi-table-advanceheader-sorter'
const Sorter = ({ showSorterIcon, sortDirections }) => {
  const [sorterStatus, setSorterStatus] = useState()
  console.log('sorterStatus', sorterStatus)
  return (
    <div className={prefix}>
      <span
        className={`${prefix}_icon`}
        onClick={(e) => {
          console.log('ascend')
          setSorterStatus('ascend')
        }}
      >
        <Icon name="caret-up" style={{ fontSize: '16px' }} />
      </span>
      <span
        className={`${prefix}_icon`}
        onClick={(e) => {
          console.log('descend')
          setSorterStatus('ascend')
        }}
      >
        <Icon name="caret-down" />
      </span>
    </div>
  )
}
export default Sorter
