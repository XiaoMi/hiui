import React, { useState, useRef, useEffect } from 'react'
import Input from '../input'
import Button from '../button'
import SearchDropdown from './searchDropdown'
import Provider from '../context'

import './style'

const prefixCls = 'hi-search'

const Search = props => {
  const {
    onChange,
    onSearch,
    style = { width: 200 },
    placeholder,
    prepend,
    disabled,
    data,
    value,
    loading,
    localeDatas,
    append = true // 是否显示后置按钮
  } = props

  const [dropdownShow, setDropdownShow] = useState(false)
  const searchInputContainer = useRef(null)
  const [inputVal, setInputVal] = useState(value || '')

  useEffect(() => {
    setInputVal(value)
  }, [value])

  const closeDropdown = () => {
    setDropdownShow(false)
  }

  const optionsClick = (value, item) => {
    setInputVal(value)
    setDropdownShow(false)
    onSearch && onSearch(value, item)
  }

  return (
    <div className={prefixCls} style={style}>
      <div className={`${prefixCls}_input`} ref={searchInputContainer}>
        <Input
          type='text'
          value={inputVal}
          style={style}
          disabled={disabled}
          placeholder={placeholder}
          clearable='true'
          prepend={prepend}
          onFocus={() => {
            data && data.length > 0 && setDropdownShow(true)
          }}
          onChange={e => {
            const { value } = e.target
            setInputVal(value)
            data && value.length > 0 && setDropdownShow(true)
            onChange && onChange(value)
          }}
        />
        {append && (
          <Button
            type='default'
            icon='search'
            className={disabled ? 'disabled' : ''}
            disabled={disabled}
            onClick={e => {
              e.preventDefault()
              setDropdownShow(true)
              onSearch && onSearch(inputVal)
            }}
          />
        )}
      </div>
      {data && (
        <SearchDropdown
          prefixCls={prefixCls}
          inputVal={inputVal}
          optionsClick={optionsClick}
          onClickOutside={() => {
            closeDropdown()
          }}
          data={data}
          loading={loading}
          dropdownShow={dropdownShow}
          localeDatas={localeDatas}
          searchInputContainer={searchInputContainer}
        />
      )}
    </div>
  )
}

Search.defaultProps = {
  style: { width: 200 },
  append: true,
  loading: false
}
export default Provider(Search)
