import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { DotIcon } from './DotIcon'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('timeline-item')

export interface CrossItemSemanticProps {
  classNames?: {
    item?: string
    itemTime?: string
    itemLine?: string
    itemDot?: string
    itemTitle?: string
    itemContent?: string
  }
  styles?: {
    item?: React.CSSProperties
    itemTime?: React.CSSProperties
    itemLine?: React.CSSProperties
    itemDot?: React.CSSProperties
    itemTitle?: React.CSSProperties
    itemContent?: React.CSSProperties
  }
}

export const CrossItem: React.FC<TimelineDataItem & CrossItemSemanticProps> = ({
  prefixCls = _prefix,
  title,
  content,
  timestamp,
  extraTime,
  icon,
  dotColor,
  dotType,
  children,
  classNames: classNamesProp,
  styles: stylesProp,
}) => {
  const itemEl = (
    <div className={cx(prefixCls, classNamesProp?.item)} style={stylesProp?.item}>
      <div className={`${prefixCls}--left`}>
        <div
          className={cx(`${prefixCls}__time`, classNamesProp?.itemTime)}
          style={stylesProp?.itemTime}
        >
          {timestamp}
        </div>
        <div className={`${prefixCls}__extra`}>{extraTime}</div>
      </div>
      <div className={cx(classNamesProp?.itemDot)} style={stylesProp?.itemDot}>
        <DotIcon prefixCls={prefixCls} icon={icon} color={dotColor} type={dotType} />
      </div>
      <div
        className={cx(`${prefixCls}__line`, classNamesProp?.itemLine)}
        style={stylesProp?.itemLine}
      />
      <div className={`${prefixCls}--right`}>
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
      </div>
    </div>
  )

  return isArrayNonEmpty(children) ? (
    <>
      {itemEl}
      <div className={`${prefixCls}__collapse`}>
        {children.map((child, idx) => (
          <CrossItem
            key={idx}
            {...child}
            dotType={child.dotType || 'solid'}
            dotColor={child.dotColor}
            classNames={classNamesProp}
            styles={stylesProp}
          />
        ))}
      </div>
    </>
  ) : (
    itemEl
  )
}
