import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Popover, { PopoverProps } from '@hi-ui/popover'
import { CheckOutlined, RightOutlined } from '@hi-ui/icons'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const PROFILE_PREFIX = getPrefixCls('profile')

export const Profile = forwardRef<HTMLDivElement | null, ProfileProps>(
  (
    {
      prefixCls = PROFILE_PREFIX,
      role = 'profile',
      className,
      children,
      header,
      footer,
      settings,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const [value, setValue] = useUncontrolledState(settings?.value ?? {}, settings?.value)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`${prefixCls}__header`}>{header}</div>
        <div className={`${prefixCls}__settings`}>
          {settings?.data.map((item) => (
            <Popover
              style={{
                boxSizing: 'border-box',
                width: 200,
                padding: 8,
              }}
              {...(!item.children?.length ? { visible: false } : {})}
              key={item.id}
              disabledPortal
              arrow={false}
              placement={settings?.placement ?? 'right-start'}
              content={
                <div>
                  {item.children?.map((child) => {
                    const keys = Object.keys(value)
                    const currentKey = keys.find((key) => key === item.id) || item.id
                    const checked = currentKey && value[currentKey ?? ''] === child.id

                    return (
                      <div
                        key={child.id}
                        className={cx(`${prefixCls}__settings-item-leaf`, {
                          [`${prefixCls}__settings-item-leaf--checked`]: checked,
                        })}
                        onClick={(evt) => {
                          const nextValue = checked
                            ? { ...value, [currentKey || '']: '' }
                            : { ...value, [currentKey || '']: child.id || '' }
                          setValue(nextValue)
                          settings?.onChange?.(nextValue, child)
                          settings?.onItemClick?.(evt, child)
                        }}
                      >
                        <div className={`${prefixCls}__settings-item-leaf__title`}>
                          {child.title}
                        </div>
                        <div className={`${prefixCls}__settings-item-leaf__checked`}>
                          {checked && <CheckOutlined />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            >
              <div
                className={`${prefixCls}__settings-item`}
                onClick={(evt) => settings?.onItemClick?.(evt, item)}
              >
                <div className={`${prefixCls}__settings-item__title-wrapper`}>
                  <div className={`${prefixCls}__settings-item__title`}>{item.title}</div>
                  {item.subtitle ? (
                    <div className={`${prefixCls}__settings-item__subtitle`}>{item.subtitle}</div>
                  ) : null}
                </div>
                {item.children?.length ? (
                  <div className={`${prefixCls}__settings-item__arrow`}>
                    <RightOutlined />
                  </div>
                ) : null}
              </div>
            </Popover>
          ))}
        </div>
        <div className={`${prefixCls}__footer`}>
          <div className={`${prefixCls}__footer__content`}>{footer}</div>
        </div>
      </div>
    )
  }
)

export interface ProfileSettingsItem {
  id?: React.ReactText
  title?: string
  subtitle?: string
  children?: ProfileSettingsItem[]
}

export interface ProfileProps extends HiBaseHTMLProps<'div'> {
  header?: React.ReactNode
  footer?: React.ReactNode
  settings?: {
    value?: Record<string, React.ReactText>
    data: ProfileSettingsItem[]
    placement?: PopoverProps['placement']
    onItemClick?: (evt: React.MouseEvent, item: ProfileSettingsItem) => void
    onChange?: (value: Record<string, React.ReactText>, targetItem: ProfileSettingsItem) => void
  }
}

if (__DEV__) {
  Profile.displayName = 'Profile'
}

export const ProfilePopover = forwardRef<HTMLDivElement | null, ProfilePopoverProps>(
  (
    {
      onOpen,
      onClose,
      visible: visibleProp,
      placement = 'right-end',
      trigger = 'click',
      children,
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
          padding: 0,
          overflow: 'auto',
        }}
        visible={visible}
        arrow={false}
        trigger={trigger}
        placement={placement}
        gutterGap={16}
        content={<Profile ref={ref} {...restProps} />}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        {children}
      </Popover>
    )
  }
)

export interface ProfilePopoverProps extends ProfileProps, Omit<PopoverProps, 'content'> {}

if (__DEV__) {
  ProfilePopover.displayName = 'ProfilePopover'
}
