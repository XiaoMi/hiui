import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'
import HiRequest from '../_util/hi-request'
import { resetSelectedItems, transKeys } from './utils'

const InternalSelect = (props) => {
  const {
    data,
    type,
    showCheckAll,
    showJustSelected,
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
    searchable: propsSearchable,
    fieldNames,
    overlayClassName,
    setOverlayContainer
  } = props

  const selectInputContainer = useRef()
  const [dropdownItems, setDropdownItems] = useState(data)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isFocus, setIsFouces] = useState(false)
  // 存储问题
  const [cacheSelectItem, setCacheSelectItem] = useState([])

  // value 有可能是0的情况
  const [selectedItems, setSelectedItems] = useState(
    resetSelectedItems(value === undefined ? defaultValue : value, _.cloneDeep(data), transKeys(fieldNames, 'id'))
  )

  const [dropdownShow, setDropdownShow] = useState(false)
  // 搜索关键字
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchable, setSearchable] = useState(dataSource ? true : propsSearchable)
  useEffect(() => {
    // 处理默认值的问题
    const selectedItems = resetSelectedItems(
      value === undefined ? defaultValue : value,
      _.uniqBy(cacheSelectItem.concat(dropdownItems), transKeys(fieldNames, 'id')),
      transKeys(fieldNames, 'id')
    )
    // 在异步多选的时候时候才需要进行值的记录
    dataSource && type === 'multiple' && setCacheSelectItem(selectedItems)
  }, [])
  useEffect(() => {
    setSearchable(dataSource ? true : propsSearchable)
  }, [propsSearchable])

  useEffect(() => {
    setIsFouces(dropdownShow)
  }, [dropdownShow])

  useEffect(() => {
    if (value !== undefined) {
      // 处理默认值的问题
      const selectedItems = resetSelectedItems(
        value,
        _.uniqBy(cacheSelectItem.concat(dropdownItems), transKeys(fieldNames, 'id')),
        transKeys(fieldNames, 'id')
      )
      setSelectedItems(selectedItems)
    }
  }, [value])

  useEffect(() => {
    const _data = _.cloneDeep(data)
    const selectedItems = resetSelectedItems(
      value === undefined ? defaultValue : value,
      _data,
      transKeys(fieldNames, 'id')
    )
    setSelectedItems(selectedItems)
    setDropdownItems(_data)
    dataSource && type === 'multiple' && setCacheSelectItem(selectedItems)
  }, [data])

  const localeDatasProps = useCallback(
    (key) => {
      if (props[key]) {
        return props[key]
      } else {
        return localeDatas.select[key]
      }
    },
    [props]
  )
  // 改变的回调
  const onChange = useCallback(
    (selectedItems, changedItems, callback) => {
      if (value === undefined) {
        setSelectedItems(selectedItems)
        callback()
      }
      // 调用用户的select
      const selectedIds = selectedItems.map((item) => item[transKeys(fieldNames, 'id')])
      propsonChange && propsonChange(selectedIds, changedItems)
    },
    [propsonChange]
  )
  // 选中某一项
  const onClickOption = useCallback(
    (item, index) => {
      if (!item || item[transKeys(fieldNames, 'disabled')]) return

      let _selectedItems = _.cloneDeep(selectedItems)
      if (type === 'multiple') {
        // 获取元素索引
        const itemIndex = _selectedItems.findIndex((sItem) => {
          return sItem[transKeys(fieldNames, 'id')] === item[transKeys(fieldNames, 'id')]
        })
        if (itemIndex === -1) {
          _selectedItems.push(item)
        } else {
          _selectedItems.splice(itemIndex, 1)
        }
        // 在受控情况下
        if (_.isEqual(cacheSelectItem, selectedItems) && dataSource) {
          setCacheSelectItem(_selectedItems)
        }
      } else {
        _selectedItems = [item]
      }
      onChange(_selectedItems, item, () => {
        setFocusedIndex(index)
      })
      type !== 'multiple' && hideDropdown()
    },
    [type, selectedItems, onChange, dropdownShow, cacheSelectItem]
  )

  // 收起下拉框
  const hideDropdown = useCallback(() => {
    if (dropdownShow) {
      setKeyword('')
      setDropdownShow(false)
    }
    // 多选具有默认值的话打开的话应该显示选中的值
    if (dataSource && type === 'multiple') {
      setCacheSelectItem(selectedItems)
      setDropdownItems(selectedItems)
    }
  }, [dropdownShow, selectedItems, dataSource, type])
  // 方向键的回调
  const moveFocusedIndex = useCallback(
    (direction) => {
      let _focusedIndex = focusedIndex
      if (direction === 'up') {
        dropdownItems
          .slice(0, _focusedIndex)
          .reverse()
          .every((item) => {
            _focusedIndex--
            if (!item[transKeys(fieldNames, 'disabled')] && matchFilter(item)) {
              return false
            }
            return true
          })
      } else {
        dropdownItems.slice(_focusedIndex + 1).every((item) => {
          _focusedIndex++
          if (!item[transKeys(fieldNames, 'disabled')] && matchFilter(item)) {
            return false
          }
          return true
        })
      }

      setFocusedIndex(_focusedIndex)
    },
    [focusedIndex, dropdownItems, fieldNames]
  )
  // 点击回车选中
  const onEnterSelect = useCallback(() => {
    const item = dropdownItems[focusedIndex]
    onClickOption(item, focusedIndex)
  }, [dropdownItems, focusedIndex, onClickOption])
  // 按键操作
  const handleKeyDown = useCallback(
    (evt) => {
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
    },
    [onEnterSelect, moveFocusedIndex, moveFocusedIndex]
  )
  // 对关键字的校验 对数据的过滤
  const matchFilter = useCallback(
    (item) => {
      const shouldMatch = dataSource || !searchable || !keyword

      if (typeof filterOption === 'function') {
        return shouldMatch || filterOption(keyword, item)
      }

      return (
        shouldMatch ||
        String(item[transKeys(fieldNames, 'id')] || '').includes(keyword) ||
        String(item[transKeys(fieldNames, 'title')] || '').includes(keyword)
      )
    },
    [dataSource, searchable, keyword, filterOption]
  )

  useEffect(() => {
    if (dataSource && autoload) {
      remoteSearch()
    }
  })

  const remoteSearch = useCallback(
    (keyword) => {
      const _dataSource = typeof dataSource === 'function' ? dataSource(keyword) : dataSource
      if (Array.isArray(_dataSource)) {
        setDropdownItems(_dataSource)
        return
      }
      // 处理promise函数
      if (_dataSource.toString() === '[object Promise]') {
        setLoading(true)
        _dataSource.then(
          (res) => {
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
      // 调用接口
      HiRequestSearch(_dataSource, keyword)
    },
    [dataSource, keyword]
  )
  const HiRequestSearch = useCallback((_dataSource, keyword) => {
    const {
      url,
      method = 'GET',
      transformResponse,
      headers,
      data = {},
      params = {},
      key,
      error,
      credentials,
      withCredentials = false,
      ...options
    } = _dataSource
    // 处理Key

    options.params = key ? { [key]: keyword, ...params } : params

    const _withCredentials = withCredentials || credentials === 'include'

    HiRequest({
      url,
      method,
      data: data,
      withCredentials: _withCredentials,
      error,
      beforeRequest: (config) => {
        setLoading(true)
        return config
      },
      errorCallback: (err) => {
        setLoading(false)
        error && error(err)
      },
      ...options
    }).then(
      (response) => {
        setLoading(false)
        const dataItems = transformResponse && transformResponse(response)
        if (Array.isArray(dataItems)) {
          setDropdownItems(dataItems)
        } else {
          console.error('transformResponse return data is not array')
        }
      },
      (error) => {
        throw error
      }
    )
  }, [])
  useEffect(() => {
    resetFocusedIndex()
  }, [keyword])
  // 过滤筛选项
  const onFilterItems = (keyword) => {
    setKeyword(keyword)

    if (dataSource && (autoload || keyword)) {
      remoteSearch(keyword)
    }
  }
  // 重置下标
  const resetFocusedIndex = () => {
    let _focusedIndex = -1
    dropdownItems.every((item) => {
      _focusedIndex++
      if (!item[transKeys(fieldNames, 'disabled')] && matchFilter(item)) {
        return false
      }
      return true
    })
    setFocusedIndex(_focusedIndex)
    return _focusedIndex
  }

  // 全部删除
  const deleteAllItems = () => {
    onChange([], type === 'multiple' ? selectedItems : selectedItems[0], () => {
      onFilterItems('')
      resetFocusedIndex()
    })
    setCacheSelectItem([])
  }
  // 防抖
  const debouncedFilterItems = _.debounce(onFilterItems, 300)
  // 全选
  const checkAll = (e, filterItems, isCheck) => {
    // 全选
    e && e.stopPropagation()
    if (!isCheck) {
      onChange([], [], () => {})
      return
    }
    const _selectedItems = [...selectedItems]
    const changedItems = []
    filterItems.forEach((item) => {
      if (!item[transKeys(fieldNames, 'disabled')] && matchFilter(item)) {
        if (
          !_selectedItems
            .map((selectItem) => selectItem[transKeys(fieldNames, 'id')])
            .includes(item[transKeys(fieldNames, 'id')])
        ) {
          _selectedItems.push(item)
          changedItems.push(item)
        }
      }
    })
    onChange(_selectedItems, changedItems, () => {})
  }
  // input点击事件
  const handleInputClick = () => {
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
    <div className={classNames('hi-select', className, extraClass)} style={style}>
      <div className="hi-select__input-container" ref={selectInputContainer}>
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
          cacheSelectItem={cacheSelectItem}
          onBlur={onBlur}
          onFocus={onFocus}
          onClickOption={onClickOption}
          onClear={deleteAllItems}
          fieldNames={fieldNames}
          isFocus={isFocus}
          value={value}
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
        overlayClassName={overlayClassName}
        setOverlayContainer={setOverlayContainer}
        // 是否防止溢出功能   暂时不开放
        preventOverflow={preventOverflow}
        // 自定义options的方向
        placement={placement || 'top-bottom-start'}
        className="hi-select__popper"
        onClickOutside={() => {
          hideDropdown()
        }}
      >
        <SelectDropdown
          emptyContent={emptyContent}
          fieldNames={fieldNames}
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
          showJustSelected={showJustSelected}
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

InternalSelect.defaultProps = {
  data: [],
  type: 'single',
  fieldNames: {
    title: 'title',
    id: 'id',
    disabled: 'disabled',
    children: 'children'
  },
  multipleWrap: 'nowrap',
  disabled: false,
  clearable: true,
  defaultValue: '',
  autoload: false,
  showCheckAll: false,
  showJustSelected: false,
  open: true,
  onClick: () => {},
  onBlur: () => {},
  onFocus: () => {}
}
const Select = forwardRef((props, ref) => {
  return <InternalSelect {...props} innerRef={ref} />
})
export default Provider(Select)
