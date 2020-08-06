import React, { useRef } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import Popper from '../popper'
import Loading from '../loading'

const SearchDropdown = props => {
  const {
    data,
    prefixCls,
    optionsClick,
    historyData,
    inputVal = '',
    onDelete,
    dropdownShow,
    searchInputContainer,
    localeDatas,
    onClickOutside,
    loading
  } = props
  const popperDropdown = useRef(null)
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

  const HistoryRender = () => {
    const { searchRecord, searchEmptyRecord } = localeDatas.search
    const HistoryTitle =
      inputVal.length === 0 && historyData && historyData.length > 0 ? (
        <li
          className={`${prefixCls}_dropdown--item ${prefixCls}_dropdown--item-history`}
        >
          <span>{searchRecord}</span>
          <span
            onClick={() => {
              onDelete && onDelete()
            }}
          >
            <Icon name='delete' />
          </span>
        </li>
      ) : null
    const HistoryNoData = (
      <li className={`${prefixCls}_dropdown--item-nodata`}>
        {searchEmptyRecord}
      </li>
    )
    const showHistoryNode =
      inputVal.length === 0 && historyData && historyData.length === 0
    return showHistoryNode ? HistoryNoData : HistoryTitle
  }

  const dataRender = inputVal.length ? data : historyData
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
            {HistoryRender()}
            {dataRender &&
              dataRender.map(item => {
                return DataSourceRender(item)
              })}
            {(!data || data.length === 0) && (
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
