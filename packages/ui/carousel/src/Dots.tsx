import React, { useMemo } from 'react'
import { CarouselDotPlacementEnum, CarouselDotTypeEnum } from './types'
import { cx } from '@hi-ui/classname'

interface DotsProps {
  position: CarouselDotPlacementEnum
  type: CarouselDotTypeEnum
  prefixCls: string
  activeIndex: number
  count: number
  onClick: (index: number, evt: React.MouseEvent) => void
  inAnimation: boolean
}

export const Dots = (props: DotsProps) => {
  const { prefixCls, position, type, count, activeIndex, inAnimation, onClick } = props

  const componentPrefixCls = useMemo(() => `${prefixCls}__dots`, [prefixCls])

  const componentClass = useMemo(
    () =>
      cx(
        componentPrefixCls,
        `${componentPrefixCls}--position-${position}`,
        `${componentPrefixCls}--type-${type}`
      ),
    [componentPrefixCls, position, type]
  )

  const items = useMemo(() => {
    const result: React.ReactNode[] = []
    for (let counter = 0; counter < count; counter++) {
      result.push(
        <div
          key={counter}
          className={cx(
            `${componentPrefixCls}__item`,
            counter === activeIndex && `${componentPrefixCls}__item--active`
          )}
          onClick={(evt: React.MouseEvent) => {
            if (!inAnimation && activeIndex !== counter) {
              onClick(counter, evt)
            }
          }}
        />
      )
    }
    return result
  }, [activeIndex, componentPrefixCls, count, inAnimation, onClick])

  return (
    <div className={componentClass}>
      <div className={`${componentPrefixCls}__content`}>{items}</div>
    </div>
  )
}
