import React, { useRef, useState, useCallback, useEffect } from 'react'

import classNames from 'classnames'
import _ from 'lodash'
import Popper from '../popper'

import Menu from './Menu'
import Provider from '../context'

const noop = () => {}

const Cascader = (props) => {
  const {
    className,
    disabled = false,
    searchable = false,
    clearable = true,
    style,
    theme,
    value,
    defaultValue,
    displayRender,
    fieldNames = {},
    filterOption,
    changeOnSelect = false,
    localeDatas,
    onChange = noop,
    onActiveItemChange = noop,
    bordered = true
  } = props
  const getLabelKey = useCallback(() => {
    return fieldNames.label || 'content'
  }, [])

  const getValueKey = useCallback(() => {
    return fieldNames.value || 'id'
  }, [])

  const getChildrenKey = useCallback(() => {
    return fieldNames.children || 'children'
  }, [])
  const parseData = useCallback(
    (data) => {
      const _data = _.cloneDeep(data)
      const setDataItemPath = (data = [], parent) => {
        data.forEach((item, index) => {
          item._path = parent ? parent._path + '-' + index : index
          if (item[getChildrenKey()]) {
            setDataItemPath(item[getChildrenKey()], item)
          }
        })
      }
      setDataItemPath(_data)
      return _data
    },
    [props.data, props.options]
  )
  const data = parseData(props.data || props.options) // 兼容1.x API 2.x 改为data
  const emptyContent = props.emptyContent || props.noFoundTip // 兼容1.x API 2.x改为 emptyContent
  const expandTrigger = props.expandTrigger || props.trigger || 'click' // 兼容2.x API 1.x改为 expandTrigger
  const getCascaderLabel = useCallback(
    (values, dataList) => {
      if (displayRender) {
        return displayRender(values)
      }

      if (!values || values.length === 0) {
        return ''
      } else {
        const labels = []
        let index = 0
        let _options = dataList || data
        const labelKey = getLabelKey()
        const valueKey = getValueKey()
        const childrenKey = getChildrenKey()

        while (_options && _options.length > 0 && labels.length <= values.length) {
          const value = values[index]
          index++
          _options.every((option) => {
            if (option[valueKey] === value) {
              labels.push(option[labelKey])
              _options = option[childrenKey]
              return false
            } else {
              _options = []
              return true
            }
          })
        }
        return labels.join(' / ')
      }
    },
    [data]
  )
  const [filterOptions, setFilterOptions] = useState(false)
  // 缓存原始value，用户可能点击option但是没选中，用于恢复初始value
  const [cacheValue, setCacheValue] = useState(value || defaultValue || [])
  const [cascaderValue, setCascaderValue] = useState(value || defaultValue || [])
  const [cascaderLabel, setCascaderLabel] = useState(getCascaderLabel(value || defaultValue || []))
  const [focusOptionIndex, setFocusOptionIndex] = useState(-1)
  const targetByKeyDown = useRef(false)
  const currentDeep = useRef(0)
  const [popperShow, setPopperShow] = useState(false)
  const [keyword, setKeyword] = useState('')

  const hiCascader = useRef()
  const inputContainer = useRef()
  const inputRef = useRef()

  // 每次值被改变重置缓存值、重置label 展示
  useEffect(() => {
    if (value !== undefined) {
      setCacheValue(value)
    }
  }, [value])
  useEffect(() => {
    setFocusOptionIndex(-1)
    currentDeep.current = 0
  }, [popperShow])

  useEffect(() => {
    setCascaderLabel(getCascaderLabel(cacheValue))
    setCascaderValue(cacheValue)
  }, [cacheValue])

  const extraClass = {
    'hi-cascader--disabled': disabled,
    'hi-cascader--focused': popperShow,
    'hi-cascader--clearable': clearable
  }

  const onChangeValue = useCallback(
    (values, hasChildren) => {
      setFilterOptions(false)
      setKeyword('')
      setCascaderValue(values)
      if (expandTrigger === 'click') {
        if (changeOnSelect || !hasChildren) {
          if (value === undefined) {
            setCacheValue(values)
          }
          onChange(values)
        }
        if (hasChildren) {
          onActiveItemChange(values)
        } else {
          setPopperShow(false)
        }
      } else {
        // hover
        if (changeOnSelect || !hasChildren) {
          if (value === undefined) {
            setCacheValue(values)
          }
          onChange(values)
          setPopperShow(false)
        }
      }
    },
    [changeOnSelect, expandTrigger, onChange, cascaderValue, popperShow]
  )

  const clearValue = useCallback(
    (e) => {
      e.stopPropagation()
      onChangeValue([], false)
    },
    [onChangeValue]
  )

  const onHover = useCallback((value, hasChildren) => {
    setFilterOptions(false)
    setKeyword('')
    setCascaderValue(value)
    if (hasChildren) {
      onActiveItemChange(value)
    }
  }, [])

  const onKeywordChange = useCallback(() => {
    if (!keyword) {
      setFilterOptions(false)
      setPopperShow(false)
      return
    }
    let filterOptions = []
    const initMatchOptions = { options: [], matchCount: 0 }
    const labelKey = getLabelKey()
    const valueKey = getValueKey()
    const childrenKey = getChildrenKey()
    const _checkOptions = (options, match) => {
      options.map((option) => {
        const label = option[labelKey]
        const value = option[valueKey]
        const children = option[childrenKey]
        if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
          match.matchCount++
        }

        match.options.push({
          [labelKey]: label,
          [valueKey]: value,
          disabled: option.disabled
        })

        if (children && children.length > 0) {
          _checkOptions(children, match)
        } else {
          if (match.matchCount > 0) {
            filterOptions.push(match.options.slice())
          }
        }
        if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
          match.matchCount--
        }

        match.options.pop()
      })
    }

    _checkOptions(data, initMatchOptions)

    const ids = getSearchId(filterOptions, keyword)

    setCascaderValue(ids)
    filterOptions = formatFilterOptions(data, keyword)
    setPopperShow(true)
  }, [keyword, data])
  // 获取默认选中的最近的id
  const getSearchId = useCallback((filterOptions, keyword) => {
    const filterFunc = filterOption
    const levelItems = []
    const levelItemsObj = {}

    const labelKey = getLabelKey()
    const valueKey = getValueKey()
    if (filterOptions.length === 0) {
      return []
    } else {
      filterOptions.map((options) => {
        const jointOption = {
          jointOption: true,
          [labelKey]: [],
          [valueKey]: []
        }
        options.map((option, index) => {
          const levelItem = {
            [valueKey]: ''
          }

          levelItem[valueKey] = jointOption[valueKey].concat(option[valueKey])

          jointOption[valueKey].push(option[valueKey])
          option.disabled && (jointOption.disabled = option.disabled)
          option.disabled && (levelItem.disabled = option.disabled)

          if (!levelItemsObj[levelItem[valueKey]]) {
            levelItemsObj[levelItem[valueKey]] = levelItem[valueKey]
            if (filterFunc) {
              if (
                filterFunc(keyword, option) &&
                (levelItem[valueKey].toString().includes(keyword) || option[labelKey].toString().includes(keyword))
              ) {
                levelItems.push(levelItem)
              }
            } else {
              if (option[labelKey].toString().includes(keyword)) {
                levelItems.push(levelItem)
              }
            }
          }
        })
      })
    }
    if (levelItems.length === 0) {
      return []
    }

    const ids = levelItems.map((item) => item.id)
    let targetId = ids[0].join(',')
    for (let i = 1; i < ids.length; i++) {
      if (ids[i].join(',').includes(targetId)) {
        targetId = ids[i].join(',')
      }
    }

    return targetId.split(',').map((item) => Number(item))
  }, [])

  // 配置化
  const localeDatasProps = useCallback((key) => {
    return props[key] ? props[key] : localeDatas.cascader[key]
  }, [])

  const formatFilterOptions = useCallback((data, keyword) => {
    const labelKey = getLabelKey()
    const valueKey = getValueKey()
    const childrenKey = getChildrenKey()

    if (data.length === 0) {
      return []
    } else {
      const _changeOptions = (options) => {
        return options.map((option) => {
          const label = option[labelKey]
          const value = option[valueKey]
          const children = option[childrenKey]

          if (label.toString().includes(keyword) || value.toString().includes(keyword)) {
            const hightlight = []
            hightlight.push(hightlightKeyword(label, keyword))
            option.hightlight = hightlight
          } else {
            option.hightlight = null
          }

          if (children && children.length > 0) {
            _changeOptions(children)
          }

          return option
        })
      }
      setFilterOptions(_changeOptions(data, []))
      return _changeOptions(data)
    }
  })
  const hightlightKeyword = useCallback((text, keyword, uniqueKey) => {
    let _keyword = keyword
    _keyword = keyword.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
    _keyword = keyword.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
    _keyword = keyword.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword

    const parts = text.split(new RegExp(`(${_keyword})`, 'gi'))
    return (
      <span key={uniqueKey}>
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part === keyword
                ? 'hi-cascader-menu__item--label-hightlight'
                : 'hi-cascader-menu__item--label-noHightlight'
            }
          >
            {part}
          </span>
        ))}
      </span>
    )
  }, [])
  const handleClick = useCallback(
    (e) => {
      if (popperShow) {
        return
      }
      if (!disabled) {
        if (!searchable) {
          setKeyword('')
          setFilterOptions(false)
        }

        if (!searchable || (searchable && cascaderValue.length)) {
          setPopperShow(true)
        }
        if (searchable && keyword) {
          onKeywordChange()
        } else {
          setCascaderValue(cacheValue || [])
        }

        inputRef.current.focus()
      }
    },
    [popperShow, cacheValue, cascaderValue, keyword]
  )

  const parseFocusOptionIndex = useCallback(
    (deep = currentDeep.current) => {
      const optionIndexs = focusOptionIndex < 0 ? [focusOptionIndex] : String(focusOptionIndex).split('-')
      return {
        optionIndexs: optionIndexs.slice(0, deep + 1),
        focusOptionIndex: optionIndexs[deep] || -1
      }
    },
    [focusOptionIndex, currentDeep.current]
  )
  // 获取不同深度的数据, 该深度的全部数据而不是单条数据
  const getDeepData = useCallback(
    (deep = currentDeep.current) => {
      const { optionIndexs } = parseFocusOptionIndex(deep)
      let _data = data
      if (optionIndexs.length <= 1) {
        return _data
      }
      _data = optionIndexs.reduce((deepData, current, index) => {
        if (index === 0) return deepData
        const _index = optionIndexs[index - 1]
        return deepData[_index][getChildrenKey()]
      }, data)
      return _data || []
    },
    [parseFocusOptionIndex, data, currentDeep.current]
  )
  // 上下按键
  const moveFocusedIndex = useCallback(
    (direction) => {
      targetByKeyDown.current = true
      const _data = currentDeep.current === 0 ? data : getDeepData()
      const { focusOptionIndex: _focusOptionIndex } = parseFocusOptionIndex()
      const isAllDisabled = _data.every((item) => {
        return item.disabled
      })
      let index = direction === 'down' ? _focusOptionIndex / 1 + 1 : _focusOptionIndex / 1 - 1
      if (index < 0) {
        index = _data.length - 1
      } else if (index >= _data.length) {
        index = 0
      }
      if (!isAllDisabled) {
        while (data[index] && data[index].disabled) {
          index++
        }
        if (currentDeep.current > 0) {
          const _focusOptionIndex = String(focusOptionIndex).split('-')
          _focusOptionIndex[currentDeep.current] = index
          index = _focusOptionIndex.join('-')
        } else {
          index = String(index)
        }
        setFocusOptionIndex(index)
      } else {
        setFocusOptionIndex(-1)
      }
    },
    [targetByKeyDown.current, currentDeep.current, data, getDeepData, parseFocusOptionIndex, focusOptionIndex]
  )
  // 右方向按键
  const rightHandle = useCallback(() => {
    targetByKeyDown.current = true
    currentDeep.current++
    const { optionIndexs } = parseFocusOptionIndex()
    const optionValues = []
    const l = optionIndexs.length
    optionIndexs.map((item, index) => {
      const _data = getDeepData(index)
      optionValues.push(_data[item].id)
    })
    const currentItem = getDeepData(l - 1)[optionIndexs[l - 1]] || {}
    const children = currentItem[getChildrenKey()] || []
    const hasChildren = !!children.length
    onChangeValue(optionValues, hasChildren)
    let index = 0
    while (children[index] && children[index].disabled) {
      index++
    }
    index = hasChildren ? focusOptionIndex + '-' + index : focusOptionIndex
    setFocusOptionIndex(index)
  }, [targetByKeyDown.current, parseFocusOptionIndex, focusOptionIndex, onChangeValue, currentDeep.current])
  // 左方向按键
  const leftHandle = useCallback(() => {
    targetByKeyDown.current = true

    const optionsIndex = focusOptionIndex.split('-')
    if (cascaderValue.length === 0) {
      currentDeep.current = 0
      return
    }
    currentDeep.current--
    setFocusOptionIndex(optionsIndex.splice(0, optionsIndex.length - 1).join('-'))
    onChangeValue(cascaderValue.splice(0, cascaderValue.length - 1), true)
  }, [focusOptionIndex, targetByKeyDown.current, onChangeValue, currentDeep.current, cascaderValue])
  // 按键操作
  const handleKeyDown = useCallback(
    (evt) => {
      // space
      if (evt.keyCode === 32 && !searchable) {
        evt.preventDefault()
        evt.stopPropagation()
        setPopperShow(!popperShow)
      }
      // esc
      if (evt.keyCode === 27) {
        evt.stopPropagation()
        setPopperShow(false)
      }
      if (popperShow) {
        // down
        if (evt.keyCode === 40) {
          evt.stopPropagation()
          evt.preventDefault()
          moveFocusedIndex('down')
        }
        // up
        if (evt.keyCode === 38) {
          evt.preventDefault()
          evt.stopPropagation()
          moveFocusedIndex('up')
        }
        // right
        if (evt.keyCode === 39 || evt.keyCode === 13) {
          evt.preventDefault()
          evt.stopPropagation()
          rightHandle()
        }
        // left
        if (evt.keyCode === 37) {
          evt.preventDefault()
          evt.stopPropagation()
          leftHandle()
        }
      }
    },
    [moveFocusedIndex, rightHandle, leftHandle]
  )

  const expandIcon = popperShow ? 'icon-up' : 'icon-down'
  const placeholder = cascaderLabel || localeDatasProps('placeholder')
  return (
    <div
      className={classNames('hi-cascader', `theme__${theme}`, className, extraClass)}
      style={style}
      ref={hiCascader}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div
        className={classNames('hi-cascader__input-container', { bordered })}
        ref={inputContainer}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          className="hi-cascader__input-keyword"
          value={(searchable && keyword) || (!popperShow && cascaderLabel) || ''}
          readOnly={!searchable}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            if (!e.target.value) {
              clearValue(e)
            }
            setKeyword(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              onKeywordChange()
            }
          }}
        />
        <span className="hi-cascader__icon">
          <i
            className={classNames('hi-cascader__icon--expand', 'hi-icon', expandIcon, {
              'has-value': clearable && ((searchable && keyword !== '') || (!popperShow && cascaderLabel !== ''))
            })}
          />
          {clearable && ((searchable && keyword !== '') || (!popperShow && cascaderLabel !== '')) && (
            <i className="hi-cascader__icon--clear hi-icon icon-close-circle" onClick={clearValue} />
          )}
        </span>
      </div>
      <Popper
        show={popperShow}
        attachEle={inputContainer.current}
        zIndex={1050}
        topGap={5}
        width={'auto'}
        className="hi-cascader__popper"
        placement="top-bottom-start"
        onClickOutside={() => {
          setPopperShow(false)
        }}
      >
        <Menu
          value={cascaderValue}
          options={filterOptions || data}
          theme={theme}
          isFiltered={filterOptions}
          filterOptionWidth={hiCascader.current && hiCascader.current.clientWidth}
          valueKey={getValueKey()}
          labelKey={getLabelKey()}
          childrenKey={getChildrenKey()}
          onSelect={onChangeValue}
          onHover={onHover}
          currentDeep={currentDeep}
          expandTrigger={expandTrigger}
          focusOptionIndex={focusOptionIndex}
          setFocusOptionIndex={setFocusOptionIndex}
          targetByKeyDown={targetByKeyDown}
          emptyContent={emptyContent}
          localeDatasProps={localeDatasProps}
        />
      </Popper>
    </div>
  )
}
export default Provider(Cascader)
export { Cascader }
