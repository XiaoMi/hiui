// 测试 React + ts
import React, { forwardRef, useMemo } from 'react'
// 测试 import
import { cx, getPrefixCls } from '@hi-ui/classname'

const componentName = 'avatar'
const _prefix = getPrefixCls(componentName)

// 测试 babel
const test = Array.from([])

console.log(test)

// 测试 export components
export const Avatar = forwardRef<HTMLDivElement | null, AvatarProps>(
  (
    {
      prefixCls = _prefix,
      className,
      labelClassName,
      children,
      role = componentName,
      style,
      src,
      label,
      gap = 8,
      size = 48,
      active = false,
      bordered = false,
      bgColor = '#f8f8f8',
      foreColor = 'inherit',
      shape = 'circle',
      placement = 'left',
      fit = 'contain',
      onError,
      ...restProps
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, active && `${prefixCls}__active`)
    const imageCls = cx(
      `${prefixCls}__image`,
      shape && `${prefixCls}__image--${shape}`,
      bordered && `${prefixCls}__image--bordered`
    )
    const imageStyle = {
      width: size,
      height: size,
      fontSize: size / 2.5,
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: fit,
      color: foreColor,
      backgroundColor: bgColor,
    }

    const placementStyle = useMemo(() => {
      const placements = {
        top: {
          labelStyle: {
            marginTop: gap,
          },
          style: {
            flexDirection: 'column',
          },
        },
        bottom: {
          labelStyle: {
            marginBottom: gap,
          },
          style: {
            flexDirection: 'column-reverse',
          },
        },
        left: {
          labelStyle: {
            marginLeft: gap,
          },
          style: {
            flexDirection: 'row',
          },
        },
        right: {
          labelStyle: {
            marginRight: gap,
          },
          style: {
            flexDirection: 'row-reverse',
          },
        },
      }

      return placements[placement]
    }, [gap, placement])

    const _style = {
      ...style,
      ...placementStyle.style,
    } as React.CSSProperties

    const labelStyle = placementStyle.labelStyle as React.CSSProperties

    return (
      <div ref={ref} role={role} className={cls} style={_style} {...restProps}>
        <span className={imageCls} style={imageStyle}>
          {children}
        </span>
        {label && (
          <span className={cx(`${prefixCls}__label`, labelClassName)} style={labelStyle}>
            {label}
          </span>
        )}
      </div>
    )
  }
)

// 测试 export types
export interface AvatarProps {
  prefixCls?: string
  style?: React.CSSProperties
  role?: string
  className?: string
  children?: React.ReactNode
  bordered?: boolean
  label?: React.ReactNode
  labelClassName?: string
  gap?: number
  size?: number
  src?: string
  fallback?: React.ReactElement
  onClick?: () => void
  onError?: () => void
  active?: boolean
  bgColor?: string
  foreColor?: string
  shape?: 'circle' | 'round' | 'none'
  placement?: 'top' | 'right' | 'bottom' | 'left'
  fit?: string
}

// 测试 export default
export default Avatar
