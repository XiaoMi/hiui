import React, { useState, useEffect, useRef, forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'
import HiRequest from '../_util/hi-request'
// 格式化value
const parseValue = value => {
  if (Array.isArray(value)) {
    return value.map(v => {
      return typeof v === 'object' ? v.id : v
    })
  } else {
    return [value]
  }
}

const InternalSelect = props => {
  const {
    data,
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
    onBlur,
    onFocus,
    dataSource,
    filterOption,
    theme,
    localeDatas,
    preventOverflow,
    placement,
    onChange: propsonChange,
    value,
    defaultValue,
    autoload,
    searchable: propsSearchable
  } = props

  const selectInputContainer = useRef()
  const [dropdownItems, setDropdownItems] = useState(data)
  const [focusedIndex, setFocusedIndex] = useState(0)

  // 整理Select数据结构 获取选中的Items id
  const resetSelectedItems = (value, dropdownItems = []) => {
    const values = parseValue(value)
    const selectedItems = dropdownItems.filter(item => {
      return values.includes(item.id)
    })
    return selectedItems
  }

  // value 有可能是0的情况
  const [selectedItems, setSelectedItems] = useState(
    resetSelectedItems(
      value === undefined ? defaultValue : value,
      cloneDeep(data)
    )
  )

  const [dropdownShow, setDropdownShow] = useState(false)
  // 搜索关键字
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false) // 请求数据的loading状态
  const [searchable, setSearchable] = useState(
    dataSource ? true : propsSearchable
  )

  useEffect(() => {
    setSearchable(dataSource ? true : propsSearchable)
  }, [propsSearchable])

  useEffect(() => {
    if (!dataSource) {
      const _data = cloneDeep(data)
      const selectedItems = resetSelectedItems(
        value === undefined ? defaultValue : value,
        _data
      )
      setSelectedItems(selectedItems)
      setDropdownItems(_data)
    }
  }, [data])

  useEffect(() => {
    if (value !== undefined) {
      const selectedItems = resetSelectedItems(value, dropdownItems) // 异步获取时会从内部改变dropdownItems，所以不能从list取
      setSelectedItems(selectedItems)
    }
  }, [value])

  const localeDatasProps = key => {
    if (props[key]) {
      return props[key]
    } else {
      return localeDatas.select[key]
    }
  }

  // 选中某一项
  const onClickOption = (item, index) => {
    if (!item || item.disabled) return

    let _selectedItems = cloneDeep(selectedItems)
    if (type === 'multiple') {
      // 获取元素索引
      const itemIndex = _selectedItems.findIndex(sItem => {
        return sItem.id === item.id
      })
      if (itemIndex === -1) {
        _selectedItems.push(item)
      } else {
        _selectedItems.splice(itemIndex, 1)
      }
    } else {
      _selectedItems = [item]
    }
    onChange(_selectedItems, item, () => {
      setFocusedIndex(index)
    })

    type !== 'multiple' && hideDropdown()
  }

  // 收起下拉框
  const hideDropdown = () => {
    if (dropdownShow) {
      setKeyword('')
      setDropdownShow(false)
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
    propsonChange && propsonChange(selectedIds, changedItems)
  }
  // 点击回车选中
  const onEnterSelect = () => {
    const item = dropdownItems[focusedIndex]
    onClickOption(item, focusedIndex)
  }
  // 按键操作
  const handleKeyDown = evt => {
    if (evt.keyCode === 13) {
      onEnterSelect()
    }

    if (evt.keyCode === 38) {
      evt.preventDefault()
      moveFocusedIndex('up')
    }
    if (evt.keyCode === 40) {
      evt.preventDefault()
      moveFocusedIndex('down')
    }
  }
  // 对关键字的校验 对数据的过滤
  const matchFilter = item => {
    const shouldMatch = dataSource || !searchable || !keyword

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
  useEffect(() => {
    if (dataSource && autoload) {
      remoteSearch()
    }
  })
  // 远程搜索需要重写
  const remoteSearch = keyword => {
    const _dataSource =
      typeof dataSource === 'function' ? dataSource(keyword) : dataSource
    if (Array.isArray(_dataSource)) {
      setDropdownItems(_dataSource)
      return
    }
    // 处理promise函数
    if (_dataSource.toString() === '[object Promise]') {
      setLoading(true)
      _dataSource.then(
        res => {
          setLoading(false)
          setDropdownItems(Array.isArray(res) ? res : [])
        },
        () => {
          setLoading(false)
          setDropdownItems([])
        }
      )
      return
    }
    // 远程搜索
    HiRequestSearch(_dataSource)
  }
  const HiRequestSearch = _dataSource => {
    let {
      url,
      method = 'GET',
      transformResponse,
      headers,
      data = {},
      params = {},
      key,
      transformkeyword,
      error,
      ...options
    } = _dataSource
    // 处理Key
    if (key) {
      options.params = Object.assign(
        {},
        { [key]: transformkeyword ? transformkeyword(keyword) : keyword },
        { ...params }
      )
    }

    HiRequest({
      url,
      method,
      data: data,
      beforeRequest: config => {
        setLoading(true)
        return config
      },
      errorCallback: err => {
        setLoading(false)
        error && error(err)
      },
      ...options
    }).then(
      response => {
        setLoading(false)
        const dataItems = transformResponse && transformResponse(response)
        if (Array.isArray(dataItems)) {
          setDropdownItems(dataItems)
        } else {
          console.error('transformResponse return data is not array')
        }
      },
      error => {
        throw error
      }
    )
  }
  useEffect(() => {
    resetFocusedIndex()
  }, [keyword])
  // 过滤筛选项
  const onFilterItems = keyword => {
    setKeyword(keyword)

    if (dataSource && (autoload || keyword)) {
      remoteSearch(keyword)
    }
  }
  // 重置下标
  const resetFocusedIndex = () => {
    let _focusedIndex = -1
    dropdownItems.every(item => {
      _focusedIndex++
      if (!item.disabled && matchFilter(item)) {
        return false
      }
      return true
    })
    setFocusedIndex(_focusedIndex)
    return _focusedIndex
  }
  // 删除某一项
  const deleteItem = item => {
    if (item.disabled) return
    let _selectedItems = selectedItems.concat()
    const sIndex = _selectedItems.findIndex(selectedItem => {
      return selectedItem.id === item.id
    })
    _selectedItems.splice(sIndex, 1)
    onChange(_selectedItems, item, () => {})
  }
  // 全部删除
  const deleteAllItems = () => {
    onChange(
      [],
      type === 'multiple' ? selectedItems : selectedItems[0],
      () => {
        onFilterItems('')
        resetFocusedIndex()
      },
      []
    )
  }
  // 防抖
  const debouncedFilterItems = debounce(onFilterItems, 300)
  // 全选
  const checkAll = (e, filterItems, isCheck) => {
    // 全选
    e && e.stopPropagation()
    if (!isCheck) {
      onChange([], [], () => {})
      return
    }
    let _selectedItems = [...selectedItems]
    let changedItems = []
    filterItems.forEach(item => {
      if (!item.disabled && matchFilter(item)) {
        if (
          !_selectedItems.map(selectItem => selectItem.id).includes(item.id)
        ) {
          _selectedItems.push(item)
          changedItems.push(item)
        }
      }
    })
    onChange(_selectedItems, changedItems, () => {})
  }
  // input点击事件
  const handleInputClick = e => {
    if (dropdownShow) {
      hideDropdown()
      return
    }
    if (disabled) {
      return
    }
    !dropdownShow && setDropdownShow(true)
  }
  const placeholder = localeDatasProps('placeholder')
  const emptyContent = localeDatasProps('emptyContent')
  const searchPlaceholder = localeDatasProps('searchPlaceholder')
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
          searchable={searchable} // 要删除掉
          clearable={clearable}
          dropdownShow={dropdownShow}
          placeholder={placeholder}
          selectedItems={selectedItems || []}
          multipleMode={multipleWrap}
          onBlur={onBlur}
          onFocus={onFocus}
          onDelete={deleteItem}
          onClear={deleteAllItems}
          onClick={() => {
            handleInputClick()
          }}
        />
      </div>
      {children}
      <Popper
        show={dropdownShow}
        attachEle={selectInputContainer.current}
        zIndex={1050}
        topGap={5}
        leftGap={0}
        // 是否防止溢出功能   暂时不开放
        preventOverflow={preventOverflow}
        // 自定义options的方向
        placement={placement || 'top-bottom-start'}
        className='hi-select__popper'
        onClickOutside={() => {
          hideDropdown()
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
          isOnSearch={dataSource}
          onSearch={debouncedFilterItems}
          searchable={searchable}
          showCheckAll={showCheckAll}
          checkAll={checkAll}
          loading={loading}
          focusedIndex={focusedIndex}
          filterOption={filterOption}
          matchFilter={matchFilter}
          show={dropdownShow}
          handleKeyDown={handleKeyDown}
          optionWidth={optionWidth}
          selectInputWidth={selectInputWidth}
          dropdownItems={dropdownItems}
          selectedItems={selectedItems}
          dropdownRender={render}
          onClickOption={onClickOption}
        />
      </Popper>
    </div>
  )
}

InternalSelect.propTypes = {
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

InternalSelect.defaultProps = {
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
const Select = forwardRef((props, ref) => {
  return <InternalSelect {...props} innerRef={ref} />
})
export default Provider(Select)
