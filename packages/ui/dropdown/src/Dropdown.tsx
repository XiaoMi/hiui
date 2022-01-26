import React, { cloneElement, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperOverlayProps, PopperPortal, PopperPortalProps } from '@hi-ui/popper'
import { DropDownProvider, useDropDownContext } from './context'
import { useDropdown, UseDropdownProps } from './use-dropdown'
import { isArray, isArrayNonEmpty } from '@hi-ui/type-assertion'
import Button, { ButtonGroup } from '@hi-ui/button'
import { DownOutlined } from '@hi-ui/icons'
import { DropdownDataItem } from './types'

const _role = 'dropdown'
const _prefix = getPrefixCls(_role)
const DEFAULT_DATA = [] as []

/**
 * 下拉菜单
 *
 * TODO:
 * 1. 支持自定义icon
 * 2. 支持 titleRender
 * 3. 支持 onClick 阻止默认行为关闭
 */
export const Dropdown = forwardRef<HTMLDivElement | null, DropdownProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children: triggerButton,
      data = DEFAULT_DATA,
      title,
      type = 'text',
      onClick,
      onButtonClick,
      overlayClassName,
      ...rest
    },
    ref
  ) => {
    const { rootProps, ...providedValue } = useDropdown(rest)

    const { getMenuProps, getTriggerProps, disabled, menuVisibleAction } = providedValue

    const cls = cx(prefixCls, className, disabled && `${prefixCls}--disabled`)

    const dig = (treeData: DropdownDataItem[]) => {
      return treeData.map((item: any) => {
        const menu = isArrayNonEmpty(item.children) ? (
          <DropdownMenu overlay={{ gutterGap: 16 }}>{dig(item.children)}</DropdownMenu>
        ) : null

        if (item.split) {
          return <li key={item.id} className={`${prefixCls}-divider`} />
        }

        return (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            href={item.href}
            target={item.target}
            value={item.id}
            menu={menu}
            onClick={() => {
              onClick?.(item.id)
              if (!isArray(item.children)) {
                menuVisibleAction.off()
              }
            }}
          >
            {item.title}
          </DropdownMenuItem>
        )
      })
    }

    const renderButton = () => {
      if (triggerButton) {
        // @ts-ignore
        return cloneElement(triggerButton, getTriggerProps(triggerButton.props, triggerButton.ref))
      }

      if (type === 'text' || type === 'button') {
        return (
          <Button {...getTriggerProps()} appearance={type === 'button' ? 'flat' : 'link'}>
            {title}
            <DownOutlined style={{ marginInlineStart: 2 }} />
          </Button>
        )
      }

      if (type === 'group') {
        return (
          <ButtonGroup>
            <Button onClick={onButtonClick}>{title}</Button>
            <Button
              className={cx(`${prefixCls}__icon`, `${prefixCls}__icon-btn-wrap`)}
              {...getTriggerProps()}
            >
              <DownOutlined />
            </Button>
          </ButtonGroup>
        )
      }

      return null
    }

    return (
      <DropDownProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          {renderButton()}

          {isArrayNonEmpty(data) ? (
            <DropdownMenu
              {...getMenuProps({ overlay: { disabledPortal: false, className: overlayClassName } })}
            >
              {dig(data)}
            </DropdownMenu>
          ) : null}
        </div>
      </DropDownProvider>
    )
  }
)

