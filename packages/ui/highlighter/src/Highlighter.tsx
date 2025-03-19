import React, { forwardRef, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const HIGHLIGHTER_PREFIX = getPrefixCls('highlighter')

/**
 * 高亮文本内容
 */
export const Highlighter = forwardRef<HTMLSpanElement | null, HighlighterProps>(
  (
    {
      prefixCls = HIGHLIGHTER_PREFIX,
      className,
      keyword,
      highlightClassName,
      highlightStyle,
      children = null,
      ...rest
    },
    ref
  ) => {
    const startIndex = useRef(0)
    startIndex.current = 0

    if (!keyword) return children!
    if (typeof children !== 'string') return children as any

    // 支持多个匹配高亮
    const parts = children.split(keyword)
    const matches = children.match(keyword)

    // 未匹配到
    if (parts.length < 2) return children

    const lastPart = parts.pop()

    const cls = cx(prefixCls, className)

    // TODO: 容器宽度有限但文本过长时，自动适配关键词到可见区域
    return (
      <span ref={ref} className={cls} {...rest}>
        {parts.reduce((acc, part, index) => {
          const matched = typeof keyword === 'string' ? keyword : matches![index]
          startIndex.current += part.length
          acc.push(part)
          acc.push(
            <span
              key={index}
              className={`${prefixCls}--matched ${highlightClassName}`}
              style={highlightStyle}
            >
              {children.substring(startIndex.current, startIndex.current + matched.length)}
            </span>
          )
          startIndex.current += matched.length
          return acc
        }, [] as any[])}
        {lastPart}
      </span>
    )
  }
)

export interface HighlighterProps extends HiBaseHTMLProps<'span'> {
  /**
   * 匹配高亮关键词
   */
  keyword?: string | RegExp
  /**
   * 高亮类名
   */
  highlightClassName?: string
  /**
   * 高亮样式
   */
  highlightStyle?: React.CSSProperties
}

if (__DEV__) {
  Highlighter.displayName = 'Highlighter'
}
