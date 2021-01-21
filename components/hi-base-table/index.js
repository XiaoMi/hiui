import React, { useCallback, useEffect, useRef, useState } from 'react'
import BaseTable, { Column, AutoResizer, SortOrder } from 'react-base-table'
import classNames from 'classnames'
import _ from 'lodash'
import './style/index'
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
      return item.dataKey === left
    })
    rightIndex = columns.findIndex((item) => {
      return item.dataKey === right
    })
  }
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
      width: column.width || 100
    }
  })
}
const generateData = (data) => {
  const _data = _.cloneDeep(data)
  const setDataId = (data, parentId) => {
    data.forEach((item, itemIndex) => {
      const id = typeof parentId !== 'undefined' ? parentId + '-' + itemIndex : itemIndex
      console.log()
      item.id = id
      item.parentId = parentId
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
  let {
    data,
    columns,
    bordered,
    className,
    height,
    width,
    autoResize = true,
    fixedToColumn,
    sticky,
    stickyTop = 0
  } = props
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
  const scroll = useCallback(() => {
    if (wrapperRef.current) {
      if (sticky) {
        const { height: headerH } = wrapperRef.current.querySelector('.hiui-basetable__header').getBoundingClientRect()
        const { top, height } = wrapperRef.current.getBoundingClientRect()
        const header = wrapperRef.current.querySelectorAll('.hiui-basetable__header')
        header.forEach((element) => {
          if (
            element.parentNode.classList.contains('hiui-basetable__table-frozen-right') ||
            element.parentNode.classList.contains('hiui-basetable__table-frozen-left')
          ) {
            if (top <= stickyTop) {
              element.classList.add('header__sticky-row')
              element.style.top = stickyTop + 'px'
            } else {
              element.style.top = 0
              element.classList.remove('header__sticky-row')
            }
          } else {
            element.style.position = 'sticky'
            element.style.top = stickyTop + 'px'
          }
        })
        if (top + height - headerH < stickyTop) {
          header.forEach((element) => {
            if (
              element.parentNode.classList.contains('hiui-basetable__table-frozen-right') ||
              element.parentNode.classList.contains('hiui-basetable__table-frozen-left')
            ) {
              element.style.top = 0
              element.classList.remove('header__sticky-row')
            }
          })
        }
      }
    }
  }, [stickyTop, wrapperRef, sticky])
  useEffect(() => {
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', scroll)
    setDefaultWidth(getDefaultWidth())
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', scroll)
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
        className={classNames(
          { bordered: bordered, autoResize: autoResize, 'hiui-basetable__ticky-row': sticky },
          className
        )}
        classPrefix={classPrefix}
      />
    </div>
  )
})
HiBaseTable.Column = Column
HiBaseTable.PlaceholderKey = BaseTable.PlaceholderKey

export default HiBaseTable
export { AutoResizer, SortOrder }