export interface DropdownProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'>, UseDropdownProps {
  /**
   * 下拉菜单显示标题的内容
   */
  title?: React.ReactNode
  /**
   * 下拉菜单数据项
   */
  data?: DropdownDataItem[]
  /**
   * 设置下拉面板宽度
   */
  width?: number
  /**
   * 	下拉菜单按钮类型
   */
  type?: 'text' | 'button' | 'group'
  /**
   * 点击左侧按钮的回调，仅在 type 为 group 时有效
   */
  onButtonClick?: (event: React.MouseEvent) => void
  /**
   * 点击后的回调
   */
  onClick?: (id: React.ReactText) => void
  /**
   * 下拉根元素的类名称
   */
  overlayClassName?: string
  /**
   * 自定义下拉菜单触发按钮
   * 注意：自定义按钮需要支持 ref 获取元素 dom 引用 以及 trigger 对应的事件：
   *
   * hover: onMouseEnter \ onMouseLeave
   * click: onClick
   * contextmenu: onContextMenu
   */
  children?: React.ReactNode
  /**
   * 自定义控制 下拉 popper 行为
   */
  overlay?: PopperOverlayProps
}

if (__DEV__) {
  Dropdown.displayName = 'Dropdown'
}

const dropdownMenuPrefix = getPrefixCls('dropdown-menu')

/**
 * TODO: What is DropdownMenu
 */
const DropdownMenu = forwardRef<HTMLUListElement | null, DropdownMenuProps>(
  (
    {
      prefixCls = dropdownMenuPrefix,
      role = _role,
      overlay,
      parents,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <PopperPortal {...(overlay as PopperPortalProps)}>
        <ul ref={ref} className={cls} {...rest}>
          {children
            ? React.Children.map(children, (child: any) => {
                return cloneElement(child, {
                  parents,
                })
              })
            : children}
        </ul>
      </PopperPortal>
    )
  }
)

interface DropdownMenuProps extends HiBaseHTMLProps<'ul'> {
  /**
   * 透传 popper 对象
   */
  overlay?: Omit<PopperPortalProps, 'visible' | 'attachEl'>
  /**
   * 祖先吸附元素DOM引用数组
   */
  parents?: React.RefObject<HTMLElement>[]
}

if (__DEV__) {
  DropdownMenu.displayName = 'DropdownMenu'
}

const dropdownMenuItemPrefix = getPrefixCls('dropdown-menu-item')

/**
 * TODO: What is DropdownMenuItem
 */
const DropdownMenuItem = forwardRef<HTMLLIElement | null, DropdownMenuItemProps>(
  (
    {
      prefixCls = dropdownMenuItemPrefix,
      role = _role,
      className,
      children,
      href,
      value,
      target,
      disabled,
      parents: parentsProp,
      menu,
      ...rest
    },
    ref
  ) => {
    const { triggerMethods, width } = useDropDownContext()

    const { menuVisible, rootProps, getTriggerProps, getMenuProps } = useDropdown({
      overlay: { placement: 'right-start', disabledPortal: true },
      width,
      ...rest,
      trigger: triggerMethods,
      parents: parentsProp,
    })

    const cls = cx(prefixCls, className, menuVisible && `${prefixCls}--active`)
    const shouldUseLink = href && !disabled

    return (
      <li ref={ref} className={cls} {...rootProps}>
        <div className={`${prefixCls}__trigger`} {...getTriggerProps()}>
          {shouldUseLink ? (
            <a className={`${prefixCls}__link`} href={href} target={target}>
              {children}
            </a>
          ) : (
            children
          )}
          {menu ? (
            <span className={`${prefixCls}__arrow`}>
              <DownOutlined />
            </span>
          ) : null}
        </div>
        {menu
          ? cloneElement(menu, {
              ...getMenuProps(menu.props),
            })
          : null}
      </li>
    )
  }
)

interface DropdownMenuItemProps extends HiBaseHTMLProps<'li'> {
  /**
   * 级联子菜单
   */
  menu?: ReturnType<typeof DropdownMenu>
  /**
   * 点击跳转的路径
   */
  href?: string
  /**
   * 当前 Menuitem 唯一标识值
   */
  value?: React.ReactText
  /**
   * 同 a 标签的 target 属性，仅在设置 href 后有效 (3.0 新增)
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 祖先吸附元素DOM引用数组
   */
  parents?: React.RefObject<HTMLElement>[]
}

if (__DEV__) {
  DropdownMenuItem.displayName = 'DropdownMenuItem'
}
