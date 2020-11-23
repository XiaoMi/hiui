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

  useEffect(() => {
    setInputVal(value)
  }, [value])

  const closeDropdown = () => {
    setDropdownShow(false)
  }

  const optionsClick = useCallback(
    (value, item) => {
      setInputVal(value)
      setDropdownShow(false)
      onSearch && onSearch(value, item)
    },
    [onSearch]
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
            }
          }}
          onFocus={() => {
            data && data.length > 0 && setDropdownShow(true)
          }}
          onChange={(e) => {
            const { value } = e.target
            setInputVal(value)
            data && value.length > 0 && setDropdownShow(true)
            onChange && onChange(value)
          }}
        />
        {append ? (
          <span
            className={disabled ? 'disabled' : ''}
            onClick={(e) => {
              e.preventDefault()
              setDropdownShow(false)
              onSearch && onSearch(inputVal)
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
            }}
          />
        )}
      </div>
      {data && (
        <SearchDropdown
          prefixCls={prefixCls}
          inputVal={inputVal}
          overlayClassName={overlayClassName}
          optionsClick={optionsClick}
          onClickOutside={() => {
            closeDropdown()
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
