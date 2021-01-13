import React, { useState, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'
import Checkbox from '../checkbox'
import Loading from '../loading'
import Icon from '../icon'
import { transKeys } from './utils'

const SelectDropdown = ({
  mode,
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
  searchPlaceholder,
  dropdownItems,
  localeMap,
  onSearch,
  isOnSearch,
  onClickOption,
  checkAll,
  selectInputWidth,
  selectedItems,
  show,
  fieldNames,
  focusedIndex,
  isGroup,
  setFocusedIndex
}) => {
  const [filterItems, setFilterItems] = useState(dropdownItems)
  const [searchbarValue, setSearchbarValue] = useState('')
  const [isCheckAll, setIsCheckAll] = useState(false)
  const searchbar = useRef('')
  const dropdownWrapper = useRef('')
  useEffect(() => {
    setFilterItems(dropdownItems)
  }, [dropdownItems])
  useEffect(() => {
    if (dropdownWrapper.current) {
      let _focusedIndex = focusedIndex
      if (isGroup) {
        const focusedGroup = _focusedIndex.split('-')
        let group = focusedGroup[0] - 1
        while (dropdownItems[group] && dropdownItems[group][transKeys(fieldNames, 'children')]) {
          _focusedIndex =
            dropdownItems[group][transKeys(fieldNames, 'children')].length + group / 1 + 2 + focusedGroup[1] / 1
          group--
        }
      }
      const _scrollTop = dropdownWrapper.current.scrollTop
      const focusedIndexTop = (_focusedIndex - 6) * 36
      // 防止点击上下滚动问题
      dropdownWrapper.current.scrollTop =
        _scrollTop >= focusedIndexTop && focusedIndexTop > 0 ? _scrollTop : focusedIndexTop
    }
  }, [focusedIndex])

  // 监控全选功能
  useEffect(() => {
    const selectedItemIds = selectedItems.map((item) => {
      return item[transKeys(fieldNames, 'id')]
    })
    const _isCheckAll = filterItems.every((filterItem) => {
      const filterItemOrGroupChilds = Array.isArray(filterItem.children) ? filterItem.children : [filterItem]
      return filterItemOrGroupChilds.every((item) => {
        return selectedItemIds.includes(item[transKeys(fieldNames, 'id')])
      })
    })
    setIsCheckAll(_isCheckAll)
  }, [selectedItems, filterItems])
  // 让搜索框获取焦点
  useEffect(() => {
    searchable && setTimeout(() => searchbar.current && searchbar.current.focus(), 0)
    return () => {
      searchbar.current && searchbar.current.blur()
    }
  }, [])
  // 仅看已选
  const showSelected = useCallback(
    (check) => {
      if (check) {
        const values = selectedItems.map((item) => {
          return item[transKeys(fieldNames, 'id')]
        })
        setFilterItems(
          dropdownItems.filter((item) => {
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
    const _filterItems = dropdownItems
    setFilterItems(_filterItems)
  }, [mode, isOnSearch, dropdownItems, show])

  let matched = 0
  const style = optionWidth && {
    width: optionWidth
  }

  const filterOptions = useCallback(
    (keyword) => {
      setFilterItems(dropdownItems)
      setSearchbarValue(keyword)
    },
    [dropdownItems]
  )
  const searchEvent = useCallback(
    (e) => {
      const filterText = e.target.value
      filterOptions(filterText)
      onSearch(filterText)
    },
    [onSearch]
  )

  const cleanSearchbarValue = useCallback(
    (e) => {
      e.stopPropagation()
      const filterText = ''
      filterOptions(filterText)
      onSearch(filterText)
    },
    [onSearch]
  )
  // 是否被选中
  const itemSelected = useCallback(
    (item) => {
      return (
        selectedItems.map((item) => item[transKeys(fieldNames, 'id')]).indexOf(item[transKeys(fieldNames, 'id')]) > -1
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
    (text = '', uniqueKey) => {
      let _keyword = searchbarValue
      _keyword = searchbarValue.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
      _keyword = searchbarValue.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
      _keyword = searchbarValue.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword

      const parts = text.split(new RegExp(`(${_keyword})`, 'gi'))
      return searchbarValue.length > 0 ? (
        <p key={uniqueKey}>
          {parts.map((part, i) =>
            part === searchbarValue ? (
              <span key={i} className={'hi-select__dropdown--item__name-hightlight'}>
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
            className="hi-select__dropdown--item__checkbox"
            checked={isSelected}
            disabled={item[transKeys(fieldNames, 'disabled')]}
          >
            <div className="hi-select__dropdown--item__name" style={style}>
              {isOnSearch
                ? item[transKeys(fieldNames, 'title')]
                : hightlightKeyword(item[transKeys(fieldNames, 'title')], item[transKeys(fieldNames, 'id')])}
            </div>
          </Checkbox>
        )}
        {mode === 'single' && (
          <div className="hi-select__dropdown--item__name" style={style}>
            {isOnSearch
              ? item[transKeys(fieldNames, 'title')]
              : hightlightKeyword(item[transKeys(fieldNames, 'title')], item[transKeys(fieldNames, 'id')])}
          </div>
        )}
      </React.Fragment>
    )
  }
  const groupItem = (filterGroupItem, filterItemsIndex) => {
    const renderGroup = []
    const label = (
      <li
        className="hi-select__dropdown--label hi-select__dropdown--item"
        key={filterGroupItem[transKeys(fieldNames, 'id')] || filterGroupItem[transKeys(fieldNames, 'groupId')]}
      >
        {filterGroupItem[transKeys(fieldNames, 'title')] || filterGroupItem[transKeys(fieldNames, 'groupTitle')]}
      </li>
    )
    renderGroup.push(label)
    filterGroupItem[transKeys(fieldNames, 'children')].forEach((item, index) => {
      matchFilter(item) && renderGroup.push(normalItem(item, filterItemsIndex + '-' + index, true))
    })
    return renderGroup
  }
  const normalItem = (item, filterItemsIndex, isChildItem) => {
    matched++
    const _filterItemsIndex = filterItemsIndex
    const isSelected = itemSelected(item)
    const isDisabled = item[transKeys(fieldNames, 'disabled')]
    return (
      <li
        className={classNames('hi-select__dropdown--item', `theme__${theme}`, {
          'is-active': isSelected,
          'is-disabled': isDisabled,
          'hi-select__dropdown--item--child': isChildItem,
          'is-focus': filterItemsIndex === focusedIndex,
          'hi-select__dropdown--item-default': !item[transKeys(fieldNames, 'children')] && !dropdownRender
        })}
        onClick={(e) => onClickOptionIntal(e, item, _filterItemsIndex)}
        key={item[transKeys(fieldNames, 'id')]}
        index={filterItemsIndex}
        onMouseEnter={() => {
          setFocusedIndex(_filterItemsIndex)
        }}
      >
        {renderOption(isSelected, item, filterItemsIndex)}
      </li>
    )
  }
  const renderItems = () => {
    return (
      <ul className="hi-select__dropdown--items" ref={dropdownWrapper}>
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
            className="hi-select__dropdown--item hi-select__dropdown-item--empty is-disabled"
            onClick={(e) => e.stopPropagation()}
          >
            {emptyContent}
          </li>
        )}
      </ul>
    )
  }
  return (
    <div className="hi-select__dropdown" style={style}>
      {searchable && (
        <div className="hi-select__dropdown__searchbar">
          <div className="hi-select__dropdown__searchbar--content">
            <span style={{ cursor: 'pointer' }}>
              <Icon name="search" />
            </span>
            <input
              className="hi-select__dropdown__searchbar--input"
              placeholder={searchPlaceholder}
              clearable="true"
              ref={searchbar}
              value={searchbarValue}
              onFocus={onFocus}
              clearabletrigger="always"
              onChange={searchEvent}
            />
            {searchbarValue.length > 0 ? (
              <span style={{ cursor: 'pointer' }} onClick={cleanSearchbarValue}>
                <i className={`hi-icon icon-close-circle hi-select__dropdown--icon__close`} />
              </span>
            ) : null}
          </div>
        </div>
      )}
      {loading && (
        <div className="hi-select__dropdown--loading">
          <Loading size="small" />
        </div>
      )}

      {!loading && renderItems()}

      {mode === 'multiple' && (showCheckAll || showJustSelected) && (
        <div className={`hi-select__dropdown-check-all theme__${theme}`}>
          <div>
            {showCheckAll && (
              <Checkbox
                checked={isCheckAll}
                onChange={(e) => {
                  checkAll(e, filterItems, e.target.checked)
                }}
              >
                {localeMap.checkAll}
              </Checkbox>
            )}
          </div>
          <div>
            {showJustSelected && (
              <Checkbox
                onChange={(e) => {
                  showSelected(e.target.checked)
                }}
              >
                {localeMap.justSelected}
              </Checkbox>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectDropdown
