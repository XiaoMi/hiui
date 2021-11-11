import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { cx } from '@hi-ui/classname'
import { UpOutlined, DownOutlined } from '@hi-ui/icons'

export interface SelectorItem {
  title: string
  disabled: boolean
  id: string
}
interface SelectorProps {
  prefix: string
  value: string
  data: SelectorItem[]
  onChange: (item: SelectorItem) => void
  itemHeight: number
  // 必须为奇数
  fullDisplayItemNumber: number
}

export const Selector: FC<SelectorProps> = (props) => {
  const { prefix, value, data, onChange, itemHeight, fullDisplayItemNumber } = props
  const componentPrefix = `${prefix}__selector`
  const stopScrollTimeoutHandler = useRef(-1)
  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const safePadding = useMemo(() => ((fullDisplayItemNumber - 1) * itemHeight) / 2, [
    fullDisplayItemNumber,
    itemHeight,
  ])

  const calcCurrentIndex = useCallback(
    (scrollTop: number) => {
      return Math.floor(
        (scrollTop - safePadding + (fullDisplayItemNumber * itemHeight) / 2) / itemHeight
      )
    },
    [safePadding, itemHeight, fullDisplayItemNumber]
  )

  const scrollToMatchIndex = useCallback(
    (index: number) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = index * itemHeight
      }
    },
    [itemHeight]
  )

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
        if (data[currentIndex].id !== value && !data[currentIndex].disabled) {
          onChange(data[currentIndex])
        }
      }, 200) as unknown) as number
    },
    [calcCurrentIndex, data, onChange, value, scrollToMatchIndex]
  )

  const onItemClick = useCallback(
    (item: SelectorItem, index: number) => {
      if (item.id !== value && !item.disabled) {
        onChange(item)
      }
    },
    [onChange, value]
  )

  const onShortcutClick = useCallback(
    (isLast: boolean) => {
      const currentIndex = data.findIndex((item) => item.id === value)
      let target = currentIndex
      if (isLast && currentIndex !== 0) {
        for (let counter = currentIndex - 1; counter >= 0; counter--) {
          if (!data[counter].disabled) {
            target = counter
            break
          }
        }
      } else if (!isLast && currentIndex !== data.length - 1) {
        for (let counter = currentIndex + 1; counter <= data.length - 1; counter++) {
          if (!data[counter].disabled) {
            target = counter
            break
          }
        }
      }

      if (target !== currentIndex) {
        onChange(data[target])
      }
    },
    [data, value, onChange]
  )

  useEffect(() => {
    const currentIndex = data.findIndex((item) => item.id === value)
    scrollToMatchIndex(currentIndex)
  }, [data, value, scrollToMatchIndex])

  return (
    <div className={componentPrefix}>
      <div className={`${componentPrefix}__shortcut`} onClick={() => onShortcutClick(true)}>
        <UpOutlined />
      </div>
      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className={`${componentPrefix}__scroll-part`}
        style={{ height: `${fullDisplayItemNumber * itemHeight}px`, padding: `${safePadding}px 0` }}
      >
        {data.map((item, index) => (
          <div
            className={cx(`${componentPrefix}__item`, {
              [`${componentPrefix}__item--disabled`]: item.disabled,
              [`${componentPrefix}__item--active`]: item.id === value,
            })}
            key={item.id}
            onClick={() => onItemClick(item, index)}
            style={{ height: `${itemHeight}px` }}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className={`${componentPrefix}__indicator`} style={{ height: `${itemHeight}px` }} />
      <div className={`${componentPrefix}__shortcut`} onClick={() => onShortcutClick(false)}>
        <DownOutlined />
      </div>
    </div>
  )
}
