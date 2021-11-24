import React, { useState, useCallback, useMemo } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Popper, { PopperProps } from '@hi-ui/popper'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const _role = 'tooltip'
const _prefix = getPrefixCls(_role)

const tooltipInstance: Record<string, HTMLDivElement> = {}

const open = (target: HTMLElement | null, tooltipProps: TooltipProps, key: string): void => {
  const mountNode = document.createElement('div')
  const { title, placement = 'top', prefixCls = _prefix, overlayClassName } = tooltipProps
  const cls = cx(prefixCls, overlayClassName)
  render(
    <Popper className={cls} visible attachEl={target} placement={placement} arrow>
      <div className={`${prefixCls}__content`}>{title}</div>
    </Popper>,
    mountNode
  )
  tooltipInstance[key] = mountNode
}
const close = (key: string): void => {
  const instance = tooltipInstance[key]
  if (instance) {
    unmountComponentAtNode(instance)
    instance.parentNode?.removeChild(instance)
  }
}

/**
 * TODO: What is Tooltip
 */

// TODO:需要考虑 children 禁用的情况
// TODO:需要考虑 children 为数组的情况
// TODO:考虑 delay 消失的情况
// TODO: 目前 popper 有遮照组件的问题
const TooltipComp: React.FC<TooltipProps> = ({
  prefixCls = _prefix,
  role = _role,
  overlayClassName,
  overlayStyle,
  children,
  title,
  visible,
  placement = 'top',
}) => {
  const cls = cx(prefixCls, overlayClassName)
  const [tipVisible, setTipVisible] = useUncontrolledState(false, visible)
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null)

  const onMouseEnter = useCallback<(event: React.MouseEvent) => void>(
    (e) => {
      if (React.isValidElement(children)) {
        if (children.props.onMouseEnter) {
          children.props.onMouseEnter(e)
        }

        setTipVisible(true)
      }
    },
    [children, setTipVisible]
  )

  const onMouseLeave = useCallback<(event: React.MouseEvent) => void>(
    (e) => {
      if (React.isValidElement(children)) {
        if (children.props.onMouseLeave) {
          children.props?.onMouseLeave(e)
        }

        setTipVisible(false)
      }
    },
    [children, setTipVisible]
  )

  const child = useMemo(() => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { ref: setTriggerRef, onMouseEnter, onMouseLeave })
    } else {
      console.error('The children of Tooltip must be a valid element')
    }
  }, [children, onMouseEnter, onMouseLeave])

  return (
    <>
      {child}
      <Popper attachEl={triggerRef} visible={tipVisible} arrow placement="top" className={cls}>
        <div className={`${prefixCls}__content`}>{title}</div>
      </Popper>
    </>
  )
}
export const Tooltip = Object.assign(TooltipComp, { open, close })

export interface TooltipProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  overlayClassName?: string

  /**
   * 组件的注入选择器类
   */
  overlayStyle?: React.CSSProperties

  /**
   * 是否显示（受控）
   */
  visible?: boolean
  /**
   * 内容
   */
  title: React.ReactNode
  /**
   * 展示位置
   */
  placement?: PopperProps['placement']
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
