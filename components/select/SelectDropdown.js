import React, { useState, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'
import Checkbox from '../checkbox'
import Loading from '../loading'
import Icon from '../icon'
import { transKeys } from './utils'

const SelectDropdown = props => {
  const {
    mode,
    focusedIndex: propsFocusedIndex,
    matchFilter,
    emptyContent,
    loading,
    optionWidth,
    showCheckAll,
    showJustSelected,
    dropdownRender,
    theme,
    searchable,
    onFocus,
    onBlur,
    searchPlaceholder,
    dropdownItems,
    localeMap,
    handleKeyDown,
    onSearch,
    isOnSearch,
    onClickOption,
    checkAll,
    selectInputWidth,
    selectedItems,
    show,

    fieldNames
  } = props
  const [filterItems, setFilterItems] = useState(dropdownItems)
  const [focusedIndex, setFocuseIndex] = useState(propsFocusedIndex)
  const [searchbarValue, setSearchbarValue] = useState('')
  const [ischeckAll, setIscheckAll] = useState(false)
  const searchbar = useRef('')
  useEffect(() => {
    setFilterItems(dropdownItems)
  }, [dropdownItems])

  // 监控全选功能
  useEffect(() => {
    setIscheckAll(
      selectedItems.length > 0 && selectedItems.length === filterItems.length
    )
  }, [selectedItems, filterItems])
  // 设置选中下标
  useEffect(() => {
    setFocuseIndex(propsFocusedIndex)
  }, [propsFocusedIndex])
  // 让搜索框获取焦点
  useEffect(() => {
    searchable &&
      setTimeout(() => searchbar.current && searchbar.current.focus(), 0)
  }, [])
  // 仅看已选
  const showSelected = useCallback(
    check => {
      if (check) {
        const values = selectedItems.map(item => {
          return item[transKeys(fieldNames, 'id')]
        })
        setFilterItems(
          dropdownItems.filter(item => {
            return values.includes(item[transKeys(fieldNames, 'id')])
          })
        )
      } else {
        setFilterItems(dropdownItems)
      }
    },
    [selectedItems, fieldNames, dropdownItems]
  )
  useEffect(() => {
    let _filterItems = dropdownItems
    setFilterItems(_filterItems)
  }, [mode, isOnSearch, dropdownItems, show])

  let matched = 0
  const style = optionWidth && {
    width: optionWidth
  }

  const filterOptions = useCallback(
    keyword => {
      setFilterItems(dropdownItems)
      setSearchbarValue(keyword)
    },
    [dropdownItems]
  )
  const searchEvent = useCallback(
    e => {
      const filterText = e.target.value
      filterOptions(filterText)
      onSearch(filterText)
    },
    [onSearch]
  )

  const cleanSearchbarValue = useCallback(
    e => {
      e.stopPropagation()
      const filterText = ''
      filterOptions(filterText)
      onSearch(filterText)
    },
    [onSearch]
  )
  // 是否被选中
  const itemSelected = useCallback(
    item => {
      return (
        selectedItems
          .map(item => item[transKeys(fieldNames, 'id')])
          .indexOf(item[transKeys(fieldNames, 'id')]) > -1
      )
    },
    [selectedItems, fieldNames]
  )
  // 点击某个选项时
  const onClickOptionIntal = useCallback(
    (e, item, index) => {
      e.stopPropagation()
      e.preventDefault()
      if (item[transKeys(fieldNames, 'disabled')]) {
        return
      }
      onClickOption(item, index)
    },
    [onClickOption, fieldNames]
  )
  // 高亮关键字
  const hightlightKeyword = useCallback(
    (text, uniqueKey) => {
      let _keyword = searchbarValue
      _keyword = searchbarValue.includes('[')
        ? _keyword.replace(/\[/gi, '\\[')
        : _keyword
      _keyword = searchbarValue.includes('(')
        ? _keyword.replace(/\(/gi, '\\(')
        : _keyword
      _keyword = searchbarValue.includes(')')
        ? _keyword.replace(/\)/gi, '\\)')
        : _keyword

      let parts = text.split(new RegExp(`(${_keyword})`, 'gi'))
      return searchbarValue.length > 0 ? (
        <p key={uniqueKey}>
          {parts.map((part, i) =>
            part === searchbarValue ? (
              <span
                key={i}
                className={'hi-select__dropdown--item__name-hightlight'}
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </p>
      ) : (
        text
      )
    },
    [searchbarValue]
  )
  // 渲染单个选项
  const renderOption = (isSelected, item) => {
    if (dropdownRender) {
      return dropdownRender(item, isSelected)
    }
    const paddingNum = mode === 'multiple' ? 48 : 24
    // 提高可读性
    let width = selectInputWidth ? selectInputWidth - paddingNum : null
    if (optionWidth) {
      width = optionWidth - paddingNum
    }
    const style = {
      width
    }

    return (
      <React.Fragment>
        {mode === 'multiple' && (
          <Checkbox
            className='hi-select__dropdown--item__checkbox'
            checked={isSelected}
            disabled={item[transKeys(fieldNames, 'disabled')]}
          >
            <div className='hi-select__dropdown--item__name' style={style}>
              {isOnSearch
                ? item[transKeys(fieldNames, 'title')]
                : hightlightKeyword(
                  item[transKeys(fieldNames, 'title')],
                  item[transKeys(fieldNames, 'id')]
                )}
            </div>
          </Checkbox>
        )}
        {mode === 'single' && (
          <div className='hi-select__dropdown--item__name' style={style}>
            {isOnSearch
              ? item[transKeys(fieldNames, 'title')]
              : hightlightKeyword(
                item[transKeys(fieldNames, 'title')],
                item[transKeys(fieldNames, 'id')]
              )}
          </div>
        )}
        {mode === 'single' && isSelected && (
          <div className='hi-select__dropdown--item__check-icon'>
            <i className='hi-icon icon-check' />
          </div>
        )}
      </React.Fragment>
    )
  }
  const groupItem = (filterGroupItem, filterItemsIndex) => {
    const renderGroup = []
    const label = (
      <li
        className='hi-select__dropdown--label'
        key={filterGroupItem[transKeys(fieldNames, 'id')]}
      >
        {filterGroupItem[transKeys(fieldNames, 'title')]}
      </li>
    )
    renderGroup.push(label)
    filterGroupItem[transKeys(fieldNames, 'children')].forEach(
      (item, index) => {
        renderGroup.push(normalItem(item, filterItemsIndex + 1 + '-' + index))
      }
    )
    return renderGroup
  }
  const normalItem = (item, filterItemsIndex) => {
    matched++
    const isSelected = itemSelected(item)
    const isDisabled = item[transKeys(fieldNames, 'disabled')]
    return (
      <li
        className={classNames('hi-select__dropdown--item', `theme__${theme}`, {
          'is-active': isSelected,
          'is-disabled': isDisabled,
          'hi-select__dropdown--item-default':
            !item[transKeys(fieldNames, 'children')] && !dropdownRender
        })}
        onClick={e => onClickOptionIntal(e, item, filterItemsIndex)}
        key={item[transKeys(fieldNames, 'id')]}
        index={filterItemsIndex}
        data-focused={focusedIndex === filterItemsIndex}
      >
        {renderOption(isSelected, item, filterItemsIndex)}
      </li>
    )
  }
  const renderItems = () => {
    return (
      <ul className='hi-select__dropdown--items'>
        {filterItems &&
          filterItems.map((item, filterItemsIndex) => {
            if (matchFilter(item)) {
              return item[transKeys(fieldNames, 'children')]
                ? groupItem(item, filterItemsIndex)
                : normalItem(item, filterItemsIndex)
            }
          })}
        {matched === 0 && (
          <li
            className='hi-select__dropdown--item hi-select__dropdown-item--empty is-disabled'
            onClick={e => e.stopPropagation()}
          >
            {emptyContent}
          </li>
        )}
      </ul>
    )
  }
  return (
    <div className='hi-select__dropdown' style={style}>
      {searchable && (
        <div className='hi-select__dropdown__searchbar'>
          <div className='hi-select__dropdown__searchbar--content'>
            <span style={{ cursor: 'pointer' }}>
              <Icon name='search' />
            </span>
            <input
              className='hi-select__dropdown__searchbar--input'
              placeholder={searchPlaceholder}
              clearable='true'
              ref={searchbar}
              value={searchbarValue}
              onFocus={onFocus}
              onBlur={onBlur}
              clearabletrigger='always'
              onKeyDown={handleKeyDown}
              onChange={searchEvent}
            />
            {searchbarValue.length > 0 ? (
              <span style={{ cursor: 'pointer' }} onClick={cleanSearchbarValue}>
                <i
                  className={`hi-icon icon-close-circle hi-select__dropdown--icon__close`}
                />
              </span>
            ) : null}
          </div>
        </div>
      )}
      {loading && (
        <div className='hi-select__dropdown--loading'>
          <Loading size='small' />
        </div>
      )}

      {!loading && renderItems()}

      {mode === 'multiple' && (showCheckAll || showJustSelected) && (
        <div className={`hi-select__dropdown-check-all theme__${theme}`}>
          <div>
            {showCheckAll && (
              <Checkbox
                checked={ischeckAll}
                onChange={e => {
                  checkAll(e, filterItems, e.target.checked)
                }}
              >
                {localeMap['checkAll']}
              </Checkbox>
            )}
          </div>
          <div>
            {showJustSelected && (
              <Checkbox
                onChange={e => {
                  showSelected(e.target.checked)
                }}
              >
                {localeMap['justSelected']}
              </Checkbox>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectDropdown
