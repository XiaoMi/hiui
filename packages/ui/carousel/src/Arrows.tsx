import React from 'react'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'
import { CarouselArrowSizeEnum } from './types'
import { cx } from '@hi-ui/classname'

interface ArrowsProps {
  size: CarouselArrowSizeEnum
  onClick: (next: boolean, evt: React.MouseEvent) => void
  prefixCls: string
  inAnimation: boolean
  direction: 'horizontal' | 'vertical'
}

export const Arrows = (props: ArrowsProps) => {
  const { size, onClick, prefixCls, inAnimation, direction = 'horizontal' } = props

  const buttonCls = cx(
    `${prefixCls}__arrows-button`,
    `${prefixCls}__arrows-button--${size}`,
    `${prefixCls}__arrows-button--${direction}`
  )

  return (
    <React.Fragment>
      <div
        className={cx(buttonCls, `${prefixCls}__arrows-button--start`)}
        onClick={(evt) => {
          if (!inAnimation) {
            onClick(false, evt)
          }
        }}
      >
        <LeftOutlined />
      </div>
      <div
        className={cx(buttonCls, `${prefixCls}__arrows-button--end`)}
        onClick={(evt) => {
          if (!inAnimation) {
            onClick(true, evt)
          }
        }}
      >
        <RightOutlined />
      </div>
    </React.Fragment>
  )
}
