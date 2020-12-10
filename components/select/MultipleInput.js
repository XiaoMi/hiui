import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Icon from '../icon'

import { transKeys } from './utils'

const MultipleInput = ({
  placeholder,
  selectedItems: propsSelectItem,
  dropdownShow,
  cacheSelectItem,
  disabled,
  searchable,
  clearable,
  multipleMode = 'nowrap',
  onFocus,
  theme,
  onClick,
  onClickOption,
  onClear,
  fieldNames,
  isFocus
}) => {
  const icon = dropdownShow ? 'up' : 'down'
  const [showCount, setShowCount] = useState(0)
  const tagWrapperRef = useRef('')
  const calShowCountFlag = useRef(true) // 在渲染完成进行测试是否展示 +1
  const selectedItems = _.uniqBy(cacheSelectItem.concat(propsSelectItem), transKeys(fieldNames, 'id'))

  useEffect(() => {
    if (multipleMode === 'nowrap' && calShowCountFlag.current && tagWrapperRef.current) {
      // 多选超过一行时以数字显示
      const tagWrapperRect = tagWrapperRef.current.getBoundingClientRect()
      let width = 0
      let showCountIndex = 0 // 在第几个开始显示折行
      const tags = tagWrapperRef.current.querySelectorAll('.hi-select__input--item')
      tags.forEach((tag, index) => {
        const tagRect = tag.getBoundingClientRect()
        width += tagRect.width
        if (width + 50 > tagWrapperRect.width && calShowCountFlag.current) {
          // 50是留给显示剩余选项的空间
          calShowCountFlag.current = false
          showCountIndex = index
        }
      })
      !calShowCountFlag.current && setShowCount(showCountIndex)
    } else {
      calShowCountFlag.current = true
    }
  })

  const handleClear = (e) => {
    e.stopPropagation()
    onClear()
  }

  const currentCount = showCount === 0 ? selectedItems.length : showCount
  return (
    <div
      className={classNames(
        'hi-select__input',
        'multiple-values',
        `theme__${theme}`,
        {
          disabled
        },
        {
          'hi-select__input__focus': isFocus
        }
      )}
      ref={tagWrapperRef}
      onClick={onClick}
    >
      {selectedItems.length === 0 && <div className="hi-select__input--placeholder">{placeholder}</div>}
      <div
        className={classNames('hi-select__input-items', {
          'hi-select__input-items--all': multipleMode === 'wrap'
        })}
      >
        {selectedItems.slice(0, currentCount).map((item, index) => {
          const _item = (
            <div
              key={index}
              className="hi-select__input--item"
              style={{
                maxWidth: tagWrapperRef.current
                  ? (tagWrapperRef.current.getBoundingClientRect().width - 90) * 0.8
                  : '80%'
              }}
            >
              <div className="hi-select__input--item__name">{item[transKeys(fieldNames, 'title')]}</div>
              <span
                className="hi-select__input--item__remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickOption(item, 0)
                }}
              >
                <i className="hi-icon icon-close" />
              </span>
            </div>
          )
          return _item
        })}
        {currentCount < selectedItems.length && (
          <div className="hi-select__input-items--left">
            +<span className="hi-select__input-items--left-count">{selectedItems.length - currentCount}</span>
          </div>
        )}
        {searchable && !disabled && (
          <div className="hi-select__input--search">
            <input type="text" onFocus={onFocus} readOnly className="hi-select__input--readonly" />
          </div>
        )}
      </div>
      <span className="hi-select__input--icon">
        <Icon name={icon} className={classNames({ clearable: clearable && selectedItems.length > 0 })} />
        {clearable && selectedItems.length > 0 && (
          <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={handleClear} />
        )}
      </span>
    </div>
  )
}
export default MultipleInput
