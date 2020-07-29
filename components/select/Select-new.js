import React, { Component, useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown-new'
import Provider from '../context'
import fetchJsonp from 'fetch-jsonp'
import qs from 'qs'
import _ from 'lodash'

const Select = props => {
  const {
    type,
    showCheckAll,
    className,
    disabled,
    clearable,
    style,
    children,
    optionWidth,
    render,
    multipleWrap,
    onClick,
    onBlur,
    onFocus,
    dataSource,
    filterOption,
    onSearch,
    theme,
    localeDatas,
    preventOverflow,
    placement,
    onChange,
    value,
    open
  } = props
  const selectInputContainer = useRef()
  const [dropdownItems, setDropdownItems] = useState(data)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState(0)
  const [cacheSelectedItems, setCacheSelectedItems] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [searchable, setSearchable] = useState(
    onSearch || dataSource ? true : searchable
  )
  useEffect(() => {
    setSearchable(onSearch || dataSource ? true : searchable)
  }, [onSearch, dataSource, searchable])

  useEffect(() => {
    setDropdownItems(data)
  }, [data])
  // 选中某一项
  const onClickOption = (item, index) => {
    if (!item || item.disabled) return

    let _selectedItems = selectedItems.concat()
    let _cacheSelectedItems = selectedItems.concat()
    if (type === 'multiple') {
      // 获取元素索引
      const itemIndex = selectedItems.findIndex(sItem => {
        return sItem.id === item.id
      })
      if (itemIndex === -1) {
        _selectedItems.push(item)
        _cacheSelectedItems.push(item)
      } else {
        _selectedItems.splice(itemIndex, 1)
      }
    } else {
      _selectedItems = [item]
      setCacheSelectedItems([item])
    }

    onChange(_selectedItems, item, () => {
      setFocusedIndex(index)
      setCacheSelectedItems(type === 'multiple' ? _cacheSelectedItems : [item])
    })

    type !== 'multiple' && hideDropdown()
  }

  // 收起下拉框
  const hideDropdown = () => {
    if (dropdownShow) {
      setDropdownItems(true)
      setCacheSelectedItems(selectedItems)
      setKeyword('')
    }
  }
  // 改变的回调
  const onChange = (selectedItems, changedItems, callback) => {
    if (value === undefined) {
      setSelectedItems(selectedItems)
      callback()
    }
    // 调用用户的select
    const selectedIds = selectedItems.map(({ id }) => id)
    onChange && onChange(selectedIds, changedItems)
  }
  // 点击回车选中
  const onEnterSelect = () => {
    const item = dropdownItems[focusedIndex]
    onClickOption(item, focusedIndex)
  }
  // 按键操作
  handleKeyDown = evt => {
    if (evt.keyCode === 13) {
      onEnterSelect()
    }

    if (evt.keyCode === 38) {
      evt.preventDefault()
      moveFocusedIndex('up')
    }
    if (evt.keyCode === 40) {
      evt.preventDefault()
      this.moveFocusedIndex('down')
    }
  }
  // 对关键字的校验
  const matchFilter = item => {
    const shouldMatch = onSearch || dataSource || !searchable || !keyword

    if (typeof filterOption === 'function') {
      return shouldMatch || filterOption(keyword, item)
    }

    return (
      shouldMatch ||
      String(item.id || '').includes(keyword) ||
      String(item.title || '').includes(keyword)
    )
  }
  // 方向键的回调
  const moveFocusedIndex = direction => {
    let _focusedIndex = focusedIndex
    if (direction === 'up') {
      dropdownItems
        .slice(0, _focusedIndex)
        .reverse()
        .every(item => {
          _focusedIndex--
          if (!item.disabled && matchFilter(item)) {
            return false
          }
          return true
        })
    } else {
      dropdownItems.slice(_focusedIndex + 1).every(item => {
        _focusedIndex++
        if (!item.disabled && matchFilter(item)) {
          return false
        }
        return true
      })
    }

    setFocusedIndex(_focusedIndex)
  }
  const extraClass = {
    'is-multiple': type === 'multiple',
    'is-single': type === 'single'
  }
  const selectInputWidth = selectInputContainer.current
    ? selectInputContainer.current.getBoundingClientRect().width
    : null
  return (
    <div
      className={classNames('hi-select', className, extraClass)}
      style={style}
    >
      <div className='hi-select__input-container' ref={selectInputContainer}>
        <SelectInput
          handleKeyDown={handleKeyDown}
          theme={theme}
          mode={type}
          disabled={disabled}
          searchable={searchable}
          clearable={clearable}
          dropdownShow={dropdownShow}
          placeholder={placeholder}
          selectedItems={selectedItems || []}
          dropdownItems={dropdownItems}
          multipleMode={multipleWrap}
          container={selectInputContainer.current}
          moveFocusedIndex={this.moveFocusedIndex.bind(this)}
          onClick={() => {
            if (open) {
              this.handleInputClick()
            }
            onClick()
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          onDelete={this.deleteItem.bind(this)}
          onClear={this.deleteAllItems.bind(this)}
          onSearch={this.debouncedFilterItems.bind(this)}
          onEnterSelect={this.onEnterSelect.bind(this)}
        />
      </div>
      {children}
      <Popper
        show={dropdownShow}
        attachEle={this.selectInputContainer}
        zIndex={1050}
        topGap={5}
        leftGap={0}
        preventOverflow={preventOverflow}
        className='hi-select__popper'
        placement={placement || 'top-bottom-start'}
        onClickOutside={() => {
          this.hideDropdown()
        }}
      >
        <SelectDropdown
          emptyContent={emptyContent}
          localeMap={localeDatas.select || {}}
          mode={type}
          searchPlaceholder={searchPlaceholder}
          theme={theme}
          onBlur={onBlur}
          onFocus={onFocus}
          isOnSearch={onSearch || dataSource}
          onSearch={this.debouncedFilterItems.bind(this)}
          searchable={searchable}
          showCheckAll={showCheckAll}
          checkAll={this.checkAll.bind(this)}
          loading={fetching}
          focusedIndex={focusedIndex}
          filterOption={filterOption}
          matchFilter={this.matchFilter.bind(this)}
          setFocusedIndex={this.setFocusedIndex.bind(this)}
          show={dropdownShow}
          handleKeyDown={this.handleKeyDown.bind(this)}
          optionWidth={optionWidth}
          selectInputWidth={selectInputWidth}
          onEnterSelect={this.onEnterSelect.bind(this)}
          moveFocusedIndex={this.moveFocusedIndex.bind(this)}
          dropdownItems={
            dataSource && this.state.keyword === ''
              ? cacheSelectedItems
              : dropdownItems
          }
          selectedItems={selectedItems}
          dropdownRender={render}
          onClickOption={this.onClickOption.bind(this)}
        />
      </Popper>
    </div>
  )
}

Select.propTypes = {
  type: PropTypes.oneOf(['single', 'multiple']),
  multipleWrap: PropTypes.oneOf(['wrap', 'nowrap']),
  data: PropTypes.array,
  dataSource: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number
  ]),
  showCheckAll: PropTypes.bool,
  autoload: PropTypes.bool,
  searchable: PropTypes.bool,
  filterOption: PropTypes.func,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  emptyContent: PropTypes.string,
  optionWidth: PropTypes.number,
  style: PropTypes.object,
  onChange: PropTypes.func,
  render: PropTypes.func,
  open: PropTypes.bool
}

Select.defaultProps = {
  data: [],
  type: 'single',
  multipleWrap: 'nowrap',
  disabled: false,
  clearable: true,
  defaultValue: '',
  autoload: false,
  showCheckAll: false,
  open: true,
  onClick: () => {},
  onBlur: () => {},
  onFocus: () => {}
}

Select.childContextTypes = {
  component: PropTypes.any
}

export default Provider(Select)
