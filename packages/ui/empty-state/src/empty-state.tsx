import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import DefaultIcon from './default-icon'

const _role = 'empty-state'
const _prefix = getPrefixCls(_role)

export const EmptyState = forwardRef<HTMLDivElement | null, EmptyStateProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      indicator = <DefaultIndicator />,
      title = '暂无数据',
      imageStyle,
      imageClassName,
      size = 'small',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)
    const imageCls = cx(`${prefixCls}__image`, imageClassName)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={imageCls} style={imageStyle}>
          {typeof indicator === 'string' ? <img src={indicator} alt={'indicator'} /> : indicator}
        </div>
        {title ? <span className={`${prefixCls}__title`}>{title}</span> : null}
        {children && <div className={`${prefixCls}__slot`}>{children}</div>}
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
  imageStyle?: React.CSSProperties
  imageClassName?: string
  /**
   * 图标尺寸
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large'

  children?: React.ReactNode
}

if (__DEV__) {
  EmptyState.displayName = 'EmptyState'
}

const DefaultIndicator: React.FC<DefaultIndicatorProps> = (props) => {
  return <img alt="empty" src={DefaultIcon} {...props} />
}

export interface DefaultIndicatorProps {
  prefixCls?: string
  role?: string
  className?: string
  style?: React.CSSProperties
}
