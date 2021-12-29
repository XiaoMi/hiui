import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CarouselProps } from './types'
import { Arrows } from './Arrows'
import { Dots } from './Dots'

const CAROUSEL_PREFIX = getPrefixCls('carousel')

export const Carousel = forwardRef<HTMLDivElement | null, CarouselProps>((props, ref) => {
  const {
    prefixCls = CAROUSEL_PREFIX,
    role = 'carousel',
    className,
    children,
    defaultActive = 0,
    duration,
    showArrows = true,
    arrowSize = 'md',
    dotPosition = 'bottom',
    dotType = 'slider',
    showDots = true,
    showPages = false,
    ...rest
  } = props
  const cls = cx(prefixCls, className, dotPosition === 'outer' && `${prefixCls}--dot-outer`)

  // 当前活跃下标
  const [activeIndex, setActiveIndex] = useState(defaultActive)
  // 子代数目
  const childCount = useMemo(() => React.Children.count(children), [children])
  // 内容（滚动容器）引用
  const contentRef = useRef<HTMLDivElement | null>(null)
  // 是否正在执行动画
  const [isInAnimation, setIsInAnimation] = useState(false)
  // 用户是否鼠标正处于组件内
  const [isInHoverComponent, setIsInHoverComponent] = useState(false)
  // 是否禁用所有的交互行为（自动切换、分页、左右指示符等等）
  // 当只有一个或者没有子代时禁用
  const isDisabledAllInteract = useMemo(() => {
    return childCount <= 1
  }, [childCount])

  // 处理子代
  const disposeChild = useCallback(
    (item: React.ReactChild | React.ReactFragment | React.ReactPortal, index: number) => {
      return (
        <div key={index} className={`${prefixCls}__item-wrapper`}>
          {item}
        </div>
      )
    },
    [prefixCls]
  )

  // 处理原始数组，在数组最后增加第一个子代，实现无缝链接功能
  const groupChildren = useMemo(() => {
    const childArray = React.Children.toArray(children)
    const originalGroup = [...childArray].map((item, index) => disposeChild(item, index))
    const suffixFirstOne = [childArray[0]].map((item, index) =>
      disposeChild(item, index + childArray.length)
    )
    return [...originalGroup, suffixFirstOne]
  }, [children, disposeChild])

  // 计算跳转到对应下标索引所需百分比位移
  const calcToIndexNeedPercentage = useCallback(
    (targetIndex: number) => `${-targetIndex * 100}%`,
    []
  )

  const toIndex = useCallback(
    (newIndex: number, leftToRight: boolean) => {
      if (newIndex === activeIndex) {
        return
      }

      if (contentRef.current) {
        // 新下标为0，并且希望从左往右，此情况为：已经到了最后一个item，点击了next按钮操作，或者自动跳转到下一个
        // 跳转到默认额外添加的第一个item copy上
        if (newIndex === 0 && leftToRight) {
          contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(
            childCount
          )})`
        }
        // 旧下标为0，并且希望从左往右，此时，我们需要保证，我们的 content 位于的是第一个 item，而非 copy 上
        else if (activeIndex === 0 && leftToRight) {
          // 禁用动画，先执行一次重定位
          contentRef.current.style.transition = 'none'
          contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(0)})`
          // 等待下一帧，渲染完成，我们恢复动画，并且跳转到对应位置
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = null as any
              contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(
                newIndex
              )})`
            }
          }, 0)
        }
        // 旧下标为0，并且希望从右往左，此情况为：已经到了最开始一个item，点击了last按钮操作
        // 我们需要保证，content 位于 第一个 item copy 上，然后执行跳转
        else if (activeIndex === 0 && !leftToRight) {
          // 禁用动画，先执行一次重定位
          contentRef.current.style.transition = 'none'
          contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(
            childCount
          )})`
          // 等待下一帧，渲染完成，我们恢复动画，并且跳转到对应位置
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = null as any
              contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(
                newIndex
              )})`
            }
          })
        } else {
          contentRef.current.style.transform = `translateX(${calcToIndexNeedPercentage(newIndex)})`
        }
      }

      setIsInAnimation(true)
      setActiveIndex(newIndex)
    },
    [activeIndex, calcToIndexNeedPercentage, childCount]
  )

  useEffect(() => {
    let handler = 0 as any
    if (duration && !isInHoverComponent) {
      handler = setInterval(() => {
        toIndex(activeIndex === childCount - 1 ? 0 : activeIndex + 1, true)
      }, duration)
    }
    return () => clearInterval(handler)
  }, [activeIndex, childCount, duration, isInHoverComponent, toIndex])

  const arrowOnClick = useCallback(
    (next: boolean) => {
      let targetIndex = next ? activeIndex + 1 : activeIndex - 1
      if (targetIndex === childCount) {
        targetIndex = 0
      } else if (targetIndex < 0) {
        targetIndex = childCount - 1
      }
      toIndex(targetIndex, next)
    },
    [activeIndex, childCount, toIndex]
  )

  const dotsOnClick = useCallback(
    (target: number) => {
      toIndex(target, target > activeIndex)
    },
    [activeIndex, toIndex]
  )

  return (
    <div
      ref={ref}
      role={role}
      className={cls}
      {...rest}
      onMouseEnter={() => setIsInHoverComponent(true)}
      onMouseLeave={() => setIsInHoverComponent(false)}
    >
      <div className={`${prefixCls}__wrapper`}>
        <div
          className={`${prefixCls}__content`}
          ref={contentRef}
          onTransitionEnd={() => setIsInAnimation(false)}
        >
          {groupChildren}
        </div>
        {showArrows && !isDisabledAllInteract && (
          <Arrows
            size={arrowSize}
            onClick={arrowOnClick}
            prefixCls={prefixCls}
            inAnimation={isInAnimation}
          />
        )}
        {showPages && (
          <div className={`${prefixCls}__page-number`}>{`${activeIndex + 1} / ${childCount}`}</div>
        )}
        {showDots && !isDisabledAllInteract && dotPosition !== 'outer' && (
          <Dots
            position={dotPosition}
            type={dotType}
            activeIndex={activeIndex}
            count={childCount}
            prefixCls={prefixCls}
            inAnimation={isInAnimation}
            onClick={dotsOnClick}
          />
        )}
      </div>
      {/* 在外部的时候，需要占用dom实际空间，所以不能再放到 wrapper 中 */}
      {showDots && !isDisabledAllInteract && dotPosition === 'outer' && (
        <Dots
          position={dotPosition}
          type={dotType}
          activeIndex={activeIndex}
          count={childCount}
          prefixCls={prefixCls}
          inAnimation={isInAnimation}
          onClick={dotsOnClick}
        />
      )}
    </div>
  )
})

if (__DEV__) {
  Carousel.displayName = 'Carousel'
}
