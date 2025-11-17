import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { isNullish, isUndefined } from '@hi-ui/type-assertion'
import {
  InfoCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from '@hi-ui/icons'
import { ResultImageSizeEnum, ResultTypeEnum } from './types'

const RESULT_PREFIX = getPrefixCls('result')

const DEFAULT_ICON_MAP = {
  [ResultTypeEnum.INFO]: InfoCircleFilled,
  [ResultTypeEnum.SUCCESS]: CheckCircleFilled,
  [ResultTypeEnum.WARNING]: ExclamationCircleFilled,
  [ResultTypeEnum.ERROR]: CloseCircleFilled,
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
      imageSize: sizeProp,
      type = 'info',
      title,
      content,
      children,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    let imageSize = sizeProp ?? globalSize ?? 'md'
    if (imageSize === 'xs') {
      imageSize = 'sm'
    }

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--type-${type}`,
      `${prefixCls}--size-${imageSize}`
    )

    const renderImage = () => {
      const DefaultImage = DEFAULT_ICON_MAP[type]

      // image和type至少有一个是正确的
      if (isNullish(image) && isUndefined(DefaultImage)) {
        invariant(false, 'The image or type ensure that at least one is correct.')
        return
      }

      return <div className={cx(`${prefixCls}__image-container`)}>{image ?? <DefaultImage />}</div>
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
  imageSize?: ResultImageSizeEnum
  /**
   * 结果类型，默认有通知、成功、错误、警告四种
   */
  type?: ResultTypeEnum
  /**
   * 提示标题
   */
  title: React.ReactNode
  /**
   * 提示内容
   */
  content?: React.ReactNode
}

if (__DEV__) {
  Result.displayName = 'Result'
}
