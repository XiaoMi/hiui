import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import TWEEN from '@tweenjs/tween.js'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { isBrowser, __DEV__ } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ArrowUpOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useDidMount } from '@hi-ui/use-did-mount'
import { useScroll } from '@hi-ui/use-scroll'

const BACK_TOP_PREFIX = getPrefixCls('back-top')

/**
 * TODO: What is BackTop
 */
export const BackTop = forwardRef<HTMLDivElement | null, BackTopProps>(
  (
    {
      prefixCls = BACK_TOP_PREFIX,
      role = 'back-top',
      className,
      children,
      shape = 'circle',
      visibleHeight = 400,
      duration = 400,
      container,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [target, setTarget] = useState<HTMLElement | Window | null>(null)

    const { top } = useScroll(target)

    const getTarget = () => {
      if (!isBrowser) return null

      if (container === undefined) {
        return window
      }

      if (isFunction(container)) {
        return container()
      }

      return container
    }

    const visibleMemo = useMemo(() => {
      return top >= visibleHeight
    }, [top, visibleHeight])

    const cls = cx(prefixCls, visibleMemo && `${prefixCls}--visible`, className)
    const contentCls = cx(
      `${prefixCls}__content`,
      `${prefixCls}__content--type-white`,
      `${prefixCls}__content--shape-${shape}`,
      className
    )

    const scrollToTop = useCallback(() => {
      new TWEEN.Tween({ top })
        .to({ top: 0 }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((data) => {
          target?.scrollTo(data)
        })
        .start()
    }, [duration, target, top])

    const handleClick = useLatestCallback(() => {
      scrollToTop()
      onClick?.()
    })

    useDidMount(() => {
      // 设置 target 真实dom节点
      setTarget(getTarget())

      // 初始化 TWEEN 动画循环
      function animate(time?: number) {
        requestAnimationFrame(animate)
        TWEEN.update(time)
      }
      requestAnimationFrame(animate)
    })

    return (
      <div ref={ref} role={role} className={cls} onClick={handleClick} {...rest}>
        {children || (
          <div className={contentCls}>
            <ArrowUpOutlined />
          </div>
        )}
      </div>
    )
  }
)

export interface BackTopProps extends HiBaseHTMLProps<'div'> {
  /**
   * 设置形状
   */
  shape?: 'square' | 'circle'
  /**
   * 当内容滚动到该高度时，显示回到顶部组件
   */
  visibleHeight?: number
  /**
   * 回到顶部所需时间（ms）
   */
  duration?: number
  /**
   * 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   */
  container?: HTMLElement | null | (() => HTMLElement | null)
  /**
   * 点击回到顶部时的回调函数
   */
  onClick?: () => void
}

if (__DEV__) {
  BackTop.displayName = 'BackTop'
}
