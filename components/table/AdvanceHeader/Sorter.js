import React, { useContext } from 'react'
import ClassNames from 'classnames'

import Icon from '../../icon'
import TableContext from '../context'

/**
 * 排序相关配置
 * @returns ReactNode
 */
const prefix = 'hi-table-advanceheader-sorter'
const Sorter = ({ columnKey }) => {
  const { activeSorterColumn, activeSorterType, setActiveSorterColumn, setActiveSorterType } = useContext(TableContext)
  return (
    <div className={prefix}>
      <span
        className={ClassNames(`${prefix}_icon`, {
          [`${prefix}_icon-active`]: activeSorterType === 'ascend' && activeSorterColumn === columnKey
        })}
        onClick={(e) => {
          if (activeSorterType === 'ascend' && activeSorterColumn === columnKey) {
            setActiveSorterType(null)
            setActiveSorterColumn(null)
          } else {
            setActiveSorterType('ascend')
            setActiveSorterColumn(columnKey)
          }
        }}
      >
        <Icon name="caret-up" style={{ fontSize: '16px' }} />
      </span>
      <span
        className={ClassNames(`${prefix}_icon`, {
          [`${prefix}_icon-active`]: activeSorterType === 'descend' && activeSorterColumn === columnKey
        })}
        onClick={(e) => {
          if (activeSorterType === 'descend' && activeSorterColumn === columnKey) {
            setActiveSorterType(null)
            setActiveSorterColumn(null)
          } else {
            setActiveSorterType('descend')
            setActiveSorterColumn(columnKey)
          }
        }}
      >
        <Icon name="caret-down" />
      </span>
    </div>
  )
}
export default Sorter
