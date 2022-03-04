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
 * TODO: What is Result
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
      sm: { fontSize: 64, padding: 18 },
      md: { fontSize: 88, padding: 26 },
      lg: { fontSize: 114, padding: 33 },
    }
    const IconContainerSizeMap = {
      sm: { width: 100, height: 100 },
      md: { width: 140, height: 140 },
      lg: { width: 180, height: 180 },
    }

    const renderIcon = () => {
      const IconMap = {
        [ResultTypeEnum.info]: (
          <ExclamationCircleFilled style={{ ...IconSizeMap[iconSize], color: '#237FFA' }} />
        ),
        [ResultTypeEnum.success]: (
          <CheckCircleFilled style={{ ...IconSizeMap[iconSize], color: '#14CA64' }} />
        ),
        [ResultTypeEnum.warn]: (
          <ExclamationCircleFilled style={{ ...IconSizeMap[iconSize], color: '#FAB007' }} />
        ),
        [ResultTypeEnum.error]: (
          <CloseCircleFilled style={{ ...IconSizeMap[iconSize], color: '#FF5959' }} />
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

      return <div style={IconContainerSizeMap[iconSize]}>{IconMap[type]}</div>
    }
    const renderExtra = () => {
      return <div>extra</div>
    }
    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderIcon()}
        <div className={`${prefixCls}-title`}>{title}</div>
        {subTitle && <div className={`${prefixCls}-subtitle`}>{subTitle}</div>}
        {renderExtra()}
        {children && <div className={`${prefixCls}-content`}>{children}</div>}
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
   * 额外内容
   */
  extra?: React.ReactNode
}

if (__DEV__) {
  Result.displayName = 'Result'
}
