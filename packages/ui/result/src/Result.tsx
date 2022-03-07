import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@hi-ui/icons'
import { ResultTypeEnum } from './types'
import {
  IconFailed,
  IconNetError,
  IconNoCollection,
  IconNoComment,
  IconNoContent,
  IconNoPermission,
  IconProcessed,
  IconSucceed,
} from './icons'

const RESULT_PREFIX = getPrefixCls('result')

/**
 * Result(结果页):用于反馈一系列操作任务的处理结果
 */
export const Result = forwardRef<HTMLDivElement | null, ResultProps>(
  (
    {
      prefixCls = RESULT_PREFIX,
      role = 'result',
      className,
      icon,
      iconSize = 'md',
      type = 'info',
      title,
      subTitle,
      extra,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const IconSizeMap = {
      sm: { width: '64px', height: '64px' },
      md: { width: '88px', height: '88px' },
      lg: { width: '114px', height: '114px' },
    }

    const IconContainerSizeMap = {
      sm: { width: '100px', height: '100px' },
      md: { width: '140px', height: '140px' },
      lg: { width: '180px', height: '180px' },
    }

    const renderIcon = () => {
      const IconMap = {
        [ResultTypeEnum.info]: (
          <ExclamationCircleFilled style={{ ...IconSizeMap[iconSize], color: '#237ffa' }} />
        ),
        [ResultTypeEnum.success]: (
          <CheckCircleFilled style={{ ...IconSizeMap[iconSize], color: '#14ca64' }} />
        ),
        [ResultTypeEnum.warn]: (
          <ExclamationCircleFilled style={{ ...IconSizeMap[iconSize], color: '#fab007' }} />
        ),
        [ResultTypeEnum.error]: (
          <CloseCircleFilled style={{ ...IconSizeMap[iconSize], color: '#ff5959' }} />
        ),
        [ResultTypeEnum.operationSucceed]: <IconSucceed />,
        [ResultTypeEnum.operationFailed]: <IconFailed />,
        [ResultTypeEnum.processed]: <IconProcessed />,
        [ResultTypeEnum.netError]: <IconNetError />,
        [ResultTypeEnum.noContent]: <IconNoContent />,
        [ResultTypeEnum.noComment]: <IconNoComment />,
        [ResultTypeEnum.noPermission]: <IconNoPermission />,
        [ResultTypeEnum.noCollection]: <IconNoCollection />,
      }

      return (
        <div
          style={icon ? {} : IconContainerSizeMap[iconSize]}
          className={`${prefixCls}__image-container`}
        >
          {icon || IconMap[type]}
        </div>
      )
    }

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderIcon()}
        <div className={`${prefixCls}__title`}>{title}</div>
        {subTitle && <div className={`${prefixCls}__subtitle`}>{subTitle}</div>}
        {extra && <div className={`${prefixCls}__extra`}>{extra}</div>}
        {children && <div className={`${prefixCls}__content`}>{children}</div>}
      </div>
    )
  }
)

export interface ResultProps extends HiBaseHTMLProps<'div'> {
  /**
   * 自定义图标
   */
  icon?: React.ReactNode
  /**
   * 自定义图标尺寸
   */
  iconSize?: HiBaseSizeEnum
  /**
   * 组件类型
   */
  type?: ResultTypeEnum
  /**
   * 标题
   */
  title: React.ReactNode
  /**
   * 副标题
   */
  subTitle?: React.ReactNode
  /**
   * 操作区域
   */
  extra?: React.ReactNode
}

if (__DEV__) {
  Result.displayName = 'Result'
}
