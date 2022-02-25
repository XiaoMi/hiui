import React, { useCallback } from 'react'
import Popper from '@hi-ui/popper'
import { SearchDropdownProps } from './Search'
import { cx } from '@hi-ui/classname'

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  overlayClassName,
  inputRef,
  visible,
  onClose,
  data,
  prefixCls,
  focusIndex,
  subFocusIndex,
  onSelect,
  keyword,
}) => {
  const highlightKeyword = useCallback(
    (title: string) => {
      const searchbarValue = String(keyword)
      let _keyword = searchbarValue
      _keyword = searchbarValue.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
      _keyword = searchbarValue.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
      _keyword = searchbarValue.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword

      const parts = title.split(new RegExp(`(${_keyword})`, 'gi'))
      return _keyword && _keyword.length > 0 ? (
        <div>
          {parts.map((part, idx) =>
            part === searchbarValue ? (
              <span key={idx} className={`${prefixCls}__dropdown--highlight`}>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </div>
      ) : (
        title
      )
    },
    [keyword, prefixCls]
  )
  return (
    <Popper
      className={overlayClassName}
      attachEl={inputRef}
      visible={visible}
      autoFocus={false}
      onClose={onClose}
    >
      <div className={`${prefixCls}__dropdown`}>
        {data?.map((d, index) => (
          <>
            <div
              className={cx(`${prefixCls}__dropdown-item`, {
                [`${prefixCls}__dropdown-group`]: d.children,
                [`${prefixCls}__dropdown-item--focus`]: focusIndex === index && !d.children,
              })}
              key={d.id}
              onClick={() => {
                if (!d.children) {
                  onSelect(d)
                }
              }}
            >
              {d?.children ? d.title : highlightKeyword(d.title as string)}
            </div>
            {d?.children?.map((sub, idx) => (
              <div
                className={cx(`${prefixCls}__dropdown-subitem`, {
                  [`${prefixCls}__dropdown-subitem--focus`]:
                    subFocusIndex === idx && focusIndex === index,
                })}
                key={sub.id}
                onClick={() => {
                  onSelect(sub)
                }}
              >
                {highlightKeyword(sub.title as string)}
              </div>
            ))}
          </>
        ))}
      </div>
    </Popper>
  )
}
