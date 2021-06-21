import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Provider from '../context'

import './style'

const prefixCls = 'hi-filter'

const Filter = (props) => {
  const { data = [], onChange, onClick, value, defaultValue = [], label = [], labelWith, showUnderline, theme } = props
  const [options, setOptions] = useState(data || [])
  const [selectId, setSelectId] = useState(value || defaultValue || [])
  useEffect(() => {
    setOptions(data)
  }, [data])
  useEffect(() => {
    value && setSelectId(value)
  }, [value])
  const renderRadioItem = (item, levelActiveId, level) => {
    const { id, content, disabled } = item
    const active = item.id === levelActiveId
    const cls = classNames(`${prefixCls}-content-item`, {
      [`${prefixCls}-content-item__active`]: active,
      [`${prefixCls}-content-item__disabled`]: disabled
    })
    return (
      <li
        className={cls}
        key={id}
        onClick={() => {
          if (disabled) {
            return
          }
          const _activeId = selectId || []
          _activeId.splice(level - 1)
          _activeId[level - 1] = id
          if (!value) {
            setSelectId(_.cloneDeep(_activeId))
          }
          onClick && onClick(item)
          onChange && !active && onChange(_.cloneDeep(_activeId))
        }}
      >
        <span>{content}</span>
        {active && showUnderline && <span className={`${prefixCls}-content-item__active--underline`} />}
      </li>
    )
  }
  const renderCascadeContent = () => {
    const content = []
    let currentOptions = _.cloneDeep(options)
    let level = 0
    let levelLabel
    while (currentOptions || levelLabel) {
      const _currentOptions = _.cloneDeep(currentOptions)
      currentOptions = false
      const levelActiveId = selectId && selectId.length ? selectId[level] : null
      const _label = label.length ? label[level] : undefined
      level++
      levelLabel = label.length ? label[level] : undefined
      content.push(
        <div className={`${prefixCls}-content`} key={_label}>
          <div className={`${prefixCls}-content-label`}>
            <span className={`${prefixCls}-content-label__title`} style={{ width: labelWith || 80 }}>
              {_label}
            </span>
          </div>
          <ul className={`${prefixCls}-content-items`}>
            {_currentOptions &&
              _currentOptions.map((item) => {
                if (item.children && item.id === levelActiveId) {
                  currentOptions = item.children
                }
                return renderRadioItem(item, levelActiveId, level)
              })}
          </ul>
        </div>
      )
    }
    return content
  }

  return <div className={`${prefixCls} theme__${theme}`}>{renderCascadeContent()}</div>
}
export default Provider(Filter)
