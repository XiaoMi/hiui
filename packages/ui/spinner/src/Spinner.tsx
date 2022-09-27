import React, { forwardRef, ReactNode } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Loading, { LoadingProps } from '@hi-ui/loading'

const SPINNER_PREFIX = getPrefixCls('spinner')

/**
 * TODO: What is Spinner
 */
export const Spinner = forwardRef<HTMLElement | null, SpinnerProps>(
  (
    {
      prefixCls = SPINNER_PREFIX,
      role = 'spinner',
      className,
      style,
      children,
      visible = true,
      delay = -1,
      size = 14,
      icon,
      content,
      loading,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const spinComponent = (
      <i ref={ref} role={role} className={cls} style={{ fontSize: size, ...style }}>
        <svg
          className={`${prefixCls}__icon`}
          viewBox="0 0 18 18"
          version="1.1"
          width="0.8em"
          height="0.8em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="m9 18c-4.9706 0-9-4.0294-9-9 0-4.9706 4.0294-9 9-9 4.9706 0 9 4.0294 9 9 0 4.9706-4.0294 9-9 9zm0-2c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z"
              opacity=".15"
            />
            <path d="m15.547 2.8242c0.37904 0.40168 0.36068 1.0346-0.040996 1.4136-0.40168 0.37904-1.0346 0.36068-1.4136-0.040996-1.315-1.3935-3.1381-2.1969-5.0922-2.1969-3.866 0-7 3.134-7 7 0 0.55228-0.44772 1-1 1s-1-0.44772-1-1c0-4.9706 4.0294-9 9-9 2.5103 0 4.8578 1.0343 6.5468 2.8242z" />
          </g>
        </svg>
      </i>
    )

    return children ? (
      <Loading
        visible={visible}
        icon={icon || spinComponent}
        content={content}
        delay={delay}
        {...loading}
      >
        {children}
      </Loading>
    ) : (
      spinComponent
    )
  }
)

export interface SpinnerProps extends HiBaseHTMLProps<'i'> {
  /**
   * 显示隐藏
   */
  visible?: boolean
  /**
   * 延迟显示加载效果的时长（可用于防止闪烁）
   */
  delay?: number
  /**
   * 自定义尺寸
   */
  size?: number
  /**
   * 自定义显示icon
   */
  icon?: ReactNode
  /**
   * 自定义显示内容
   */
  content?: string | ReactNode
  /**
   * 设置 Loading 组件参数（当 Spinner 包裹有 children 时，底层会调用 Loading 组件）
   */
  loading?: Omit<LoadingProps, 'size'>
}

if (__DEV__) {
  Spinner.displayName = 'Spinner'
}
