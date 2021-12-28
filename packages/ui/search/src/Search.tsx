import React, { forwardRef, useState, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Input } from '@hi-ui/input'
import { SearchOutlined } from '@hi-ui/icons'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { Button } from '@hi-ui/button'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { SearchDropdown } from './SearchDropdown'

const SEARCH_PREFIX = getPrefixCls('search')

/**
 * TODO: What is Search
 */
export const Search = forwardRef<HTMLInputElement | null, SearchProps>(
  (
    {
      prefixCls = SEARCH_PREFIX,
      className,
      onChange,
      onBlur,
      append,
      onSearch,
      disabled,
      overlayClassName,
      data,
      defaultValue = '',
      value: valueProp,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [focusIndex, setFocusIndex] = useState<number | null>(null)
    const [subFocusIndex, setSubFocusIndex] = useState<number | null>(null)
    const [value, tryChangeValue] = useUncontrolledState<string | number>(
      defaultValue,
      valueProp,
      onChange
    )
    const _onSearch = useCallback<() => void>(() => {
      if (onSearch) {
        onSearch(value)
      }
    }, [onSearch, value])

    const closeDropdown = useCallback(() => {
      setVisible(false)
      setFocusIndex(null)
      setSubFocusIndex(null)
    }, [])

    const moveFocus = useCallback(
      (direction, data) => {
        let newFocusIndex = null
        let newSubFocusIndex = null

        if (direction === 'up') {
          if (focusIndex === null) {
            newFocusIndex = data.length - 1
            if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
              newSubFocusIndex = data[newFocusIndex].children.length - 1
            }
          } else {
            if (!(data[focusIndex].children && data[focusIndex].children.length > 0)) {
              newFocusIndex = focusIndex === 0 ? data.length - 1 : focusIndex - 1

              if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                newSubFocusIndex = data[newFocusIndex].children.length - 1
              }
            } else {
              if (subFocusIndex === 0) {
                newFocusIndex = focusIndex === 0 ? data.length - 1 : focusIndex - 1
                if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                  newSubFocusIndex = data[newFocusIndex].children.length - 1
                }
              } else {
                newFocusIndex = focusIndex
                newSubFocusIndex = subFocusIndex !== null ? subFocusIndex - 1 : 0
              }
            }
          }
        } else {
          // 不存在 focusIndex
          if (focusIndex === null) {
            newFocusIndex = 0
            if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
              newSubFocusIndex = 0
            }
          } else {
            // 存在 focusIndex
            // 当前focus 项没有子项
            if (!(data[focusIndex].children && data[focusIndex].children.length > 0)) {
              newFocusIndex = focusIndex === data.length - 1 ? 0 : focusIndex + 1
              if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                newSubFocusIndex = 0
              }
            } else {
              // 当前focus 有子项
              if (subFocusIndex === data[focusIndex].children.length - 1) {
                newFocusIndex = focusIndex === data.length - 1 ? 0 : focusIndex + 1
                if (data[newFocusIndex].children && data[newFocusIndex].children.length > 0) {
                  newSubFocusIndex = 0
                }
              } else {
                newFocusIndex = focusIndex
                newSubFocusIndex = subFocusIndex !== null ? subFocusIndex + 1 : 0
              }
            }
          }
        }
        setFocusIndex(newFocusIndex)
        setSubFocusIndex(newSubFocusIndex)
      },
      [focusIndex, subFocusIndex]
    )

    const onKeyDown = useCallback(
      (e) => {
        // ESC
        if (e.keyCode === 27) {
          e.preventDefault()
          closeDropdown()
        }
        // TAB
        if (e.keyCode === 9) {
          closeDropdown()
        }
        // UP
        if (e.keyCode === 38) {
          e.preventDefault()
          moveFocus('up', data)
        }
        // DOWN
        if (e.keyCode === 40) {
          e.preventDefault()
          moveFocus('down', data)
        }
        // ENTER
        if (e.keyCode === 13) {
          e.preventDefault()
          let _inputValue = '' as React.ReactText
          if (focusIndex !== null && data) {
            if (subFocusIndex !== null) {
              _inputValue = (data[focusIndex].children as SearchDataItem[])[subFocusIndex].title
            } else {
              _inputValue = data[focusIndex].title
            }
          } else {
            _inputValue = value
          }
          if (onSearch) {
            onSearch(_inputValue)
          }
          tryChangeValue(_inputValue)
          closeDropdown()
        }
      },
      [closeDropdown, moveFocus, onSearch, value, focusIndex, subFocusIndex, data, tryChangeValue]
    )

    return (
      <div className={cls} ref={ref}>
        <Input
          className={`${prefixCls}__input`}
          ref={setTargetElRef}
          disabled={disabled}
          onChange={(e) => {
            tryChangeValue(e.target.value)
            if (data && data.length > 0) {
              setVisible(true)
            }
          }}
          // @ts-ignore
          onKeyDown={onKeyDown}
          value={String(value)}
          onBlur={(e) => {
            onBlur && onBlur(e)
          }}
          onFocus={() => {
            if (data && data.length > 0) {
              setVisible(true)
            }
          }}
          clearable
          append={
            append !== undefined ? (
              append
            ) : (
              <Button disabled={disabled} onClick={_onSearch} icon={<SearchOutlined />} />
            )
          }
        />
        {data && data.length > 0 && (
          <SearchDropdown
            data={data}
            overlayClassName={overlayClassName}
            focusIndex={focusIndex}
            inputRef={targetElRef}
            onClose={closeDropdown}
            subFocusIndex={subFocusIndex}
            prefixCls={prefixCls}
            visible={visible}
            keyword={value}
            onSelect={(item) => {
              if (onSearch) {
                onSearch(item.title)
              }
              tryChangeValue(item.title)
              targetElRef?.focus()
              closeDropdown()
            }}
          />
        )}
      </div>
    )
  }
)
export interface SearchDataItem {
  id: string | number
  title: string | number
  children?: SearchDataItem[]
}
export interface SearchProps extends HiBaseHTMLProps<'input'> {
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  append?: React.ReactNode
  overlayClassName?: string
  data?: SearchDataItem[]
  defaultValue?: string
  value?: string
  onChange: (inputVal: string | number) => void
  onSearch: (inputVal: string | number) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
}

export interface SearchDropdownProps {
  overlayClassName?: string
  data: SearchDataItem[]
  focusIndex: number | null
  subFocusIndex: number | null
  visible: boolean
  inputRef: HTMLElement | null
  onClose: () => void
  prefixCls: string
  onSelect: (item: SearchDataItem) => void
  keyword: string | number
}

if (__DEV__) {
  Search.displayName = 'Search'
}
