import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

const MultipleInput = ({
  placeholder,
  selectedItems: propsSelectItem,
  dropdownShow,
  disabled,
  searchable,
  clearable,
  multipleMode = 'nowrap',
  onFocus,
  theme,
  onBlur,
  onClick,
  onDelete,
  onClear,
  handleKeyDown
}) => {
  let icon = dropdownShow ? 'up' : 'down'
  const [showCount, setShowCount] = useState(0)
  const [value, setValue] = useState('')
  const tagWrapperRef = useRef('')
  const calShowCountFlag = useRef(true) // 在渲染完成进行测试是否展示 +1

  useEffect(() => {
    if (
      multipleMode === 'nowrap' &&
      calShowCountFlag.current &&
      tagWrapperRef.current
    ) {
      // 多选超过一行时以数字显示
      const tagWrapperRect = tagWrapperRef.current.getBoundingClientRect()
      let width = 0
      let showCountIndex = 0 // 在第几个开始显示折行
      const tags = tagWrapperRef.current.querySelectorAll(
        '.hi-select__input--item'
      )
      tags.forEach((tag, index) => {
        const tagRect = tag.getBoundingClientRect()
        width += tagRect.width
        if (width + 90 > tagWrapperRect.width) {
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

  const handleClear = e => {
    e.stopPropagation()
    onClear()
  }
  const currentCount = showCount === 0 ? propsSelectItem.length : showCount

  return (
    <div
      className={classNames(
        'hi-select__input',
        'multiple-values',
        `theme__${theme}`,
        {
          disabled
        }
      )}
      ref={tagWrapperRef}
      onClick={onClick}
    >
      {propsSelectItem.length === 0 && !value && (
        <div className='hi-select__input--placeholder'>{placeholder}</div>
      )}
      <div
        className={classNames('hi-select__input-items', {
          'hi-select__input-items--all': multipleMode === 'wrap'
        })}
      >
        {propsSelectItem.slice(0, currentCount).map((item, index) => {
          const _item = (
            <div
              key={index}
              className='hi-select__input--item'
              style={{
                maxWidth: tagWrapperRef.current
                  ? (tagWrapperRef.current.getBoundingClientRect().width - 90) *
                    0.8
                  : '80%'
              }}
            >
              <div className='hi-select__input--item__name'>{item.title}</div>
              <span
                className='hi-select__input--item__remove'
                onClick={e => {
                  e.stopPropagation()
                  onDelete(item)
                }}
              >
                <i className='hi-icon icon-close' />
              </span>
            </div>
          )
          return _item
        })}
        {currentCount < propsSelectItem.length && (
          <div className='hi-select__input-items--left'>
            +
            <span className='hi-select__input-items--left-count'>
              {propsSelectItem.length - currentCount}
            </span>
          </div>
        )}
        {searchable && !disabled && (
          // 要删除掉
          <div className='hi-select__input--search'>
            <input
              type='text'
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly
            />
          </div>
        )}
      </div>
      <span className='hi-select__input--icon'>
        <i
          className={classNames(
            `hi-icon icon-${icon} hi-select__input--icon__expand`,
            { clearable: clearable && propsSelectItem.length > 0 }
          )}
        />
        {clearable && propsSelectItem.length > 0 && (
          <i
            className={`hi-icon icon-close-circle hi-select__input--icon__close`}
            onClick={handleClear}
          />
        )}
      </span>
    </div>
  )
}
export default MultipleInput
