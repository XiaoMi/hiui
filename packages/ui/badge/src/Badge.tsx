import React, { forwardRef, useMemo, isValidElement, cloneElement } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isNullish } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('badge')

/**
 * TODO: What is Badge
 *
 * 1. 数字滚动展示
 * 2. visible 显隐动效
 * 3. 设置大小
 */
export const Badge = forwardRef<HTMLSpanElement | null, BadgeProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      type = 'bubble',
      max = 99,
      offset,
      content,
      color,
      visible = true,
      style,
      ...rest
    },
    ref
  ) => {
    const badgeStyle = useMemo(() => {
      const style: React.CSSProperties = {
        backgroundColor: color,
      }

      if (Array.isArray(offset)) {
        invariant(typeof offset[0] === 'number', 'The offset[0] prop should be number array.')
        invariant(typeof offset[1] === 'number', 'The offset[1] prop should be number array.')

        style.marginTop = offset[1]
        style.marginRight = -offset[0]
      }

      return style
    }, [offset, color])

    const count = useMemo(() => {
      if (typeof content !== 'number') return content

      if (typeof max !== 'number') {
        invariant(false, 'The max prop should be number.')
        return content
      }

      return content > max ? `${max}+` : content
    }, [content, max])

    const badgeNode = useMemo(() => {
      if (type === 'dot') {
        return <span className={`${prefixCls}__dot`} style={badgeStyle} />
      }

      if (isValidElement(count)) {
        return cloneElement(count, {
          // @ts-ignore
          style: {
            ...badgeStyle,
            // @ts-ignore
            ...count.props.style,
          },
          // @ts-ignore
          className: cx(count.props.className, `${prefixCls}__custom`),
        })
      }

      return <span className={`${prefixCls}__value`} style={badgeStyle} children={count} />
    }, [type, prefixCls, badgeStyle, count])

    const cls = cx(prefixCls, className, isNullish(children) && `${prefixCls}--independent`)

    return (
      <span ref={ref} className={cls} style={style} title={count as string} {...rest}>
        {children}
        {visible ? badgeNode : null}
      </span>
    )
  }
)

export interface BadgeProps extends HiBaseHTMLProps<'span'> {
  /**
   * 气泡显示内容
   */
  content?: React.ReactNode
  /**
   * 气泡显示的形态，可选带文字的气泡或小红点
   */

  type?: 'bubble' | 'dot'
  /**
   * 气泡显示的最大值，超过值用'+'号替代
   */
  max?: number
  /**
   * 是否显示气泡
   */
  visible?: boolean
  /**
   * 气泡颜色
   */
  color?: string
  /**
   * 设置状态点的位置偏移
   */
  offset?: [left: number, top: number]
}

if (__DEV__) {
  Badge.displayName = 'Badge'
}
