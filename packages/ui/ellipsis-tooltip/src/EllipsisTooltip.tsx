import React, { FC, useRef, useState, useCallback, useMemo, ReactNode, isValidElement } from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Tooltip, { TooltipProps } from '@hi-ui/tooltip'

const ELLIPSIS_TOOLTIP_PREFIX = getPrefixCls('ellipsis-tooltip')

// 格式化子文本，超出规定字数时展示...
const formatChildText = (text: string = '', maxTextCount: number) => {
  const stringText = text?.toString()
  const canTooltip = maxTextCount > 0 && stringText?.length > maxTextCount
  return canTooltip ? `${stringText.slice(0, maxTextCount)}...` : text
}

const extractTextFromReactNode = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (node === null || node === undefined || typeof node === 'boolean') {
    return ''
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join('')
  }

  if (React.isValidElement(node)) {
    // 如果是 React 元素，递归处理其 children
    return extractTextFromReactNode(node.props.children)
  }

  return ''
}

/**
 * 这是一个文字超出后，展示省略号，并且鼠标悬停时出现全部描述的组件
 */
export const EllipsisTooltip: FC<EllipsisTooltipProps> = ({
  prefixCls = ELLIPSIS_TOOLTIP_PREFIX,
  role = 'ellipsis-tooltip',
  className,
  children: childrenProp,
  numberOfLines = 1,
  maxTextCount = 0,
  tooltipProps,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(tooltipProps?.visible ?? false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const stringChildren = useMemo(() => {
    if (typeof childrenProp === 'string' || typeof childrenProp === 'number') {
      return String(childrenProp)
    }

    if (isValidElement(childrenProp)) {
      return extractTextFromReactNode(childrenProp)
    }

    return ''
  }, [childrenProp])

  // 检查文本超出省略号
  const handleCheckEllipsis = useCallback(() => {
    if (contentRef.current) {
      const rect = contentRef.current?.getBoundingClientRect()

      // 多行超出
      if (numberOfLines > 1) {
        const style = globalThis.getComputedStyle(contentRef.current, null)
        const { height } = rect
        const lineHeight = style.lineHeight === 'normal' ? style.fontSize : style.lineHeight
        const textLines = Math.round(height / parseFloat(lineHeight))
        setTooltipVisible(textLines > numberOfLines)
      } else {
        // 单行超出
        const parentRect = (contentRef.current?.parentNode as HTMLElement)?.getBoundingClientRect()
        setTooltipVisible(rect?.width > parentRect.width)
      }
    }
  }, [numberOfLines])

  const update = useCallback(() => {
    // 当文字字数超出有配置时，单独处理
    if (maxTextCount > 0 && maxTextCount < stringChildren?.length) {
      setTooltipVisible(true)
    } else {
      handleCheckEllipsis()
    }
  }, [handleCheckEllipsis, maxTextCount, stringChildren?.length])

  const cls = cx(
    prefixCls,
    className,
    {
      // maxTextCount 没有设置时，才做单行隐藏
      [`${prefixCls}--single`]: maxTextCount === 0 && (!numberOfLines || numberOfLines <= 1),
      [`${prefixCls}--multiple`]: numberOfLines > 1,
    },
    `${prefixCls}--${tooltipVisible ? 'available' : 'disabled'}`
  )

  return (
    <Tooltip visible={tooltipVisible} {...{ title: stringChildren, ...tooltipProps }}>
      <div
        role={role}
        className={cls}
        style={{ WebkitLineClamp: numberOfLines > 1 ? numberOfLines : undefined }}
      >
        <span
          ref={contentRef}
          onMouseEnter={() => update()}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {React.isValidElement(childrenProp)
            ? childrenProp
            : formatChildText(stringChildren, maxTextCount)}
        </span>
      </div>
    </Tooltip>
  )
}

export interface EllipsisTooltipProps extends HiBaseHTMLProps<'div'> {
  /**
   * 超出行数展示省略号，children 是 string 类型时有效
   */
  numberOfLines?: number
  /**
   * 最大文字展示，children 是 string 类型时有效
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
