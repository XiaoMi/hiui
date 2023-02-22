import React, { forwardRef, useMemo, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useSlider, UseSliderProps } from './use-slider'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { Tooltip, TooltipHelpers } from '@hi-ui/tooltip'
import { isFunction, isObject } from '@hi-ui/type-assertion'

const SLIDER_PREFIX = getPrefixCls('slider')

/**
 * TODO: What is Slider
 * TODO:
 * 1. 计算偏移 bug
 * 2. 支持 reversed
 * 2. 添加 RangeSlider 新组件
 */
export const Slider = forwardRef<HTMLDivElement | null, SliderProps>(
  (
    {
      prefixCls = SLIDER_PREFIX,
      role = 'slider',
      className,
      children,
      tipFormatter,
      showRangeLabel = false,
      marks: marksProp,
      ...rest
    },
    ref
  ) => {
    const tooltipRef = useRef<TooltipHelpers>(null)

    const {
      value,
      min,
      max,
      disabled,
      vertical,
      tooltipVisible,
      rootProps,
      getRailProps,
      getTrackProps,
      getHandleProps,
      getMarkProps,
      getMarkLabelProps,
    } = useSlider(rest, tooltipRef.current)

    const cls = cx(
      prefixCls,
      className,
      disabled && `${prefixCls}--disabled`,
      vertical ? `${prefixCls}--vertical` : `${prefixCls}--horizontal`
    )

    const marksMemo = useMemo(() => {
      if (isObject(marksProp)) {
        return Object.entries(marksProp).map(([value, content]) => {
          return { value, content }
        })
      }
      return []
    }, [marksProp])

    return (
      <div role={role} className={cls} {...rootProps} ref={useMergeRefs(rootProps.ref, ref)}>
        <div className={`${prefixCls}__rail`} {...getRailProps()} />
        <div className={`${prefixCls}__track`} {...getTrackProps()} />
        <div className={`${prefixCls}__handle`} {...getHandleProps()}>
          <Tooltip
            innerRef={tooltipRef}
            visible={tooltipVisible}
            title={
              <div style={{ textAlign: 'center' }}>
                {isFunction(tipFormatter) ? tipFormatter(value) : value}
              </div>
            }
          >
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            />
          </Tooltip>
        </div>
        <div className={`${prefixCls}__marks`}>
          {marksMemo.map((mark, idx) => {
            return <span key={idx} className={`${prefixCls}__mark`} {...getMarkProps(mark)} />
          })}
        </div>
        <div className={`${prefixCls}__labels`}>
          {marksMemo.map((mark, idx) => {
            return <span key={idx} className={`${prefixCls}__label`} {...getMarkLabelProps(mark)} />
          })}

          {showRangeLabel
            ? [
                min !== undefined ? (
                  <span
                    key={0}
                    className={cx(`${prefixCls}__label`, `${prefixCls}__min`)}
                    {...getMarkLabelProps({ value: min, content: min })}
                  />
                ) : null,
                max !== undefined ? (
                  <span
                    key={1}
                    className={cx(`${prefixCls}__label`, `${prefixCls}__max`)}
                    {...getMarkLabelProps({ value: max, content: max })}
                  />
                ) : null,
              ]
            : null}
        </div>
      </div>
    )
  }
)

export interface SliderProps extends HiBaseHTMLProps<'div'>, UseSliderProps {
  /**
   * 自定义 Tooltip 中显示文案
   */
  tipFormatter?: (value: number) => React.ReactNode
  /**
   * 是否显示范围label
   */
  showRangeLabel?: boolean
  /**
   * 刻度标记，key 的类型必须为 number，且取值在闭区间 [min, max] 内
   */
  marks?: Record<number, any>
  /**
   * 自定义颜色
   */
  color?: string
}

if (__DEV__) {
  Slider.displayName = 'Slider'
}
