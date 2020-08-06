import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import Popper from '../popper'
import Loading from '../loading'

const SearchDropdown = props => {
  const {
    data,
    prefixCls,
    optionsClick,
    inputVal = '',
    dropdownShow,
    searchInputContainer,
    localeDatas,
    onClickOutside,
    loading
  } = props
  const popperDropdown = useRef(null)
  const [dropdownData, setDropdownData] = useState(data)

  useEffect(() => {
    setDropdownData(data)
  }, [data])

  const highlightKeyword = (title, uniqueKey) => {
    const searchbarValue = String(inputVal)
    let keyword = inputVal
    keyword = searchbarValue.includes('[')
      ? keyword.replace(/\[/gi, '\\[')
      : keyword
    keyword = searchbarValue.includes('(')
      ? keyword.replace(/\(/gi, '\\(')
      : keyword
    keyword = searchbarValue.includes(')')
      ? keyword.replace(/\)/gi, '\\)')
      : keyword

    const parts = title.split(new RegExp(`(${keyword})`, 'gi'))
    return inputVal && inputVal.length > 0 ? (
      <p key={uniqueKey} className='hi-search_dropdown--item__highlight'>
        {parts.map(part =>
          part === searchbarValue ? (
            <span
              key={uniqueKey}
              className='hi-search_dropdown--item__name-hightlight'
            >
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
  }
  const ItemChildren = item => {
    return (
      <ul>
        {item.children &&
          item.children.map(ele => {
            return (
              <li
                className={`${prefixCls}_dropdown--item`}
                style={{ padding: 0 }}
                key={ele.id}
              >
                <span
                  className={`${prefixCls}_dropdown--item_normal`}
                  onClick={() => {
                    optionsClick(
                      typeof ele.title === 'string' ? ele.title : ele.id,
                      ele
                    )
                  }}
                >
                  {typeof ele.title === 'string'
                    ? highlightKeyword(ele.title, ele.id)
                    : ele.title}
                </span>
              </li>
            )
          })}
      </ul>
    )
  }

  const DataSourceRender = item => {
    const className = classNames(`${prefixCls}_dropdown--item_normal`, {
      [`${prefixCls}_dropdown--item-title`]: item.children
    })
    return (
      <li className={`${prefixCls}_dropdown--item`} key={item.id}>
        <span
          className={className}
          onClick={() => {
            optionsClick(
              typeof item.title === 'string' ? item.title : item.id,
              item
            )
          }}
        >
          {typeof item.title === 'string'
            ? highlightKeyword(item.title, item.id)
            : item.title}
        </span>
        {item.children && ItemChildren(item)}
      </li>
    )
  }

  const { searchEmptyResult } = localeDatas.search
  return (
    <Popper
      show={dropdownShow}
      attachEle={searchInputContainer.current}
      onClickOutside={onClickOutside}
      zIndex={1050}
      topGap={5}
      leftGap={0}
      className={`${prefixCls}__popper`}
      placement='top-bottom-start'
    >
      <Loading visible={loading}>
        <div className={`${prefixCls}_dropdown`} ref={popperDropdown}>
          <ul className={`${prefixCls}_dropdown--items`}>
            {dropdownData && dropdownData.length > 0 ? (
              dropdownData.map(item => {
                return DataSourceRender(item)
              })
            ) : (
              <li className={`${prefixCls}_dropdown--item-nodata`}>
                {searchEmptyResult}
              </li>
            )}
          </ul>
        </div>
      </Loading>
    </Popper>
  )
}

export default SearchDropdown
