import React, { useCallback, useEffect, useRef, useState } from 'react'
import BaseTable, { Column, AutoResizer } from 'react-base-table'
import classNames from 'classnames'
import _ from 'lodash'
import './hiui-basetable-theme.scss'
const classPrefix = 'hiui-basetable'
// 格式化 Columns
// 冻结处理
const fixedColumns = (columns, fixedToColumn) => {
  let leftIndex = 0
  let rightIndex = columns.length
  if (Object.prototype.toString.call(fixedToColumn) === '[object String]') {
    leftIndex = columns.findIndex((item) => {
      return item.dataKey === fixedToColumn
    })
  } else {
    const { left, right } = fixedToColumn
    leftIndex = columns.findIndex((item) => {
      console.log('left', item, left)
      return item.dataKey === left
    })
    rightIndex = columns.findIndex((item) => {
      return item.dataKey === right
    })
  }
  console.log(leftIndex, rightIndex)
  return columns.map((column, columnIndex) => {
    let frozen
    if (columnIndex <= leftIndex) frozen = Column.FrozenDirection.LEFT
    if (columnIndex >= rightIndex) frozen = Column.FrozenDirection.RIGHT
    return { ...column, frozen }
  })
}
const generateColumns = (columns) => {
  return columns.map((column) => {
    return {
      ...column,
      key: column.dataKey,
      dataKey: column.dataKey,
      title: column.title,
      width: column.width || 100,
      maxWidth: column.width || 100
    }
  })
}
const generateData = (data) => {
  const _data = _.cloneDeep(data)
  const setDataId = (data, parentId = 0) => {
    data.forEach((item, itemIndex) => {
      const id = item.key || itemIndex
      const { parentId: _parentId } = item
      item.id = id
      item.parentId = typeof _parentId !== 'undefined' ? _parentId : parentId
      if (item.children) {
        setDataId(item.children, id)
      }
    })
  }
  setDataId(_data)
  return _data
}

const HiBaseTable = React.forwardRef((props, ref) => {
  const wrapperRef = useRef()
  const timeId = useRef()
  let { data, columns, bordered, className, height, width, autoResize = true, fixedToColumn } = props
  columns = generateColumns(columns || [])
  const _defaultWidth = columns.reduce((pre, now) => {
    return pre + now.width
  }, 0)
  const [defaultWidth, setDefaultWidth] = useState(_defaultWidth)
  const getDefaultWidth = useCallback(() => {
    const rect = wrapperRef.current.parentNode.getBoundingClientRect()
    return rect.width || _defaultWidth
  }, [wrapperRef])
  const resize = useCallback(() => {
    clearTimeout(timeId.current)
    timeId.current = setTimeout(() => {
      setDefaultWidth(getDefaultWidth())
    }, [60])
  }, [])
  useEffect(() => {
    window.addEventListener('resize', resize)
    setDefaultWidth(getDefaultWidth())
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])
  return (
    <div ref={wrapperRef}>
      <BaseTable
        width={width || defaultWidth}
        height={height || 120}
        maxHeight={height || 10000}
        fixed={true}
        expandColumnKey={columns[0] && columns[0].dataKey}
        {...props}
        ref={ref}
        columns={fixedToColumn ? fixedColumns(columns, fixedToColumn) : columns}
        data={generateData(data)}
        className={classNames({ bordered: bordered, autoResize: autoResize }, className)}
        classPrefix={classPrefix}
      />
    </div>
  )
})
HiBaseTable.Column = Column
HiBaseTable.PlaceholderKey = BaseTable.PlaceholderKey

export default HiBaseTable
export { AutoResizer }
