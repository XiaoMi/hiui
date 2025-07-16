import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { DotIcon } from './DotIcon'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('timeline-item')

export const CrossItem: React.FC<TimelineDataItem> = ({
  prefixCls = _prefix,
  title,
  content,
  timestamp,
  extraTime,
  icon,
  dotColor,
  dotType,
  children,
}) => {
  return isArrayNonEmpty(children) ? (
    <>
      <div className={prefixCls}>
        <div className={`${prefixCls}--left`}>
          <div className={`${prefixCls}__time`}>{timestamp}</div>
          <div className={`${prefixCls}__extra`}>{extraTime}</div>
        </div>
        <DotIcon prefixCls={prefixCls} icon={icon} color={dotColor} type={dotType} />
        <div className={`${prefixCls}__line`} />
        <div className={`${prefixCls}--right`}>
          <div className={`${prefixCls}__title`}>{title}</div>
          <div className={`${prefixCls}__content`}>{content}</div>
        </div>
      </div>
      <div className={`${prefixCls}__collapse`}>
        {children.map((child, idx) => (
          <CrossItem
            key={idx}
            {...child}
            dotType={child.dotType || 'solid'}
            dotColor={child.dotColor}
          />
        ))}
      </div>
    </>
  ) : (
    <div className={prefixCls}>
      <div className={`${prefixCls}--left`}>
        <div className={`${prefixCls}__time`}>{timestamp}</div>
        <div className={`${prefixCls}__extra`}>{extraTime}</div>
      </div>
      <DotIcon prefixCls={prefixCls} icon={icon} color={dotColor} type={dotType} />
      <div className={`${prefixCls}__line`} />
      <div className={`${prefixCls}--right`}>
        <div className={`${prefixCls}__title`}>{title}</div>
        <div className={`${prefixCls}__content`}>{content}</div>
      </div>
    </div>
  )
}
