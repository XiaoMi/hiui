import React, { useRef, useCallback } from 'react'
import classNames from 'classnames'
import Popper from '../popper'
import Loading from '../loading'

const SearchDropdown = ({
  data,
  prefixCls,
  optionsClick,
  inputVal = '',
  dropdownShow,
  searchInputContainer,
  localeDatas,
  theme,
  onClickOutside,
  loading,
  overlayClassName,
  focusIndex,
  subFocusIndex
}) => {
  const popperDropdown = useRef(null)

  const highlightKeyword = useCallback(
    (title, uniqueKey) => {
      const searchbarValue = String(inputVal)
      let keyword = inputVal
      keyword = searchbarValue.includes('[') ? keyword.replace(/\[/gi, '\\[') : keyword
      keyword = searchbarValue.includes('(') ? keyword.replace(/\(/gi, '\\(') : keyword
      keyword = searchbarValue.includes(')') ? keyword.replace(/\)/gi, '\\)') : keyword

      const parts = title.split(new RegExp(`(${keyword})`, 'gi'))
      return inputVal && inputVal.length > 0 ? (
        <p key={uniqueKey} className="hi-search_dropdown--item__highlight">
          {parts.map((part) =>
            part === searchbarValue ? (
              <span key={uniqueKey} className="hi-search_dropdown--item__name-hightlight">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </p>
      ) : (
        title
      )
    },
    [inputVal]
  )
  const ItemChildren = useCallback(
    (item, isParentFocus) => {
      return (
        <ul>
          {item.children &&
            item.children.map((ele, idx) => {
              return (
                <li className={`${prefixCls}_dropdown--item`} style={{ padding: 0 }} key={ele.id}>
                  <span
                    className={classNames(`${prefixCls}_dropdown--item_normal`, {
                      [`${prefixCls}_dropdown--item--focus`]: isParentFocus && subFocusIndex === idx
                    })}
                    onClick={() => {
                      optionsClick(typeof ele.title === 'string' ? ele.title : ele.id, ele)
                    }}
                  >
                    {typeof ele.title === 'string' ? highlightKeyword(ele.title, ele.id) : ele.title}
                  </span>
                </li>
              )
            })}
        </ul>
      )
    },
    [highlightKeyword, focusIndex, subFocusIndex]
  )

  const DataSourceRender = useCallback(
    (item, idx) => {
      const className = classNames(`${prefixCls}_dropdown--item_normal`, {
        [`${prefixCls}_dropdown--item-title`]: item.children,
        [`${prefixCls}_dropdown--item--focus`]: focusIndex === idx && !item.children
      })
      return (
        <li className={`${prefixCls}_dropdown--item`} key={item.id}>
          <span
            className={className}
            onClick={() => {
              optionsClick(typeof item.title === 'string' ? item.title : item.id, item)
            }}
          >
            {typeof item.title === 'string' ? highlightKeyword(item.title, item.id) : item.title}
          </span>
          {item.children && ItemChildren(item, focusIndex === idx)}
        </li>
      )
    },
    [highlightKeyword, ItemChildren]
  )

  const { searchEmptyResult } = localeDatas.search
  return (
    <Popper
      show={dropdownShow}
      attachEle={searchInputContainer.current}
      onClickOutside={onClickOutside}
      overlayClassName={overlayClassName}
      zIndex={1050}
      topGap={5}
      leftGap={0}
      className={`${prefixCls}__popper`}
      placement="top-bottom-start"
    >
      <Loading visible={loading}>
        <div className={`${prefixCls}_dropdown theme__${theme}`} ref={popperDropdown}>
          <ul className={`${prefixCls}_dropdown--items`}>
            {data && data.length > 0 ? (
              data.map((item, idx) => {
                return DataSourceRender(item, idx)
              })
            ) : (
              <li className={`${prefixCls}_dropdown--item-nodata`}>{searchEmptyResult}</li>
            )}
          </ul>
        </div>
      </Loading>
    </Popper>
  )
}

export default SearchDropdown
