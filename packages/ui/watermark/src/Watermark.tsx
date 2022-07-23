import React, { useEffect, forwardRef, useState } from 'react'
import Portal from '@hi-ui/portal'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { WatermarkGenerator } from './utils'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { useMergeRefs } from '@hi-ui/use-merge-refs'

import { isUndef } from '@hi-ui/type-assertion'

const _role = 'watermark'
export const watermarkPrefix = getPrefixCls(_role)

/**
 * TODO: What is Watermark
 */
export const Watermark = forwardRef<HTMLDivElement | null, WatermarkProps>((props, ref) => {
  const {
    prefixCls = watermarkPrefix,
    role = _role,
    children,
    style,
    className,
    container,
    logo,
    color,
    allowCopy = false,
    density = 'default',
    opacity = 1,
    content: contentProp,
    zIndex = 1100,
    fontSize = 14,
    grayscale = true,
    textOverflowEffect = 'zoom',
    ...rest
  } = props

  const i18n = useLocaleContext()

  const content = isUndef(contentProp) ? i18n.get('watermark.content') : contentProp

  const cls = cx(prefixCls, className)
  const [waterMarkElement, setWaterMarkElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!waterMarkElement) return
    const options = {
      logo,
      density,
      opacity,
      content,
      zIndex,
      fontSize,
      grayscale,
      textOverflowEffect,
      color,
    }

    const genWatermark = new WatermarkGenerator()
    genWatermark.render(waterMarkElement, options)
    return () => {
      genWatermark.destroy()
    }
  }, [
    logo,
    density,
    opacity,
    content,
    zIndex,
    waterMarkElement,
    fontSize,
    grayscale,
    textOverflowEffect,
    color,
  ])

  const child = (
    <div
      ref={useMergeRefs(setWaterMarkElement, ref)}
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

  return container ? <Portal container={container}>{child}</Portal> : child
})

export interface WatermarkProps extends HiBaseHTMLProps<'div'> {
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
  density?: 'default' | 'low' | 'high'
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
   * 水印层级
   */
  zIndex?: number
  /**
   * 水印文字大小
   */
  fontSize?: number
  /**
   * 开启水印灰度化
   */
  grayscale?: boolean
  /**
   * 文本长度超出画布长度时的处理方式，zoom - 缩小文字   cut - 截断文字  wrap - 换行
   */
  textOverflowEffect?: 'zoom' | 'wrap' | 'cut'
  /**
   * 水印文字颜色，建议使用低透明度的 rgba 值
   */
  color?: string
}

if (__DEV__) {
  Watermark.displayName = 'Watermark'
}
