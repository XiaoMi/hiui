import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { cx } from '@hi-ui/classname'
// import { UpOutlined, DownOutlined } from '@hi-ui/icons'

export interface SelectorItem {
  title: string
  disabled: boolean
  id: string
}

export enum SelectorPosition {
  left = 'left',
  right = 'right',
  middle = 'middle',
  single = 'single',
}
interface SelectorProps {
  prefix: string
  value: string
  data: SelectorItem[]
  onChange: (item: SelectorItem) => void
  // itemHeight: number
  // // 必须为奇数
  // fullDisplayItemNumber: number
  position: SelectorPosition
}

export const Selector: FC<SelectorProps> = (props) => {
  const { prefix, value, data, onChange, /* itemHeight, fullDisplayItemNumber, */ position } = props
  const componentPrefix = `${prefix}__selector`
  const stopScrollTimeoutHandler = useRef(-1)
  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const topItemGagerRef = useRef<HTMLDivElement | null>(null)
  const bottomItemGagerRef = useRef<HTMLDivElement | null>(null)

  const lastValueMatchIndexCache = useRef(-1)

  const calcCurrentIndex = useCallback((scrollTop: number) => {
    return Math.round(
      scrollTop /
        (topItemGagerRef.current!.clientHeight +
          (bottomItemGagerRef.current!.offsetTop -
            topItemGagerRef.current!.offsetTop -
            topItemGagerRef.current!.clientHeight))
    )
  }, [])

  const scrollToMatchIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        index *
        (topItemGagerRef.current!.clientHeight +
          (bottomItemGagerRef.current!.offsetTop -
            topItemGagerRef.current!.offsetTop -
            topItemGagerRef.current!.clientHeight))
    }
  }, [])

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      e.persist()
      e.stopPropagation()
      // 清除用做判断是否滚动停止的定时器
      clearTimeout(stopScrollTimeoutHandler.current)
      // 计算当前选中的 index 下标
      let currentIndex = calcCurrentIndex((e.target as HTMLDivElement).scrollTop)
      if (currentIndex > data.length) {
        currentIndex = data.length - 1
      }

      // 200ms 后如果事件没有再次响应，则视作滚动停止
      // 不论是否禁用，我们都需要自动滚动到对应 index
      stopScrollTimeoutHandler.current = (setTimeout(() => {
        scrollToMatchIndex(currentIndex)
        // 通知外部改变
        // 如果当前 item 被禁用了，则无通知
        if (!data[currentIndex].disabled) {
          onChange(data[currentIndex])
        }
      }, 200) as unknown) as number
    },
    [calcCurrentIndex, data, onChange, scrollToMatchIndex]
  )

  const onItemClick = useCallback(
    (item: SelectorItem, index: number) => {
      if (!item.disabled) {
        onChange(item)
      }
    },
    [onChange]
  )

  useEffect(() => {
    const currentIndex = data.findIndex((item) => item.id === value)
    // 避免非法值跳转
    // 避免重复执行操作，只有当 value 对应的下标改变的时候才需要执行
    if (currentIndex >= 0 && lastValueMatchIndexCache.current !== currentIndex) {
      lastValueMatchIndexCache.current = currentIndex
      scrollToMatchIndex(currentIndex)
    }
  }, [data, value, scrollToMatchIndex])

  return (
    <div className={cx(componentPrefix, `${componentPrefix}--position-${position}`)}>
      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        // 此处使用了取巧的办法
        // 将 item 与 scroll-part 部分共享一个 demarcate 划分界限
        className={cx(`${componentPrefix}__scroll-part`, `${componentPrefix}__demarcate`)}
      >
        {data.map((item, index) => (
          <div
            className={cx(`${componentPrefix}__item`, `${componentPrefix}__demarcate`, {
              [`${componentPrefix}__item--disabled`]: item.disabled,
              [`${componentPrefix}__item--active`]: item.id === value,
            })}
            key={item.id}
            onClick={() => onItemClick(item, index)}
          >
            {item.title}
          </div>
        ))}
        {/* 测量者，用于测量 Item 高度以及间距 */}
        <div
          style={{
            pointerEvents: 'none',
            opacity: '0',
            position: 'absolute',
            zIndex: -1,
            left: '0',
            top: '0',
          }}
        >
          <div className={`${componentPrefix}__demarcate`} ref={topItemGagerRef} />
          <div className={`${componentPrefix}__demarcate`} ref={bottomItemGagerRef} />
        </div>
      </div>
    </div>
  )
}
