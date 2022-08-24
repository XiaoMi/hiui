import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import TWEEN from '@tweenjs/tween.js'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { ArrowUpOutlined } from '@hi-ui/icons'
import Tooltip, { TooltipProps } from '@hi-ui/tooltip'
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
      type = 'white',
      shape = 'circle',
      visibleHeight = 400,
      duration = 400,
      target = () => window,
      onClick,
      tooltipProps,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const [targetDom, setTargetDom] = useState<HTMLElement | Window>(window)

    const { top } = useScroll(targetDom)

    const visibleMemo = useMemo(() => {
      return top >= visibleHeight
    }, [top, visibleHeight])

    const cls = cx(prefixCls, visibleMemo && `${prefixCls}--visible`, className)
    const contentCls = cx(
      `${prefixCls}__content`,
      `${prefixCls}__content--shape-${shape}`,
      `${prefixCls}__content--type-${type}`,
      className
    )

    const scrollToTop = useCallback(() => {
      new TWEEN.Tween({ top })
        .to({ top: 0 }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((data) => {
          targetDom.scrollTo(data)
        })
        .start()
    }, [duration, targetDom, top])

    const handleClick = useLatestCallback(() => {
      scrollToTop()
      onClick?.()
    })

    useDidMount(() => {
      // 设置 target 真实dom节点
      setTargetDom(target?.())

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
          <Tooltip title={i18n.get('backTop.backToTop')} placement="left" {...tooltipProps}>
            <div className={contentCls}>
              <ArrowUpOutlined />
            </div>
          </Tooltip>
        )}
      </div>
    )
  }
)

export interface BackTopProps extends HiBaseHTMLProps<'div'> {
  /**
   * 设置类型
   */
  type?: 'blue' | 'black' | 'white'
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
  target?: () => HTMLElement | Window
  /**
   * 点击回到顶部时的回调函数
   */
  onClick?: () => void
  /**
   * 设置 Tooltip 组件参数，可参见 Tooltip 组件参数使用说明
   */
  tooltipProps?: Partial<TooltipProps>
}

if (__DEV__) {
  BackTop.displayName = 'BackTop'
}
