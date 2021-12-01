import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useSlider, UseSliderProps } from './use-slider'
import { useMergeRefs } from '@hi-ui/use-merge-refs'

const SLIDER_PREFIX = getPrefixCls('slider')

/**
 * TODO: What is Slider
 */
export const Slider = forwardRef<HTMLDivElement | null, SliderProps>(
  ({ prefixCls = SLIDER_PREFIX, role = 'slider', className, children, ...rest }, ref) => {
    const {
      rootProps,
      getRailProps,
      getTrackProps,
      getHandleProps,
      getMarkProps,
      getMarkLabelProps,
    } = useSlider(rest)

    const cls = cx(prefixCls, className)

    return (
      <div role={role} className={cls} {...rootProps} ref={useMergeRefs(rootProps.ref, ref)}>
        <div className={`${prefixCls}__rail`} {...getRailProps()} />
        <div className={`${prefixCls}__track`} {...getTrackProps()} />
        <div className={`${prefixCls}__handle`} {...getHandleProps()} />
        <div className={`${prefixCls}__marks`}>
          {[].map((mark, idx) => {
            return <span key={idx} className={`${prefixCls}__mark`} {...getMarkProps(mark)} />
          })}
        </div>
        <div className={`${prefixCls}__labels`}>
          {[].map((mark, idx) => {
            return <span key={idx} className={`${prefixCls}__label`} {...getMarkLabelProps(mark)} />
          })}
        </div>
      </div>
    )
  }
)

export interface SliderProps extends HiBaseHTMLProps<'div'>, UseSliderProps {}

if (__DEV__) {
  Slider.displayName = 'Slider'
}
