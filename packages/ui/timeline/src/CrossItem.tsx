import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { isNullish } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('timeline-item')

export const CrossItem: React.FC<TimelineDataItem> = ({
  prefixCls = _prefix,
  title,
  content,
  timestamp,
  extraTime,
  icon,
  children,
}) => {
  return children ? (
    <>
      <div className={prefixCls}>
        <div className={`${prefixCls}--left`}>
          <div className={`${prefixCls}__time`}>{timestamp}</div>
          <div className={`${prefixCls}__extra`}>{extraTime}</div>
        </div>
        {isNullish(icon) ? (
          <div className={`${prefixCls}__dot`} />
        ) : (
          <div className={`${prefixCls}__icon`}>{icon}</div>
        )}

        <div className={`${prefixCls}__line`} />
        <div className={`${prefixCls}--right`}>
          <div className={`${prefixCls}__title`}>{title}</div>
          <div className={`${prefixCls}__content`}>{content}</div>
        </div>
      </div>
      <div className={`${prefixCls}__collapse`}>
        {children?.map((child, idx) => (
          <CrossItem key={idx} {...child} />
        ))}
      </div>
    </>
  ) : (
    <div className={prefixCls}>
      <div className={`${prefixCls}--left`}>
        <div className={`${prefixCls}__time`}>{timestamp}</div>
        <div className={`${prefixCls}__extra`}>{extraTime}</div>
      </div>
      {isNullish(icon) ? (
        <div className={`${prefixCls}__dot`} />
      ) : (
        <div className={`${prefixCls}__icon`}>{icon}</div>
      )}
      <div className={`${prefixCls}__line`} />
      <div className={`${prefixCls}--right`}>
        <div className={`${prefixCls}__title`}>{title}</div>
        <div className={`${prefixCls}__content`}>{content}</div>
      </div>
    </div>
  )
}
