import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger } from './type'
import { debounce } from './utils'
import { CascaderOption } from './CascaderOption'
import { CascaderProvider } from './context'

const _role = 'cascader-menus'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderMenus
 */
export const CascaderMenus = forwardRef<HTMLDivElement | null, CascaderMenusProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      overlayClassName,
      data,
      value,
      // onSelect,
      expandTrigger = 'click',
      ...rest
    },
    ref
  ) => {
    const getMenus = (data: CascaderItem[]) => {
      const activeValue = value

      const menu: CascaderItem[][] = []
      // 从 value 中 找到指定的 options（逐层查找）
      const dig = (data: CascaderItem[], depth: number) => {
        menu.push(data)

        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          // 找到下一级
          if (node.id === activeValue[i]) {
            if (node.children) {
              dig(node.children, depth + 1)
            }
          }
        }
      }

      dig(data, 0)
      console.log(menu)
      return menu
    }

    const renderMenu = (data: CascaderItem[]) => {
      const menus = getMenus(data)

      return menus.map((menu, menuIdx) => {
        return (
          <ul className={`${prefixCls}-menu`} key={menuIdx}>
            {menu.map((option) => {
              return (
                <li className={`${prefixCls}-menu__item`} key={option.id}>
                  <CascaderOption data={option} {...getExpandProps(option, menuIdx)} />
                </li>
              )
            })}
          </ul>
        )
      })
    }

    const onOptionSelect = (evt, option, index) => {
      console.log('onOptionSelect', evt, option, index)
    }

    const getExpandProps = useCallback((option, index) => {
      const expandProps: any = {
        onClick: (evt) => onOptionSelect(evt, option, index),
      }

      if (expandTrigger === 'hover') {
        const hasChildren = option.children && option.children.length > 0
        const canExpanded = hasChildren || option.isLeaf !== true

        if (canExpanded) {
          const debouncedOnSelect = debounce(onOptionSelect)
          expandProps.onMouseEnter = debouncedOnSelect
          expandProps.onMouseLeave = debouncedOnSelect.cancel
        }
      }

      return expandProps
    }, [])

    const providedValue = useMemo(
      () => ({
        expandTrigger,
        onSelect: onOptionSelect,
      }),
      [expandTrigger, onOptionSelect]
    )

    const cls = cx(prefixCls, overlayClassName, className)

    return (
      <CascaderProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rest}>
          {renderMenu(data)}
        </div>
      </CascaderProvider>
    )
  }
)

export interface CascaderMenusProps {
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
  overlayClassName?: string
  /**
   * 设置选择项数据源
   */
  data: CascaderItem[]
  /**
   * 设置当前选中值
   */
  value: React.ReactText[]
  onSelect?: () => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
}

if (__DEV__) {
  CascaderMenus.displayName = 'CascaderMenus'
}
