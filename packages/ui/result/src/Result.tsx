import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@hi-ui/icons'
import { isNullish, isUndefined } from '@hi-ui/type-assertion'
import { ResultTypeEnum } from './types'

const RESULT_PREFIX = getPrefixCls('result')

const ImageSizeMap = {
  [HiBaseSizeEnum.SM]: { width: '64px', height: '64px' },
  [HiBaseSizeEnum.MD]: { width: '88px', height: '88px' },
  [HiBaseSizeEnum.LG]: { width: '114px', height: '114px' },
}

const ImageContainerSizeMap = {
  [HiBaseSizeEnum.SM]: { width: '100px', height: '100px' },
  [HiBaseSizeEnum.MD]: { width: '140px', height: '140px' },
  [HiBaseSizeEnum.LG]: { width: '180px', height: '180px' },
}

/**
 * Result(结果页):用于反馈一系列操作任务的处理结果
 */
export const Result = forwardRef<HTMLDivElement | null, ResultProps>(
  (
    {
      prefixCls = RESULT_PREFIX,
      role = 'result',
      className,
      image,
      imageSize = 'md',
      type = 'info',
      title,
      content,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const renderImage = () => {
      const IconMap = {
        [ResultTypeEnum.info]: (
          <ExclamationCircleFilled style={{ ...ImageSizeMap[imageSize], color: '#237ffa' }} />
        ),
        [ResultTypeEnum.success]: (
          <CheckCircleFilled style={{ ...ImageSizeMap[imageSize], color: '#14ca64' }} />
        ),
        [ResultTypeEnum.warn]: (
          <ExclamationCircleFilled style={{ ...ImageSizeMap[imageSize], color: '#fab007' }} />
        ),
        [ResultTypeEnum.error]: (
          <CloseCircleFilled style={{ ...ImageSizeMap[imageSize], color: '#ff5959' }} />
        ),
      }

      // image和type至少有一个是正确的
      if (isNullish(image) && isUndefined(IconMap[type])) {
        invariant(true, 'The image or type ensure that at least one is correct.')
        return
      }

      return (
        <div style={ImageContainerSizeMap[imageSize]} className={`${prefixCls}__image-container`}>
          {image || IconMap[type]}
        </div>
      )
    }

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderImage()}
        <div className={`${prefixCls}__title`}>{title}</div>
        {!isNullish(content) && <div className={`${prefixCls}__content`}>{content}</div>}
        {!isNullish(children) && <div className={`${prefixCls}__children`}>{children}</div>}
      </div>
    )
  }
)

export interface ResultProps extends HiBaseHTMLProps<'div'> {
  /**
   * 自定义图标、图片
   */
  image?: React.ReactNode
  /**
   * 自定义图标/图片尺寸
   */
  imageSize?: HiBaseSizeEnum
  /**
   * 组件类型
   */
  type?: ResultTypeEnum
  /**
   * 标题
   */
  title: React.ReactNode
  /**
   * 内容
   */
  content?: React.ReactNode
}

if (__DEV__) {
  Result.displayName = 'Result'
}

export * from './icons/index'
