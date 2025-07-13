import React, { forwardRef, useMemo, isValidElement, cloneElement, ReactNode } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isNullish } from '@hi-ui/type-assertion'
import { BadgeTypeEnum } from './types'

const _prefix = getPrefixCls('badge')

// 支持字符串和 number hover 显示，其他过滤
const getShowContent = (content: ReactNode) => {
  if (!['number', 'string'].includes(typeof content)) return ''
  return `${content}`
}
/**
 * 红点 / 徽标
 *
 * 红点用来展示新消息的提示，徽标用于展示消息的数量、提示
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
        invariant(typeof offset[0] === 'number', 'The offset[0] prop should be number type.')
        invariant(typeof offset[1] === 'number', 'The offset[1] prop should be number type.')

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
      if (type === BadgeTypeEnum.DOT) {
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

      return (
        <span
          className={`${prefixCls}__value`}
          style={badgeStyle}
          title={getShowContent(content)}
          children={count}
        />
      )
    }, [type, count, prefixCls, badgeStyle, content])

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${type}`,
      isNullish(children) && `${prefixCls}--independent`
    )

    return (
      <span ref={ref} className={cls} style={style} {...rest}>
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

  type?: BadgeTypeEnum
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
