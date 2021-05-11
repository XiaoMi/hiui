import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react'
import classNames from 'classnames'
import _, { isArray } from 'lodash'

import Popper from '../popper'
import SelectInput from './SelectInput'
import SelectDropdown from './SelectDropdown'
import Provider from '../context'
import HiRequest from '../hi-request/index'
import { resetSelectedItems, transKeys, uniqBy } from './utils'

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
    onFocus,
    dataSource,
    filterOption,
    theme,
    localeDatas,
    preventOverflow,
    placement,
    onSearch,
    onChange: propsonChange,
    onOverlayScroll,
    value,
    defaultValue,
    autoload,
    searchable: propsSearchable,
    fieldNames,
    overlayClassName,
    setOverlayContainer,
    bordered = true,
    overlayClickOutSideEventName = 'click'
  } = props
  const selectInputContainer = useRef()
  const autoloadFlag = useRef(autoload) // 多选情况下，需要记录是否进行了筛选
  const historyData = useRef([])
  const [dropdownItems, setDropdownItems] = useState(data)
  const [isGroup, setIsGroup] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isFocus, setIsFouces] = useState(false)
  const SelectWrapper = useRef()
  const targetByKeyDown = useRef(false)
  const CancelToken = HiRequest.CancelToken
  let cancel
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
    if (dataSource) {
      // 在异步多选的时候时候才需要进行值的记录
      type === 'multiple' && setCacheSelectItem(selectedItems)
      autoload && remoteSearch()
    }
    resetFocusedIndex()
  }, [])

  useEffect(() => {
    if (dropdownItems && dropdownItems.length) {
      setIsGroup(
        dropdownItems.every((item) => {
          return item.children && item.children.length > 0
        })
      )
    }
    historyData.current = uniqBy(data.concat(dropdownItems, historyData.current), transKeys(fieldNames, 'id'))
  }, [dropdownItems, data])

  useEffect(() => {
    resetFocusedIndex()
  }, [keyword, isGroup])

  useEffect(() => {
    const dataSourcePropsSearchable = typeof propsSearchable !== 'undefined' ? propsSearchable : true // 在存在dataSource的时候，默认searchable为true
    setSearchable(dataSource ? dataSourcePropsSearchable : propsSearchable)
  }, [propsSearchable])

  useEffect(() => {
    setIsFouces(dropdownShow)
  }, [dropdownShow])

  useEffect(() => {
    if (value !== undefined) {
      // 处理默认值的问题
      const selectedItems = resetSelectedItems(
        value,
        uniqBy(cacheSelectItem.concat(dropdownItems), transKeys(fieldNames, 'id')),
        transKeys(fieldNames, 'id')
      )
      setSelectedItems(selectedItems)
      resetFocusedIndex()
    }
  }, [value, cacheSelectItem])

  useEffect(() => {
    const _data = _.cloneDeep(data)
    const selectedItems = resetSelectedItems(
      value === undefined ? defaultValue : value,
      historyData.current,
      transKeys(fieldNames, 'id')
    )
    setSelectedItems(selectedItems)
    if (dataSource && type === 'multiple') {
      setCacheSelectItem(selectedItems)
      !dropdownShow && searchable && setDropdownItems(selectedItems)
    } else {
      if (dataSource) {
        searchable && setDropdownItems(_data)
      } else {
        setDropdownItems(_data)
      }
    }
  }, [data, value])

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
      propsonChange && propsonChange(selectedIds, changedItems, selectedItems)
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
    if (dataSource && type === 'multiple' && !autoloadFlag.current) {
      setCacheSelectItem(selectedItems)
      setDropdownItems(selectedItems)
    }
  }, [dropdownShow, selectedItems, dataSource, type])
  // 获取分组的数据 以及下标
  const getGroupDropdownItems = useCallback(
    (focusedIndex, group, direction) => {
      let _focusedIndex = focusedIndex
      let _group = group
      !isNaN(Number(_focusedIndex)) && (_focusedIndex = '0-0')
      const focusedGroup = _focusedIndex.split('-')
      const l = dropdownItems.length
      let _dropdownItems = []
      if (focusedGroup[1] / 1 === 0 && group !== undefined) {
        if (!dropdownItems[group]) {
          _group = l - 1
        }
        _dropdownItems = dropdownItems[group]
          ? dropdownItems[group][transKeys(fieldNames, 'children')]
          : dropdownItems[direction === 'down' ? 0 : l - 1][transKeys(fieldNames, 'children')]
        focusedGroup[1] = direction === 'down' ? -1 : _dropdownItems.length
      } else {
        _dropdownItems =
          (dropdownItems[focusedGroup[0]] && dropdownItems[focusedGroup[0]][transKeys(fieldNames, 'children')]) || []
        _group = focusedGroup[0]
      }
      return { _dropdownItems, _focusedIndex: focusedGroup[1], group: _group }
    },
    [focusedIndex, dropdownItems, fieldNames]
  )
  // 方向键的回调
  const moveFocusedIndex = useCallback(
    (direction) => {
      targetByKeyDown.current = true
      let _focusedIndex = focusedIndex
      let _dropdownItems = dropdownItems
      let group = 0
      if (isGroup) {
        const groupDropdownItems = getGroupDropdownItems(_focusedIndex)
        _dropdownItems = groupDropdownItems._dropdownItems
        _focusedIndex = groupDropdownItems._focusedIndex
        group = groupDropdownItems.group
      }

      const everyIsDisabled = _dropdownItems.every((item) => {
        return item[transKeys(fieldNames, 'disabled')]
      })

      // 防止出现所有的选项都为 disabled
      if (!everyIsDisabled) {
        if (direction === 'up') {
          if (isGroup) {
            if (_focusedIndex / 1 === 0) {
              const groupDropdownItems = getGroupDropdownItems(_focusedIndex, --group)
              _dropdownItems = groupDropdownItems._dropdownItems
              _focusedIndex = groupDropdownItems._focusedIndex
              group = groupDropdownItems.group
              // 二次校验分组后的是否都是不可点击
              if (
                _dropdownItems.every((item) => {
                  return item[transKeys(fieldNames, 'disabled')]
                })
              ) {
                return
              }
            }
          } else {
            _focusedIndex === 0 && (_focusedIndex = _dropdownItems.length)
          }
          _focusedIndex--
          while (_dropdownItems[_focusedIndex] && _dropdownItems[_focusedIndex].disabled) {
            _focusedIndex === 0 && (_focusedIndex = _dropdownItems.length)
            _focusedIndex--
          }
        } else {
          if (isGroup) {
            if (_focusedIndex / 1 === _dropdownItems.length - 1) {
              group++
              const groupDropdownItems = getGroupDropdownItems(group + '-0', group, direction)
              _dropdownItems = groupDropdownItems._dropdownItems
              _focusedIndex = groupDropdownItems._focusedIndex
              group = groupDropdownItems.group
              // 二次校验分组后的是否都是不可点击
              if (
                _dropdownItems.every((item) => {
                  return item[transKeys(fieldNames, 'disabled')]
                })
              ) {
                return
              }
            }
          } else {
            _focusedIndex === _dropdownItems.length - 1 && (_focusedIndex = -1)
          }
          _focusedIndex++
          while (_dropdownItems[_focusedIndex] && _dropdownItems[_focusedIndex].disabled) {
            _focusedIndex === _dropdownItems.length - 1 && (_focusedIndex = -1)
            _focusedIndex++
          }
        }
      }
      setFocusedIndex(isGroup ? group + '-' + _focusedIndex : _focusedIndex)
    },
    [focusedIndex, dropdownItems, fieldNames, targetByKeyDown.current]
  )
  // 点击回车选中
  const onEnterSelect = useCallback(() => {
    const focusedGroup = isGroup && focusedIndex.split('-')
    const item = isGroup
      ? dropdownItems[focusedGroup[0]][transKeys(fieldNames, 'children')][focusedGroup[1]]
      : dropdownItems[focusedIndex]
    onClickOption(item, focusedIndex)
  }, [dropdownItems, focusedIndex, onClickOption])

  // 按键操作
  const handleKeyDown = useCallback(
    (evt) => {
      if (dropdownShow && !disabled) {
        evt.stopPropagation()
        if (evt.keyCode === 38) {
          evt.preventDefault()
          moveFocusedIndex('up')
        }
        if (evt.keyCode === 40) {
          evt.preventDefault()
          moveFocusedIndex('down')
        }
        if (evt.keyCode === 13) {
          // enter
          onEnterSelect()
        }
        // esc
        if (evt.keyCode === 27) {
          setDropdownShow(false)
        }
        if (
          evt.keyCode === 32 &&
          !document.activeElement.classList.value.includes('hi-select__dropdown__searchbar--input')
        ) {
          evt.preventDefault()
          setDropdownShow(!dropdownShow)
        }
      }
    },
    [onEnterSelect, moveFocusedIndex, targetByKeyDown.current]
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
    // 取消上一次的请求
    const CANCEL_STATE = 'Cancel'
    typeof cancel === 'function' && cancel(CANCEL_STATE)
    HiRequest({
      url,
      method,
      data: data,
      cancelToken: new CancelToken((c) => {
        cancel = c
      }),
      withCredentials: _withCredentials,
      error,
      beforeRequest: (config) => {
        setLoading(true)
        return config
      },
      errorCallback: (err) => {
        const { message = 'normal' } = err
        setLoading(message === CANCEL_STATE)
        error && error(err)
      },
      ...options
    }).then(
      (response) => {
        const { message = 'normal' } = response
        if (message !== CANCEL_STATE) {
          setLoading(false)
          const dataItems = transformResponse && transformResponse(response.data, response)
          if (Array.isArray(dataItems)) {
            setDropdownItems(dataItems)
          } else {
            console.error('transformResponse return data is not array')
          }
        }
      },
      (error) => {
        throw error
      }
    )
  }, [])

  // 过滤筛选项
  const onFilterItems = useCallback(
    (keyword) => {
      setKeyword(keyword)
      if (typeof onSearch === 'function') {
        onSearch(keyword)
        return
      }
      if (dataSource && (autoload || keyword) && searchable) {
        remoteSearch(keyword)
      }
      if (dataSource && searchable && keyword === '' && selectedItems.length > 0) {
        setDropdownItems(cacheSelectItem)
      }
    },
    [dataSource, cacheSelectItem, keyword, selectedItems, searchable, onSearch, remoteSearch, autoload]
  )
  // 重置下标
  const resetFocusedIndex = () => {
    let _dropdownItems = dropdownItems || []
    let _focusedIndex = 0
    let groupIndex = 0
    if (isGroup) {
      _dropdownItems = dropdownItems[groupIndex][transKeys(fieldNames, 'children')]
      _focusedIndex = 0
    }
    while (
      _dropdownItems[_focusedIndex] &&
      _dropdownItems[_focusedIndex].disabled &&
      _focusedIndex < _dropdownItems.length
    ) {
      _focusedIndex++
    }
    if (typeof value !== 'undefined' || typeof defaultValue !== 'undefined') {
      let _value = value || defaultValue
      if (!isArray(_value)) {
        _value = [_value]
      }
      _focusedIndex = 0

      if (isGroup) {
        let _isValid = false
        while (groupIndex < dropdownItems.length && !_isValid) {
          _dropdownItems = dropdownItems[groupIndex][transKeys(fieldNames, 'children')]
          _isValid =
            _dropdownItems &&
            _dropdownItems.some((item, index) => {
              if (type === 'single') {
                return item[transKeys(fieldNames, 'id')] === _value[0] && (_focusedIndex = index)
              } else {
                return _value.includes(item[transKeys(fieldNames, 'id')]) && (_focusedIndex = index)
              }
            })
          !_isValid && groupIndex++
        }
      } else {
        let _isValid = false

        _dropdownItems.forEach((item, index) => {
          if (!_isValid) {
            if (type === 'single') {
              item[transKeys(fieldNames, 'id')] === _value && (_focusedIndex = index)
            } else {
              if (_value.includes(item[transKeys(fieldNames, 'id')])) {
                _focusedIndex = index
                _isValid = true
              }
            }
          }
        })
      }
    }
    setFocusedIndex(isGroup ? groupIndex + '-' + _focusedIndex : _focusedIndex)
  }

  // 全部删除
  const deleteAllItems = () => {
    onChange([], type === 'multiple' ? selectedItems : selectedItems[0], () => {
      onFilterItems('')
      resetFocusedIndex()
    })
    setCacheSelectItem([])
    dataSource && searchable && setDropdownItems([])
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
    filterItems.forEach((filterItem) => {
      const filterItemOrGroupChilds = isArray(filterItem.children) ? filterItem.children : [filterItem]
      filterItemOrGroupChilds.forEach((item) => {
        if (!item[transKeys(fieldNames, 'disabled')] && matchFilter(item)) {
          if (
            !_selectedItems.some((selectItem) => {
              const key = transKeys(fieldNames, 'id')
              return selectItem[key] === item[key]
            })
          ) {
            _selectedItems.push(item)
            changedItems.push(item)
          }
        }
      })
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
    <div
      className={classNames('hi-select', className, extraClass)}
      style={style}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      ref={SelectWrapper}
    >
      <div className="hi-select__input-container" ref={selectInputContainer}>
        <SelectInput
          theme={theme}
          mode={type}
          selectInputWidth={selectInputWidth}
          disabled={disabled}
          searchable={searchable} // 要删除掉
          clearable={clearable}
          dropdownShow={dropdownShow}
          placeholder={placeholder}
          selectedItems={selectedItems || []}
          multipleMode={multipleWrap}
          cacheSelectItem={cacheSelectItem}
          onFocus={onFocus}
          onClickOption={onClickOption}
          onClear={deleteAllItems}
          fieldNames={fieldNames}
          isFocus={isFocus}
          value={value}
          bordered={bordered}
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
        overlayClickOutSideEventName={overlayClickOutSideEventName}
        setOverlayContainer={setOverlayContainer}
        // 是否防止溢出功能   暂时不开放
        preventOverflow={preventOverflow}
        // 自定义options的方向
        placement={placement || 'top-bottom-start'}
        className="hi-select__popper"
        onKeyDown={handleKeyDown}
        tabIndex="-1"
        width={optionWidth}
        onClickOutside={() => {
          hideDropdown()
        }}
      >
        <SelectDropdown
          emptyContent={emptyContent}
          fieldNames={fieldNames}
          localeMap={localeDatas.select || {}}
          mode={type}
          onOverlayScroll={onOverlayScroll}
          targetByKeyDown={targetByKeyDown}
          searchPlaceholder={searchPlaceholder}
          theme={theme}
          onFocus={onFocus}
          isByRemoteSearch={dataSource}
          isByCustomSearch={onSearch}
          onSearch={debouncedFilterItems}
          searchable={searchable}
          showCheckAll={showCheckAll}
          checkAll={checkAll}
          loading={loading}
          autoloadFlag={autoloadFlag}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
          showJustSelected={showJustSelected}
          filterOption={filterOption}
          matchFilter={matchFilter}
          isGroup={isGroup}
          show={dropdownShow}
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
