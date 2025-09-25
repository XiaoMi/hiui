import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import Popover, { PopoverProps } from '@hi-ui/popover'
import { CheckOutlined } from '@hi-ui/icons'

const APP_LIST_PREFIX = getPrefixCls('app-list')

/**
 * 应用列表组件
 */
export const AppList = forwardRef<HTMLDivElement | null, AppListProps>(
  (
    {
      prefixCls = APP_LIST_PREFIX,
      role = 'app-list',
      className,
      data,
      activeId: activeIdProp,
      defaultActiveId,
      titleRender,
      onItemClick,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const [activeId, tryChangeActiveId] = useUncontrolledState<React.ReactText | undefined>(
      defaultActiveId,
      activeIdProp
    )

    const handleItemClick = useCallback(
      (item: AppListItem, event: React.MouseEvent<HTMLDivElement>) => {
        tryChangeActiveId(item.id)
        onItemClick?.(item, event)

        event.stopPropagation()
      },
      [tryChangeActiveId, onItemClick]
    )

    const renderIcon = useCallback((item: AppListItem) => {
      const { icon, title } = item

      if (!icon) {
        if (typeof title === 'string') {
          return title.slice(0, 1)
        }
        return null
      }

      return icon
    }, [])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`${prefixCls}-wrapper`}>
          {data?.map((item) => {
            const { id, title, iconBgColor } = item

            return (
              <div
                className={cx(`${prefixCls}-item`, {
                  [`${prefixCls}-item--active`]: activeId === id,
                })}
                key={id}
                onClick={(event) => handleItemClick(item, event)}
              >
                <div
                  className={cx(`${prefixCls}-item__icon`)}
                  style={{
                    backgroundColor: iconBgColor ? IconBgColorMap[iconBgColor] : undefined,
                  }}
                >
                  {renderIcon(item)}
                </div>
                <div className={`${prefixCls}-item__title`}>{titleRender?.(item) || title}</div>
                <div className={`${prefixCls}-item__checked`}>
                  <CheckOutlined />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export const IconBgColorMap = {
  // 深蓝色、浅蓝色、青色、绿色、紫色、黄色、橙色
  BLUE: '#2660ff',
  SKYBLUE: '#0aadff',
  CYAN: '#04c2ac',
  GREEN: '#24b237',
  PURPLE: '#7f3df2',
  YELLOW: '#ffbe0a',
  ORANGE: '#ff7700',
} as const

export interface AppListItem {
  /**
   * 应用图标
   */
  icon?: React.ReactNode
  /**
   * 应用图标背景颜色
   */
  iconBgColor?: keyof typeof IconBgColorMap
  /**
   * 应用 id
   */
  id: React.ReactText
  /**
   * 应用标题
   */
  title?: React.ReactNode
}

export interface AppListProps extends HiBaseHTMLProps<'div'> {
  /**
   * 应用列表数据
   */
  data?: AppListItem[]
  /**
   * 默认激活的应用 id
   */
  defaultActiveId?: React.ReactText
  /**
   * 激活的应用 id
   */
  activeId?: React.ReactText
  /**
   * 应用标题渲染
   */
  titleRender?: (item: AppListItem) => React.ReactNode
  /**
   * 应用列表点击回调
   */
  onItemClick?: (item: AppListItem, event: React.MouseEvent<HTMLDivElement>) => void
}

if (__DEV__) {
  AppList.displayName = 'AppList'
}

export const AppListPopover = forwardRef<HTMLDivElement | null, AppListPopoverProps>(
  (
    {
      onOpen,
      onClose,
      visible: visibleProp,
      children,
      data,
      defaultActiveId,
      activeId,
      titleRender,
      onItemClick,
      ...restProps
    },
    ref
  ) => {
    const [visible, visibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible: visibleProp,
    })

    const handleOpen = useCallback(() => {
      visibleAction.on()
      onOpen?.()
    }, [onOpen, visibleAction])

    const handleClose = useCallback(() => {
      visibleAction.off()
      onClose?.()
    }, [onClose, visibleAction])

    return (
      <Popover
        style={{
          boxSizing: 'border-box',
          paddingLeft: 12,
          paddingRight: 12,
          maxHeight: 408,
          overflow: 'auto',
        }}
        visible={visible}
        arrow={false}
        placement="right-start"
        gutterGap={4}
        content={
          <AppList
            ref={ref}
            data={data}
            defaultActiveId={defaultActiveId}
            activeId={activeId}
            titleRender={titleRender}
            onItemClick={onItemClick}
          />
        }
        onOpen={handleOpen}
        onClose={handleClose}
        {...restProps}
      >
        {children}
      </Popover>
    )
  }
)

export interface AppListPopoverProps extends AppListProps, Omit<PopoverProps, 'content'> {
  /**
   * 应用列表是否可见
   */
  visible?: boolean
  /**
   * 应用列表打开回调
   */
  onOpen?: () => void
  /**
   * 应用列表关闭回调
   */
  onClose?: () => void
}

if (__DEV__) {
  AppListPopover.displayName = 'AppListPopover'
}
