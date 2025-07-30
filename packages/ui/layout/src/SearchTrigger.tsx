import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { SearchOutlined } from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import { MenuDataItem, MenuSearch, MenuSearchHelper } from '@hi-ui/menu'

const SEARCH_TRIGGER_PREFIX = getPrefixCls('search-trigger')

/**
 * 搜索触发器组件
 */
export const SearchTrigger = forwardRef<HTMLDivElement | null, SearchTriggerProps>(
  (
    {
      prefixCls = SEARCH_TRIGGER_PREFIX,
      role = 'search-trigger',
      className,
      mini,
      placeholder = '搜索',
      data,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false)
    const [value, setValue] = React.useState('')
    const innerRef = React.useRef<HTMLDivElement>(null)
    const searchRef = React.useRef<MenuSearchHelper>(null)

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--mini`]: mini,
    })

    return (
      <>
        <div
          ref={innerRef}
          role={role}
          className={cls}
          {...rest}
          onClick={() => setVisible(!visible)}
        >
          <SearchOutlined />
          {!mini && <span className={`${prefixCls}__placeholder`}>{placeholder}</span>}
        </div>
        <Popper
          visible={visible}
          attachEl={innerRef.current}
          gutterGap={-32}
          unmountOnClose={false}
          onOutsideClick={() => {
            setVisible(false)
          }}
          onEntered={() => {
            if (visible) {
              searchRef.current?.focus()

              if (value) {
                searchRef.current?.show()
              }
            }
          }}
        >
          <MenuSearch
            innerRef={searchRef}
            width={360}
            value={value}
            onChange={setValue}
            data={data}
            placeholder="搜索"
            onSelect={(id: string, item: MenuDataItem) => {
              console.log('select', id, item)
              setVisible(false)
            }}
            onClear={() => {
              setValue('')
            }}
            onClose={() => {
              setVisible(false)
            }}
            onEsc={() => {
              setVisible(false)
            }}
          />
        </Popper>
      </>
    )
  }
)

export interface SearchTriggerProps extends HiBaseHTMLProps<'div'> {
  mini?: boolean
  placeholder?: string
  data?: MenuDataItem[]
}

if (__DEV__) {
  SearchTrigger.displayName = 'SearchTrigger'
}
