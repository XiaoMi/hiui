import React, { useEffect, forwardRef, useState } from 'react'
import Portal from '../../portal'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { WatermarkGenerator } from './utils'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
const _role = 'watermark'
export const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Watermark
 */
export const Watermark = forwardRef<HTMLDivElement | null, WatermarkProps>((props, ref) => {
  const {
    prefixCls = _prefix,
    role = _role,
    children,
    style,
    className,
    allowCopy,
    container,
    logo = '',
    density = 'default',
    opacity = 1,
    content = '请勿外传',
    zIndex = 1000,
    ...rest
  } = props
  const cls = cx(prefixCls, className)
  const [waterMarkElement, setWaterMarkElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!waterMarkElement) return
    const options = { logo, density, opacity, content, zIndex }
    const genWatermark = new WatermarkGenerator()
    genWatermark.render(waterMarkElement, options)
    return () => {
      genWatermark.destroy()
    }
  }, [logo, density, opacity, content, zIndex, waterMarkElement])

  const renderWatermark = () => {
    return (
      <div
        ref={setWaterMarkElement}
        role={role}
        className={cls}
        style={{
          ...style,
          userSelect: allowCopy ? 'text' : 'none',
        }}
        {...rest}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      {container ? <Portal container={container}>{renderWatermark()}</Portal> : renderWatermark()}
    </>
  )
})

export interface WatermarkProps extends HiBaseHTMLProps<'div'> {
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
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 水印挂载的容器
   */
  container?: HTMLElement
  /**
   * 图片资源地址
   */
  logo?: string | null
  /**
   * 水印间距，调节疏密程度
   */
  density?: string
  /**
   * 水印透明度
   */
  opacity?: number
  /**
   * 水印文案，传入数组代表多行，不建议超过三行
   */
  content?: string[] | string
  /**
   * 是否允许拷贝
   */
  allowCopy?: boolean
  /**
   * React.Children
   */
  children?: React.ReactNode
  /**
   * 水印层级
   */
  zIndex?: number
}

if (__DEV__) {
  Watermark.displayName = 'Watermark'
}
