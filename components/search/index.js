import React, { useState, useRef, useEffect, useCallback } from 'react'
import Input from '../input'
import Button from '../button'
import SearchDropdown from './searchDropdown'
import Provider from '../context'

import './style'

const prefixCls = 'hi-search'

const Search = ({
  onChange,
  onSearch,
  style,
  placeholder,
  prepend,
  disabled,
  data,
  value,
  loading,
  localeDatas,
  overlayClassName,
  append,
  theme
}) => {
  const [dropdownShow, setDropdownShow] = useState(false)
  const searchInputContainer = useRef(null)
  const [inputVal, setInputVal] = useState(value || '')
  const [focusIndex, setFocusIndex] = useState(null)
  const [subFocusIndex, setSubFocusIndex] = useState(null)

  useEffect(() => {
    setInputVal(value)
  }, [value])

  const closeDropdown = useCallback(() => {
    setDropdownShow(false)
  }, [])

  const optionsClick = useCallback(
    (value, item) => {
      setInputVal(value)
      setDropdownShow(false)
      onSearch && onSearch(value, item)
    },
    [onSearch]
  )

  const moveFocus = useCallback(
    (direction) => {
      let newFocusIndex = null
      let newSubFocusIndex = null
      if (direction === 'up') {
        if (focusIndex === null) {
          newFocusIndex = data.length - 1
          if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
            newSubFocusIndex = 0
          }
        } else {
          if (!(data[focusIndex].children && data[focusIndex].children.length > 0)) {
            newFocusIndex = focusIndex === 0 ? data.length - 1 : focusIndex - 1
            if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
              newSubFocusIndex = 0
            }
          } else {
            if (subFocusIndex === 0) {
              newFocusIndex = focusIndex === 0 ? data.length - 1 : focusIndex - 1
              if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                newSubFocusIndex = 0
              }
            } else {
              newFocusIndex = focusIndex
              newSubFocusIndex = subFocusIndex + 1
            }
          }
        }
      } else {
        if (focusIndex === null) {
          newFocusIndex = 0
          if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
            newSubFocusIndex = 0
          }
        } else {
          if (!(data[focusIndex].children && data[focusIndex].children.length > 0)) {
            newFocusIndex = focusIndex === data.length - 1 ? 0 : focusIndex + 1
            if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
              newSubFocusIndex = 0
            }
          } else {
            if (subFocusIndex === data[focusIndex].children.length - 1) {
              newFocusIndex = focusIndex === data.length - 1 ? 0 : focusIndex + 1
              if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                newSubFocusIndex = 0
              }
            } else {
              newFocusIndex = focusIndex
              newSubFocusIndex = subFocusIndex + 1
            }
          }
        }
      }
      setFocusIndex(newFocusIndex)
      setSubFocusIndex(newSubFocusIndex)
    },
    [focusIndex, subFocusIndex, data]
  )

  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        e.preventDefault()
        closeDropdown()
      }
      if (e.keyCode === 9) {
        closeDropdown()
      }
      if (e.keyCode === 38) {
        e.preventDefault()
        moveFocus('up')
      }
      if (e.keyCode === 40) {
        e.preventDefault()
        moveFocus('down')
      }
    },
    [closeDropdown, moveFocus]
  )

  return (
    <div className={prefixCls} style={style}>
      <div className={`${prefixCls}_input`} ref={searchInputContainer}>
        <Input
          type="text"
          value={inputVal}
          style={style}
          disabled={disabled}
          placeholder={placeholder}
          clearable="true"
          prepend={prepend}
          onKeyUp={(e) => {
            const evt = window.event || e
            if (evt.keyCode === 13) {
              onSearch && onSearch(inputVal)
              closeDropdown()
            }
          }}
          onKeyDown={onKeyDown}
          onFocus={() => {
            data && data.length > 0 && setDropdownShow(true)
          }}
          onChange={(e) => {
            const { value } = e.target
            setInputVal(value)
            data && value.length > 0 && setDropdownShow(true)
            onChange && onChange(value)
            setFocusIndex(null)
            setSubFocusIndex(null)
          }}
        />
        {append ? (
          <span
            className={disabled ? 'disabled' : ''}
            onClick={(e) => {
              e.preventDefault()
              setDropdownShow(false)
              onSearch && onSearch(inputVal)
              setFocusIndex(null)
              setSubFocusIndex(null)
            }}
          >
            {append}
          </span>
        ) : (
          <Button
            type="default"
            icon="search"
            className={disabled ? 'disabled' : ''}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault()
              setDropdownShow(false)
              onSearch && onSearch(inputVal)
              setFocusIndex(null)
              setSubFocusIndex(null)
            }}
          />
        )}
      </div>
      {data && (
        <SearchDropdown
          focusIndex={focusIndex}
          subFocusIndex={subFocusIndex}
          prefixCls={prefixCls}
          inputVal={inputVal}
          overlayClassName={overlayClassName}
          optionsClick={optionsClick}
          onClickOutside={() => {
            closeDropdown()
            setFocusIndex(null)
            setSubFocusIndex(null)
          }}
          data={data}
          loading={loading}
          dropdownShow={dropdownShow}
          localeDatas={localeDatas}
          theme={theme}
          searchInputContainer={searchInputContainer}
        />
      )}
    </div>
  )
}

Search.defaultProps = {
  style: { width: 200 },
  loading: false
}
export default Provider(Search)
