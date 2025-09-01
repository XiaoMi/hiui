import React, { forwardRef } from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import { checkCanLoadChildren, getItemEventData } from './utils'
import { useCascaderContext } from './context'
import { CascaderDataItem, FlattedCascaderDataItem, CascaderItemEventData } from './types'
import { getTopDownAncestors } from '@hi-ui/tree-utils'
import { isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'
import VirtualList from '@hi-ui/virtual-list'

const menuListPrefix = getPrefixCls('cascader-menu-list')

export const CascaderMenuList = forwardRef<HTMLDivElement | null, CascaderMenuListProps>(
  ({ prefixCls = menuListPrefix, className, ...rest }, ref) => {
    const { flatted, menuList, dropdownColumnRender } = useCascaderContext()

    const cls = cx(prefixCls, className, flatted && `${prefixCls}--flatted`)

    return (
      <div ref={ref} className={cls} {...rest}>
        {menuList.map((menu, menuIndex) => {
          return isArrayNonEmpty(menu) ? (
            isFunction(dropdownColumnRender) ? (
              dropdownColumnRender(<CascaderMenu key={menuIndex} data={menu} />, menuIndex)
            ) : (
              <CascaderMenu key={menuIndex} data={menu} />
            )
          ) : null
        })}
      </div>
    )
  }
)

export interface CascaderMenuListProps extends HiBaseHTMLProps {}

if (__DEV__) {
  CascaderMenuList.displayName = 'CascaderMenuList'
}

const menuPrefix = getPrefixCls('cascader-menu')

export const CascaderMenu = ({
  prefixCls = menuPrefix,
  role = 'menu',
  className,
  style,
  data: menu,
}: CascaderMenuProps) => {
  const { virtual } = useCascaderContext()

  const cls = cx(prefixCls, className)

  const virtualListProps = {
    virtual,
    data: menu,
    height: 260,
    itemHeight: 32,
  }

  return (
    <ul className={cls} style={style} role={role}>
      {isArrayNonEmpty(menu) ? (
        virtual ? (
          <VirtualList itemKey={'id'} fullHeight={false} {...virtualListProps}>
            {(option: any) => {
              return <MenuItem key={option.id} option={option} prefixCls={prefixCls} />
            }}
          </VirtualList>
        ) : (
          menu.map((option) => {
            return <MenuItem key={option.id} option={option} prefixCls={prefixCls} />
          })
        )
      ) : null}
    </ul>
  )
}

const MenuItem = forwardRef<
  HTMLLIElement,
  {
    option: FlattedCascaderDataItem
    prefixCls: string
  }
>(({ option, prefixCls }, ref) => {
  const {
    flatted,
    disabled: disabledContext,
    expandTrigger,
    onItemClick,
    onItemClickProp,
    onItemHover,
    titleRender,
    onLoadChildren,
    getItemRequiredProps,
  } = useCascaderContext()

  const eventOption = getItemEventData(option, getItemRequiredProps(option))

  const { selected, loading, active } = eventOption
  const disabled = disabledContext || option.disabled

  const optionCls = cx(
    `${prefixCls}-option`,
    active && `${prefixCls}-option--active`,
    loading && `${prefixCls}-option--loading`,
    disabled && `${prefixCls}-option--disabled`,
    selected && `${prefixCls}-option--selected`
  )

  return (
    <li ref={ref} key={option.id} role="menu-item" className={`${prefixCls}-item`}>
      <div
        className={optionCls}
        onClick={(evt) => {
          if (disabled) return
          onItemClick(eventOption)
          onItemClickProp?.(evt, eventOption)
        }}
        onMouseEnter={() => {
          if (disabled) return
          if (expandTrigger === 'hover') {
            onItemHover(eventOption)
          }
        }}
      >
        {flatted ? (
          renderFlattedTitle(eventOption, titleRender)
        ) : (
          <>
            {renderDefaultTitle(eventOption, titleRender)}
            {renderSuffix(prefixCls, option, loading, onLoadChildren)}
          </>
        )}
      </div>
    </li>
  )
})

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}

export interface CascaderMenuProps extends HiBaseHTMLProps {
  /**
   * 设置选择项数据源
   */
  data: FlattedCascaderDataItem[]
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  item: FlattedCascaderDataItem,
  loading: boolean,
  onLoadChildren?: (
    item: CascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CascaderDataItem[] | void> | void
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const canLoadChildren = checkCanLoadChildren(item, onLoadChildren)

  if (canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--arrow`)}>
        {defaultSuffixIcon}
      </span>
    )
  }

  return (
    <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--noop`)}>
      {defaultLeafIcon}
    </span>
  )
}

const renderFlattedTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option) : true
  if (title !== true) return title

  return (
    <span className="title__text title__text--cols">
      {getTopDownAncestors(option).map((item) => (
        <span key={item.id} className="title__text--col">
          {item.title}
        </span>
      ))}
    </span>
  )
}

const renderDefaultTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option) : true
  if (title !== true) return title

  return <span className="title__text">{option.title}</span>
}
