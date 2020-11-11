import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { transKeys } from './utils'

// 单选输入框
const SingleInput = (props) => {
  let {
    placeholder,
    dropdownShow,
    disabled,
    clearable,
    onFocus,
    theme,
    onBlur,
    onClick,
    selectedItems: propsSelectItem,
    handleKeyDown,
    onClear,
    fieldNames,
    isFocus,
    selectInputWidth
  } = props
  const [cacheselectedItems, setCacheselectedItems] = useState(propsSelectItem || [])
  useEffect(() => {
    setCacheselectedItems(propsSelectItem)
  }, [propsSelectItem])

  const handleClear = (e) => {
    e.stopPropagation()

    onClear()
    setCacheselectedItems([])
  }

  const icon = dropdownShow ? 'up' : 'down'

  const selectedItems = propsSelectItem.length > 0 ? propsSelectItem : cacheselectedItems

  placeholder = selectedItems.length > 0 ? selectedItems[0][transKeys(fieldNames, 'title')] : placeholder

  return (
    <div
      className={classNames(
        'hi-select__input',
        'single-value',
        `theme__${theme}`,
        { disabled },
        {
          'hi-select__input__focus': isFocus
        }
      )}
      onClick={onClick}
      style={{ width: selectInputWidth || '100%' }}
    >
      <div
        className={classNames('hi-select__input--item', {
          'hi-select__hide': !(!dropdownShow && selectedItems.length > 0)
        })}
      >
        <div className="hi-select__input--item__name">
          {selectedItems[0] && selectedItems[0][transKeys(fieldNames, 'title')]}
        </div>
      </div>
      {(dropdownShow || selectedItems.length === 0) && (
        <div
          className={classNames('hi-select__input--search', {
            'hi-select__input--search--value': selectedItems.length > 0
          })}
        >
          <input
            type="text"
            value={selectedItems.length > 0 ? placeholder : ''}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly
          />
        </div>
      )}
      <span className="hi-select__input--icon">
        <i
          className={classNames(`hi-icon icon-${icon} hi-select__input--icon__expand`, {
            clearable: clearable && selectedItems.length > 0
          })}
        />
        {clearable && selectedItems.length > 0 && (
          <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={handleClear} />
        )}
      </span>
    </div>
  )
}

export default SingleInput
