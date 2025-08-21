import React, { forwardRef, ReactText } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
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
      placeholder,
      data,
      onClick,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const [visible, setVisible] = React.useState(false)
    const [value, setValue] = React.useState('')
    const innerRef = React.useRef<HTMLDivElement>(null)
    const searchRef = React.useRef<MenuSearchHelper>(null)

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--mini`]: mini,
    })

    const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(evt)

      if (evt.defaultPrevented) {
        return
      }

      setVisible(!visible)
    }

    return (
      <>
        <div ref={innerRef} role={role} className={cls} onClick={handleClick} {...rest}>
          <SearchOutlined />
          {!mini && (
            <span className={`${prefixCls}__placeholder`}>
              {placeholder || i18n.menuSearch.search}
            </span>
          )}
        </div>
        <Popper
          classNames={{
            container: `${prefixCls}__popper-container`,
          }}
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
            placeholder={i18n.menuSearch.placeholder}
            onSelect={(id: ReactText, item: MenuDataItem) => {
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
