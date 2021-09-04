import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import { getCascaderItemEventData, getNodeAncestors } from './utils'
import { useCascaderContext } from './context'
import { FlattedCascaderItem, CascaderItemEventData, CascaderItem } from './types'

const _role = 'cascader-menu'
const _prefix = getPrefixCls(_role)

export const CascaderMenu = ({
  prefixCls = _prefix,
  role = _role,
  className,
  data: menu,
}: CascaderMenuProps) => {
  const {
    flatted,
    disabled: disabledContext,
    expandTrigger,
    onSelect,
    titleRender,
    onLoadChildren,
    getCascaderItemRequiredProps,
  } = useCascaderContext()

  const cls = cx(prefixCls, className)

  return (
    <ul className={cls} role={role}>
      {menu.map((option) => {
        const eventOption = getCascaderItemEventData(option, getCascaderItemRequiredProps(option))

        const { selected, loading } = eventOption
        const disabled = disabledContext || option.disabled

        const optionCls = cx(
          `${prefixCls}-option`,
          loading && `${prefixCls}-option--loading`,
          disabled && `${prefixCls}-option--disabled`,
          selected && `${prefixCls}-option--selected`
        )

        return (
          <li role="menu-item" className={`${prefixCls}-item`} key={option.id}>
            <div
              className={optionCls}
              onClick={() => {
                if (disabled) return
                onSelect(eventOption)
              }}
              onMouseEnter={() => {
                if (disabled || expandTrigger !== 'hover') return
                onSelect(eventOption)
              }}
            >
              {flatted ? (
                renderFlattedTitle(eventOption, titleRender)
              ) : (
                <>
                  {renderTitle(eventOption, titleRender)}
                  {renderSuffix(prefixCls, option, loading, onLoadChildren)}
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export interface CascaderMenuProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 设置选择项数据源
   */
  data: FlattedCascaderItem[]
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  item: FlattedCascaderItem,
  loading: boolean,
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const hasChildren = item.children && item.children.length > 0
  const canLoadChildren = hasChildren || (onLoadChildren && !item.children && !item.isLeaf)

  if (canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}-switcher`)} style={{ transform: `rotate(-90deg)` }}>
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

const renderTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, false) : true
  if (title !== true) return title

  return <span className="title__text">{option.title}</span>
}

const renderFlattedTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, true) : true
  if (title !== true) return title

  return (
    <span className={cx('title__text', 'title__text--cols')}>
      {getNodeAncestors(option)
        .reverse()
        .map((item) => {
          return (
            <span className="title__text--col" key={item.id}>
              {item.title}
            </span>
          )
        })}
    </span>
  )
}
