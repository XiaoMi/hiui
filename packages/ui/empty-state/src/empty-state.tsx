import React, { forwardRef } from 'react'
import cx from 'classnames'
import __DEV__ from './env'

const componentName = 'empty-state'
export const _prefix = 'hi4-empty-state'

export const EmptyState = forwardRef<null, EmptyStateProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      role = componentName,
      indicator = <DefaultIndicator />,
      title,
      subtitle,
      imageStyle,
      imageClassName,
      ...restProps
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const imageCls = cx(`${prefixCls}__image`, imageClassName)

    return (
      <div ref={ref} role={role} className={cls} {...restProps}>
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
  prefixCls?: string
  role?: string
  className?: string
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

export default EmptyState

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
