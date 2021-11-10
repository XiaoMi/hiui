import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Popper from '@hi-ui/popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { DropDownProvider, useDropDownContext } from './context'
import { useDropdown, UseDropdownProps } from './use-dropdown'
import { TriggerActionEnum } from './types'

const _role = 'dropdown'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Dropdown
 */
export const Dropdown = forwardRef<HTMLDivElement | null, DropdownProps>(
  ({ prefixCls = _prefix, role = _role, className, children, triggerButton, ...rest }, ref) => {
    const { getRootProps, ...providedValue } = useDropdown(rest)

    const { visible, menuVisibleAction, dropdownRef } = providedValue

    const rootProps = getRootProps()

    const cls = cx(prefixCls, className)

    return (
      <DropDownProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          {triggerButton}
          {isValidElement(children)
            ? cloneElement(children, {
                depth: 0,
                popper: {
                  visible,
                  attachEl: dropdownRef.current,
                  onClose: menuVisibleAction.off,
                },
              })
            : null}
        </div>
      </DropDownProvider>
    )
  }
)

export interface DropdownProps extends HiBaseHTMLProps<'div'>, UseDropdownProps {}

if (__DEV__) {
  Dropdown.displayName = 'Dropdown'
}

const dropdownButtonPrefix = getPrefixCls('dropdown-button')

/**
 * TODO: What is DropdownButton
 */
export const DropdownButton = forwardRef<HTMLDivElement | null, DropdownButtonProps>(
  ({ prefixCls = dropdownButtonPrefix, role = _role, className, children, ...rest }, ref) => {
    const { getTriggerProps } = useDropDownContext()
    const triggerProps = getTriggerProps()

    const cls = cx(prefixCls, className)

    return (
      <div role={role} className={cls} {...rest} {...triggerProps}>
        {children}
      </div>
    )
  }
)

export interface DropdownButtonProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  DropdownButton.displayName = 'DropdownButton'
}

const dropdownMenuPrefix = getPrefixCls('dropdown-menu')

/**
 * TODO: What is DropdownMenu
 */
export const DropdownMenu = forwardRef<HTMLUListElement | null, DropdownMenuProps>(
  (
    { prefixCls = dropdownMenuPrefix, role = _role, depth, popper, className, children, ...rest },
    ref
  ) => {
    const { visible: menuVisible } = useDropDownContext()

    const [visibleSubMenuId, setVisibleSubMenuId] = useState('')
    console.log(depth, menuVisible, 'visibleSubMenuId', visibleSubMenuId)

    // TODO: 抽离 到 useHook，然后以数组路径式去维护
    useEffect(() => {
      console.log('unmount', menuVisible)

      setVisibleSubMenuId('')
    }, [menuVisible])

    const cls = cx(prefixCls, className)

    return (
      <Popper {...popper}>
        <ul className={cls} {...rest}>
          {/* {data
            ? data.map((item, idx) => {
                return <DropdownMenuItem key={idx} />
              })
            : null} */}
          {children
            ? React.Children.map(children, (child) => {
                return cloneElement(child, {
                  depth,
                  visibleSubMenuId,
                  setVisibleSubMenuId,
                })
              })
            : children}
        </ul>
      </Popper>
    )
  }
)

export interface DropdownMenuProps extends HiBaseHTMLProps<'ul'> {}

if (__DEV__) {
  DropdownMenu.displayName = 'DropdownMenu'
}

const dropdownMenuItemPrefix = getPrefixCls('dropdown-menu')

/**
 * TODO: What is DropdownMenuItem
 */
export const DropdownMenuItem = forwardRef<HTMLLIElement | null, DropdownMenuItemProps>(
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
      depth,
      visibleSubMenuId,
      setVisibleSubMenuId,
      menu,
      ...rest
    },
    ref
  ) => {
    const { triggerMethods } = useDropDownContext()

    const cls = cx(prefixCls, className)
    const shouldUseLink = href && !disabled

    const dropdownRef = useRef<HTMLElement>(null)

    const subMenuVisible = visibleSubMenuId === value
    const subsubMenuVisibleAction = useMemo(() => {
      return {
        off: () => {
          setVisibleSubMenuId('')
        },
        on: () => {
          console.log('sub on', value)

          setVisibleSubMenuId(value)
        },
        not: () => {
          setVisibleSubMenuId((prev) => (prev === value ? '' : value))
        },
      }
    }, [setVisibleSubMenuId, value])

    const handleMouseLeave = useCallback(
      (evt: MouseEvent) => {
        console.log(evt)
        if (evt && dropdownRef.current?.contains(evt.target as HTMLElement)) return
        subsubMenuVisibleAction.off()
      },
      [subsubMenuVisibleAction]
    )

    // 事件收集
    // 'click' | 'contextmenu' | 'hover'
    const eventHandler = useMemo(() => {
      return triggerMethods.reduce((acc, cur) => {
        switch (cur) {
          // TODO: 处理冒泡，模拟冒泡阻止事件触发
          case TriggerActionEnum.HOVER:
            acc.onMouseEnter = subsubMenuVisibleAction.on
            acc.onMouseLeave = handleMouseLeave
            break
          case TriggerActionEnum.CONTEXTMENU:
            // acc.onContextMenu = subsubMenuVisibleAction.not
            break
          case TriggerActionEnum.CLICK:
            acc.onClick = subsubMenuVisibleAction.on
            break
        }

        return acc
      }, {} as any)
    }, [triggerMethods, subsubMenuVisibleAction, handleMouseLeave])

    console.log('subMenuVisible', subMenuVisible)

    return (
      <li
        ref={useMergeRefs(dropdownRef, ref)}
        className={cls}
        {...rest}
        onMouseEnter={eventHandler.onMouseEnter}
        onMouseLeave={eventHandler.onMouseLeave}
      >
        <span onClick={eventHandler.onClick} onContextMenu={eventHandler.onContextMenu}>
          {shouldUseLink ? <a href={href} target={target}></a> : children}
        </span>
        {menu
          ? cloneElement(menu, {
              depth: depth + 1,
              popper: {
                placement: 'right',
                attachEl: dropdownRef.current,
                visible: subMenuVisible,
                // onClose: handleMouseLeave,
              },
            })
          : null}
      </li>
    )
  }
)

export interface DropdownMenuItemProps extends HiBaseHTMLProps<'li'> {
  menu?: any
}

if (__DEV__) {
  DropdownMenuItem.displayName = 'DropdownMenuItem'
}
