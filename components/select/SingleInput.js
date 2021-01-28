import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
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
    onClick,
    selectedItems: propsSelectItem,
    onClear,
    fieldNames,
    isFocus,
    bordered
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
        { disabled, bordered },
        {
          'hi-select__input__focus': isFocus
        }
      )}
      onClick={onClick}
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
            className="hi-select__input--readonly"
            value={selectedItems.length > 0 ? placeholder : ''}
            placeholder={placeholder}
            onFocus={onFocus}
            readOnly
          />
        </div>
      )}
      <span className="hi-select__input--icon">
        <Icon name={icon} className={classNames({ clearable: clearable && selectedItems.length > 0 })} />
        {clearable && selectedItems.length > 0 && (
          <i className={`hi-icon icon-close-circle hi-select__input--icon__close`} onClick={handleClear} />
        )}
      </span>
    </div>
  )
}

export default SingleInput
