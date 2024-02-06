import React, { useMemo } from 'react'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'
import { CarouselArrowSizeEnum } from './types'
import { cx } from '@hi-ui/classname'

interface ArrowsProps {
  size: CarouselArrowSizeEnum
  onClick: (next: boolean, evt: React.MouseEvent) => void
  prefixCls: string
  inAnimation: boolean
}

export const Arrows = (props: ArrowsProps) => {
  const { size, onClick, prefixCls, inAnimation } = props

  const buttonCls = useMemo(
    () => cx(`${prefixCls}__arrows-button`, `${prefixCls}__arrows-button--${size}`),
    [prefixCls, size]
  )

  return (
    <React.Fragment>
      <div
        className={cx(buttonCls, `${prefixCls}__arrows-button--left`)}
        onClick={(evt) => {
          if (!inAnimation) {
            onClick(false, evt)
          }
        }}
      >
        <LeftOutlined />
      </div>
      <div
        className={cx(buttonCls, `${prefixCls}__arrows-button--right`)}
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
