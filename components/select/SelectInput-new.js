import React, { forwardRef, useState, useEffect } from 'react'
import SingleInput from './singleInput'
import classNames from 'classnames'
import { getTextWidth } from './common.js'

const InternalSelectInput = props => {
  let { mode, selectedItems: propsSelectItem } = props
  let calShowCountFlag = true
  const [showCount, setShowCount] = useState(0)
  const [value, setValue] = useState('')
  const [inputStyle, setInputStyle] = useState({
    width: 2
  })
  const [cacheselectedItems, setCacheselectedItems] = useState(
    propsSelectItem || []
  )
  useEffect(() => {
    setCacheselectedItems(propsSelectItem)
  }, [propsSelectItem])
  const handleClear = e => {
    e.stopPropagation()
    setCacheselectedItems([])
    props.onClear()
  }
  // 多选显示内容
  const renderMultiple = () => {
    let {
      placeholder,
      selectedItems,
      dropdownShow,
      disabled,
      searchable,
      clearable,
      multipleMode,
      onFocus,
      theme,
      onBlur,
      onClick,
      onDelete
    } = props
    let icon = dropdownShow ? 'up' : 'down'

    const currentCount =
      showCount === 0 || calShowCountFlag ? selectedItems.length : showCount

    if (!selectedItems.length) {
      // setInputStyle({ width: '100%' })
    }
    // 按键操作
    const handleKeyDown = evt => {
      if (evt.keyCode === 13) {
        props.onEnterSelect()
      }

      if (evt.keyCode === 38) {
        evt.preventDefault()
        props.moveFocusedIndex('up')
      }
      if (evt.keyCode === 40) {
        evt.preventDefault()
        props.moveFocusedIndex('down')
      }
    }
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
        onClick={onClick}
      >
        {selectedItems.length === 0 && !value && (
          <div className='hi-select__input--placeholder'>{placeholder}</div>
        )}
        <div
          className={classNames('hi-select__input-items', {
            'hi-select__input-items--all': multipleMode === 'wrap'
          })}
          // ref={node => {
          //   this.itemsRef = node
          // }}
        >
          {selectedItems.slice(0, currentCount).map((item, index) => {
            const _item = (
              <div
                key={index}
                className='hi-select__input--item'
                // style={{
                //   maxWidth: this.itemsRef
                //     ? (this.itemsRef.getBoundingClientRect().width - 50) * 0.8
                //     : '80%'
                // }}
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
          {currentCount < selectedItems.length && (
            <div className='hi-select__input-items--left'>
              +
              <span className='hi-select__input-items--left-count'>
                {selectedItems.length - currentCount}
              </span>
            </div>
          )}
          {searchable && !disabled && (
            <div className='hi-select__input--search'>
              <input
                type='text'
                style={inputStyle}
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
              { clearable: clearable && selectedItems.length > 0 }
            )}
          />
          {clearable && selectedItems.length > 0 && (
            <i
              className={`hi-icon icon-close-circle hi-select__input--icon__close`}
              onClick={handleClear}
            />
          )}
        </span>
      </div>
    )
  }

  return mode === 'multiple' ? renderMultiple() : <SingleInput {...props} />
}
const SelectInput = forwardRef((props, ref) => {
  return <InternalSelectInput {...props} innerRef={ref} />
})
export default SelectInput
