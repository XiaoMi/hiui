import React, { forwardRef, useState, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Input } from '@hi-ui/input'
import { Popper } from '@hi-ui/popper'
import { SearchOutlined } from '@hi-ui/icons'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

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
      onSelect,
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

    return (
      <div className={cls} ref={ref}>
        <Input
          ref={setTargetElRef}
          disabled={disabled}
          onChange={(e) => {
            tryChangeValue(e.target.value)
          }}
          value={String(value)}
          onBlur={onBlur}
          onFocus={() => {
            setVisible(true)
          }}
          clearable
          append={
            append !== undefined ? (
              append
            ) : (
              <SearchOutlined style={{ cursor: 'pointer' }} onClick={_onSearch} />
            )
          }
        />
        {data && (
          <Popper
            className={overlayClassName}
            attachEl={targetElRef}
            visible={visible}
            onClose={() => {
              setVisible(false)
            }}
          >
            <div className={`${prefixCls}__dropdown`}>
              {data?.map((d) => (
                <div
                  className={`${prefixCls}__dropdown-item`}
                  key={d.id}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(d.id, d)
                    }
                    setVisible(false)
                    tryChangeValue(d.id)
                  }}
                >
                  {d.title}
                </div>
              ))}
            </div>
          </Popper>
        )}
      </div>
    )
  }
)
export interface SearchDataItem {
  id: string | number
  title: React.ReactNode
  children: { id: string | number; title: React.ReactNode }[]
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
  onSelect: (inputVal: string | number, item: SearchDataItem) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
}

if (__DEV__) {
  Search.displayName = 'Search'
}
