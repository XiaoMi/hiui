import React, { useEffect, forwardRef, useState } from 'react'
import Portal from '@hi-ui/portal'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { WatermarkGenerator } from './utils'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useMergeRefs } from '@hi-ui/use-merge-refs'

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
    zIndex = 1100,
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

  const Wrapper = container ? Portal : React.Fragment

  return (
    <Wrapper container={container}>
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
    </Wrapper>
  )
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
}

if (__DEV__) {
  Watermark.displayName = 'Watermark'
}
