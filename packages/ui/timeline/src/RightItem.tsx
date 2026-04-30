import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { DotIcon } from './DotIcon'
import type { CrossItemSemanticProps } from './CrossItem'

const _prefix = getPrefixCls('timeline-item')

export const RightItem: React.FC<TimelineDataItem & CrossItemSemanticProps> = ({
  prefixCls = _prefix,
  title,
  content,
  timestamp,
  extraTime,
  icon,
  dotColor,
  dotType,
  classNames: classNamesProp,
  styles: stylesProp,
}) => {
  return (
    <div className={cx(prefixCls, classNamesProp?.item)} style={stylesProp?.item}>
      <div
        className={cx(`${prefixCls}__title`, classNamesProp?.itemTitle)}
        style={stylesProp?.itemTitle}
      >
        {title}
      </div>
      <div
        className={cx(`${prefixCls}__content`, classNamesProp?.itemContent)}
        style={stylesProp?.itemContent}
      >
        {content}
      </div>
      <div
        className={cx(`${prefixCls}__time`, classNamesProp?.itemTime)}
        style={stylesProp?.itemTime}
      >
        {timestamp} {extraTime}
      </div>
      <div className={cx(classNamesProp?.itemDot)} style={stylesProp?.itemDot}>
        <DotIcon prefixCls={prefixCls} icon={icon} color={dotColor} type={dotType} />
      </div>
      <div
        className={cx(`${prefixCls}__line`, classNamesProp?.itemLine)}
        style={stylesProp?.itemLine}
      />
    </div>
  )
}
