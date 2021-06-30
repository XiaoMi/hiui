import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'empty-state'
const _prefixCls = getPrefixCls(_role)

export const EmptyState = forwardRef<HTMLDivElement | null, EmptyStateProps>(
  (
    {
      prefixCls = _prefixCls,
      role = _role,
      className,
      children,
      indicator = <DefaultIndicator />,
      title,
      subtitle,
      imageStyle,
      imageClassName,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const imageCls = cx(`${prefixCls}__image`, imageClassName)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={imageCls} style={imageStyle}>
          {indicator}
        </div>
        {title ? <span className={`${prefixCls}__title`}>{title}</span> : null}
        {subtitle ? <span className={`${prefixCls}__subtitle`}>{subtitle}</span> : null}
        {children}
      </div>
    )
  }
)

export interface EmptyStateProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的根选择器类
   */
  className?: string
  /**
   * 组件的根样式
   */
  style?: React.CSSProperties
  indicator?: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  imageStyle?: React.CSSProperties
  imageClassName?: string
}

if (__DEV__) {
  EmptyState.displayName = 'EmptyState'
}

const DefaultIndicator: React.FC<DefaultIndicatorProps> = (props) => {
  return (
    <img
      alt="empty"
      src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      {...props}
    />
  )
}

export interface DefaultIndicatorProps {
  prefixCls?: string
  role?: string
  className?: string
  style?: React.CSSProperties
}
