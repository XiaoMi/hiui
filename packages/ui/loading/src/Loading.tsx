import React, { useImperativeHandle, forwardRef, ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Portal } from '@hi-ui/portal'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import Spinner from '@hi-ui/spinner'
import { useLoading } from './use-loading'

const _role = 'loading'
export const _prefix = getPrefixCls('loading')

export const Loading = forwardRef<null, LoadingProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      role = _role,
      container,
      content,
      visible = true,
      full = false,
      part = false,
      size = 'md',
      delay = -1,
      disabledPortal = false,
      innerRef,
      timeout = 300,
      indicator,
      type = 'dot',
      ...restProps
    },
    ref
  ) => {
    const { internalVisible, setInternalVisible } = useLoading({ visible, delay })

    useImperativeHandle(innerRef, () => ({
      close: () => setInternalVisible(false),
    }))

    const cls = cx(
      prefixCls,
      className,
      size && `${prefixCls}--size-${size}`,
      !full && (part || !!children) && `${prefixCls}--part`,
      full && `${prefixCls}--full`
    )

    const defaultIconComponent = (
      <div className={`${prefixCls}__icon`}>
        <div />
        <div />
      </div>
    )

    const getIndicator = useLatestCallback(() => {
      if (indicator) {
        return indicator
      }

      switch (type) {
        case 'spin':
          return <Spinner size={size} />
        default:
          return defaultIconComponent
      }
    })

    const loadingComponent = (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={internalVisible}
        timeout={timeout}
        unmountOnExit
      >
        <div ref={ref} role={role} className={cls} {...restProps}>
          <div className={`${prefixCls}__mask`} />
          <div className={`${prefixCls}__icon-wrapper`}>{getIndicator()}</div>
          {content ? <span className={`${prefixCls}__content`}>{content}</span> : null}
        </div>
      </CSSTransition>
    )

    return (
      <Portal container={container} disabled={!container && !full}>
        {children ? (
          // 可以测量 children margin，实现按内容位置偏移，排除 margin 影响
          // 暂时不考虑，如果有需要，完全可以把 margin 设置到加到父节点
          <div className={`${prefixCls}__wrapper`}>
            {children}
            {loadingComponent}
          </div>
        ) : (
          loadingComponent
        )}
      </Portal>
    )
  }
)

export type LoadingSizeEnum = HiBaseSizeEnum | undefined

export interface LoadingProps extends HiBaseHTMLProps<'div'> {
  /**
   * 	自定义加载中状态的文案
   */
  content?: React.ReactNode
  /**
   * 是否开启显示
   */
  visible?: boolean
  /**
   * 是否全屏展示，开启节点将挂载到 body
   */
  full?: boolean
  /**
   * 延迟显示加载效果的时长（可用于防止闪烁）
   */
  delay?: number
  /**
   * 自定义尺寸
   */
  size?: LoadingSizeEnum
  /**
   * 禁用 portal。暂不对外暴露
   * @private
   */
  disabledPortal?: boolean
  /**
   * 内部 ref引用，暂不对外暴露
   * @private
   */
  innerRef?: React.Ref<{ close: () => void }>
  /**
   * 指定 portal 的容器。暂不对外暴露
   * @private
   */
  container?: HTMLElement | null
  /**
   * 自定义动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
  /**
   * 局部定位。暂不对外暴露
   * @private
   */
  part?: boolean
  /**
   * 自定义加载指示符
   * @private
   */
  indicator?: ReactNode
  /**
   * loading 效果类型
   */
  type?: 'dot' | 'spin'
}

if (__DEV__) {
  Loading.displayName = 'Loading'
}
