import React, { useEffect, useState } from 'react'
import BaseTable, {
  Column,
  SortOrder,
  AutoResizer,
  normalizeColumns,
  callOrReturn,
  unflatten,
  TableHeader as BaseTableHeader,
  TableRow as BaseTableRow
} from 'react-base-table'
import classNames from 'classnames'

import './hiui-basetable-theme.scss'
const classPrefix = 'hiui-basetable'
// 格式化 Columns

const generateColumns = (columns) => {
  return columns.map((column, columnIndex) => {
    return {
      ...column,
      key: columnIndex,
      dataKey: column.dataKey,
      title: column.title,
      width: column.width || 150
    }
  })
}
const generateData = (data) => {
  return data.map((item, itemIndex) => {
    return {
      ...item,
      id: itemIndex
    }
  })
}

const HiBaseTable = React.forwardRef((props, ref) => {
  let { scrollWidth, data, columns, bordered, className } = props
  const [defaultHeight, setDefaultHeight] = useState(60 * (data.length % 10))
  columns = generateColumns(columns || [])
  const _defaultWidth = columns.reduce((pre, now) => {
    return pre + now.width
  }, 0)
  const [defaultWidth, setDefaultWidth] = useState(_defaultWidth)
  useEffect(() => {
    setDefaultHeight(60 * (data.length % 10))
  }, [data])

  useEffect(() => {
    const _defaultWidth = columns.reduce((pre, now) => {
      return pre + now.width
    }, 0)
    setDefaultWidth(_defaultWidth)
  }, [columns])
  return (
    <BaseTable
      width={scrollWidth || defaultWidth}
      height={defaultHeight}
      {...props}
      ref={ref}
      columns={columns}
      data={generateData(data)}
      className={classNames({ bordered: bordered }, className)}
      classPrefix={classPrefix}
    />
  )
})
HiBaseTable.Column = Column
HiBaseTable.PlaceholderKey = BaseTable.PlaceholderKey

export default HiBaseTable
export { AutoResizer }
