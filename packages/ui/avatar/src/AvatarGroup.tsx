import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { Popover, PopoverProps } from '@hi-ui/popover'
import { Avatar, AvatarProps } from './Avatar'

const _role = 'avatar-group'
const _prefix = getPrefixCls(_role)

export const AvatarGroup = forwardRef<HTMLDivElement | null, AvatarGroupProps>(
  (
    {
      children,
      prefixCls = _prefix,
      role = _role,
      className,
      maxCount = Infinity,
      moreButton,
      morePopover,
      size,
      shape,
      bordered,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const renderChildren = useMemo(() => {
      if (!isFinite(maxCount)) {
        return children
      }

      const childrenArray = React.Children.toArray(children)
      const childrenCount = childrenArray.length
      const childrenToRender = childrenArray.slice(0, maxCount)
      const moreChildren = childrenArray.slice(maxCount)
      const moreCount = childrenCount - maxCount

      const renderMore = () => {
        const initials = moreButton?.text || `+${moreCount}`
        return (
          <Popover
            content={
              morePopover?.content || (
                <div className={`${prefixCls}__more-content`}>
                  {moreChildren.map((child, index) => {
                    if (React.isValidElement(child)) {
                      return React.cloneElement(child, {
                        key: index,
                        ...child.props,
                      })
                    }
                    return child
                  })}
                </div>
              )
            }
            {...{
              trigger: morePopover?.trigger || 'hover',
              ...morePopover,
            }}
          >
            <Avatar
              className={`${prefixCls}__more-button`}
              style={moreButton?.style}
              initials={initials}
              size={size}
              shape={shape}
              bordered={bordered}
            />
          </Popover>
        )
      }

      return (
        <>
          {childrenToRender.map((child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                key: index,
                bordered,
                size,
                shape,
                ...child.props,
              })
            }
            return child
          })}
          {moreCount > 0 && renderMore()}
        </>
      )
    }, [
      bordered,
      children,
      maxCount,
      moreButton?.style,
      moreButton?.text,
      morePopover,
      prefixCls,
      shape,
      size,
    ])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderChildren}
      </div>
    )
  }
)

export interface AvatarGroupProps
  extends HiBaseHTMLProps<'div'>,
    Pick<AvatarProps, 'size' | 'shape' | 'bordered'> {
  /**
   * 最大显示数量
   */
  maxCount?: number
  /**
   * 更多按钮
   */
  moreButton?: {
    /**
     * 更多按钮文本
     */
    text?: React.ReactNode
    /**
     * 更多按钮样式
     */
    style?: React.CSSProperties
  }
  /**
   * 更多头像弹出框配置
   */
  morePopover?: Partial<PopoverProps>
}

if (__DEV__) {
  AvatarGroup.displayName = 'AvatarGroup'
}
