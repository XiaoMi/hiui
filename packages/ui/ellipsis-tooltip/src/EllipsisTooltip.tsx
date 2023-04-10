import React, { FC, useRef, useState, useEffect, useCallback } from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Tooltip, { TooltipProps } from '@hi-ui/tooltip'

const ELLIPSIS_TOOLTIP_PREFIX = getPrefixCls('ellipsis-tooltip')

// 格式化子文本，超出规定字数时展示...
const formatChildText = (text: string, maxTextCount: number) => {
  const stringText = text?.toString()
  const canTooltip = maxTextCount > 0 && stringText.length > maxTextCount
  return canTooltip ? `${stringText.slice(0, maxTextCount)}...` : text
}

/**
 * 这是一个文字超出后，展示省略号，并且鼠标悬停时出现全部描述的组件
 */
export const EllipsisTooltip: FC<EllipsisTooltipProps> = ({
  prefixCls = ELLIPSIS_TOOLTIP_PREFIX,
  role = 'ellipsis-tooltip',
  className,
  children,
  numberOfLines = 1,
  maxTextCount = 0,
  tooltipProps,
}) => {
  const cls = cx(prefixCls, className, {
    // maxTextCount 没有设置时，才做单行隐藏
    [`${prefixCls}--single`]: maxTextCount === 0 && (!numberOfLines || numberOfLines <= 1),
    [`${prefixCls}--multiple`]: numberOfLines > 1,
  })

  const [disableTooltip, setDisableTooltip] = useState(true)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // 检查文本超出省略号
  const handleCheckEllipsis = useCallback(() => {
    if (contentRef.current) {
      // 多行超出
      if (numberOfLines > 1) {
        const style = window.getComputedStyle(contentRef.current, null)
        const fontSize = style.fontSize
        const lineHeight: number = style.lineHeight === 'normal' ? +fontSize : +style.lineHeight
        const textLines = Math.round(+style.height / lineHeight)
        setDisableTooltip(textLines <= numberOfLines)
      } else {
        // 单行超出
        const rect = contentRef.current?.getBoundingClientRect()
        const parentRect = (contentRef.current?.parentNode as HTMLElement)?.getBoundingClientRect()
        setDisableTooltip(+rect?.width <= parentRect.width)
      }
    }
  }, [numberOfLines])

  useEffect(() => {
    // 当文字字数超出有配置时，单独处理
    if (maxTextCount > 0 && maxTextCount < children?.length) {
      setDisableTooltip(false)
    } else {
      handleCheckEllipsis()
    }
  }, [children, maxTextCount, handleCheckEllipsis])

  return (
    <Tooltip disabled={disableTooltip} {...{ title: children, ...tooltipProps }}>
      <div
        role={role}
        className={cls}
        style={{ WebkitLineClamp: numberOfLines > 1 ? numberOfLines : undefined }}
      >
        <span ref={contentRef}>{formatChildText(children, maxTextCount)}</span>
      </div>
    </Tooltip>
  )
}

export interface EllipsisTooltipProps extends HiBaseHTMLProps<'div'> {
  /**
   * 子文本，待处理文本内容
   */
  children: string
  /**
   * 超出行数展示省略号
   */
  numberOfLines?: number
  /**
   * 最大文字展示
   */
  maxTextCount?: number
  /**
   * tooltip 属性收敛
   */
  tooltipProps?: Partial<TooltipProps>
}

if (__DEV__) {
  EllipsisTooltip.displayName = 'EllipsisTooltip'
}
