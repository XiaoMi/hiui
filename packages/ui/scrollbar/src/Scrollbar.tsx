import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import PerfectScrollbar from 'perfect-scrollbar'
import {
  ScrollbarAxesEnum,
  ScrollbarEventProps,
  ScrollbarPositionEnum,
  ScrollbarHelpers,
} from './types'
import { ScrollbarEventToPsMap } from './utils'

const SCROLLBAR_PREFIX = getPrefixCls('scrollbar')

export const Scrollbar = forwardRef<HTMLDivElement | null, ScrollbarProps>(
  (
    {
      prefixCls = SCROLLBAR_PREFIX,
      role = 'scrollbar',
      position = 'relative',
      axes = 'both',
      keepVisible = false,
      onlyScrollVisible = false,
      className,
      children,
      style,
      innerRef,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, 'priority', {
      [`${prefixCls}--keep-visible`]: keepVisible,
      [`${prefixCls}--only-scroll-visible`]: !keepVisible && onlyScrollVisible,
    })
    const [ps, setPs] = useState<PerfectScrollbar | undefined>(undefined)
    const [containerElement, setContainer] = useState<HTMLDivElement | null>(null)
    const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(null)
    const eventPropsRef = useRef<ScrollbarEventProps>({})

    useEffect(() => {
      if (containerElement) {
        setPs(new PerfectScrollbar(containerElement))
      }
    }, [containerElement])

    // 轴定制
    useEffect(() => {
      if (ps) {
        ps.settings.suppressScrollX = true
        ps.settings.suppressScrollY = true

        if (axes === 'both' || axes === 'x') {
          ps.settings.suppressScrollX = false
        }

        if (axes === 'both' || axes === 'y') {
          ps.settings.suppressScrollY = false
        }

        ps.update()
      }
    }, [ps, axes])

    // 监听容器以及内容尺寸
    useEffect(() => {
      if (ps && wrapperElement && containerElement) {
        const observer = new ResizeObserver((entries) => {
          ps.update()
        })

        observer.observe(containerElement)
        observer.observe(wrapperElement)

        return () => {
          observer.disconnect()
        }
      }
    }, [ps, wrapperElement, containerElement])

    useImperativeHandle(
      innerRef,
      () => ({
        instance: ps,
        containerElement: containerElement || undefined,
      }),
      [ps, containerElement]
    )

    const { eventProps, injectProps } = useMemo(() => {
      const eventProps: ScrollbarEventProps = {}
      const injectProps: any = {}
      const eventNames = Object.keys(ScrollbarEventToPsMap)

      for (const propsName of Object.keys(rest)) {
        if (eventNames.includes(propsName)) {
          ;(eventProps as any)[propsName] = (rest as any)[propsName]
        } else {
          injectProps[propsName] = (rest as any)[propsName]
        }
      }

      return { eventProps, injectProps }
    }, [rest])

    // 更新event props引用
    useEffect(() => {
      eventPropsRef.current = eventProps
    }, [eventProps])

    // 注册监听事件
    useEffect(() => {
      if (containerElement) {
        Object.keys(ScrollbarEventToPsMap).forEach((event) => {
          containerElement.addEventListener((ScrollbarEventToPsMap as any)[event], (e) => {
            ;(eventPropsRef.current as any)[event]?.(e)
          })
        })
      }
    }, [containerElement])

    return (
      <div
        ref={useMergeRefs(setContainer, ref)}
        role={role}
        className={cls}
        style={{ ...style, position }}
        {...injectProps}
      >
        <div className={`${prefixCls}__wrapper`} ref={setWrapperElement}>
          {children}
        </div>
      </div>
    )
  }
)

export interface ScrollbarProps extends HiBaseHTMLProps<'div'>, ScrollbarEventProps {
  /**
   * 内部提供辅助方法。暂不对外暴露
   * @private
   */
  innerRef?: React.Ref<ScrollbarHelpers>
  /**
   * 容器 css position
   * @default 'relative'
   */
  position?: ScrollbarPositionEnum
  /**
   * 开启滚动的轴
   * @default 'both'
   */
  axes?: ScrollbarAxesEnum
  /**
   * 轴一直保持可视状态(优先级高于`onlyScrollVisible`)
   * @default false
   */
  keepVisible?: boolean
  /**
   * 只有滚动的时候才会展示滚动条
   * @default false
   */
  onlyScrollVisible?: boolean
}

if (__DEV__) {
  Scrollbar.displayName = 'Scrollbar'
}
