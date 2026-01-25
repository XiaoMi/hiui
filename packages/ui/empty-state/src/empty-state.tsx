import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useLocaleContext, HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { isUndef } from '@hi-ui/type-assertion'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

import { IMAGE_NO_DATA } from './icons'
import { EmptyStateSizeEnum } from './types'

const _role = 'empty-state'
const _prefix = getPrefixCls(_role)

export const EmptyState = forwardRef<HTMLDivElement | null, EmptyStateProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      indicator,
      title: titleProp,
      imageStyle,
      imageClassName,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, emptyState: emptyStateConfig } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'md'
    if (size === 'xs') {
      size = 'sm'
    }

    const i18n = useLocaleContext()

    const title = isUndef(titleProp) ? i18n.get('emptyState.emptyContent') : titleProp

    const { classNames, styles } = useMergeSemantic<
      EmptyStateSemanticClassNames,
      EmptyStateSemanticStyles,
      EmptyStateProps
    >({
      classNamesList: [emptyStateConfig?.classNames, classNamesProp],
      stylesList: [emptyStateConfig?.styles, stylesProp],
      info: { props: { ...rest, title, indicator, size } },
    })

    const cls = cx(prefixCls, className, classNames?.root, `${prefixCls}--size-${size}`)

    if (isUndef(indicator)) {
      indicator = IMAGE_NO_DATA
    }

    return (
      <div ref={ref} role={role} className={cls} style={{ ...style, ...styles?.root }} {...rest}>
        <div
          className={cx(`${prefixCls}__image`, imageClassName, classNames?.image)}
          style={{ ...imageStyle, ...styles?.image }}
        >
          {typeof indicator === 'string' ? <img src={indicator} alt="indicator" /> : indicator}
        </div>
        {title ? (
          <span className={cx(`${prefixCls}__title`, classNames?.title)} style={styles?.title}>
            {title}
          </span>
        ) : null}
        {children && (
          <div className={cx(`${prefixCls}__slot`, classNames?.slot)} style={styles?.slot}>
            {children}
          </div>
        )}
      </div>
    )
  }
)

export type EmptyStateSemanticName = 'root' | 'image' | 'title' | 'slot'
export type EmptyStateSemanticClassNames = SemanticClassNamesType<
  EmptyStateProps,
  EmptyStateSemanticName
>
export type EmptyStateSemanticStyles = SemanticStylesType<EmptyStateProps, EmptyStateSemanticName>
export type EmptyStateSemantic = ComponentSemantic<
  EmptyStateSemanticClassNames,
  EmptyStateSemanticStyles
>

export interface EmptyStateProps extends HiBaseHTMLProps<'div'>, EmptyStateSemantic {
  /**
   * 指示器图标，如果是字符串将被设置为 Img 的 src
   */
  indicator?: React.ReactNode
  /**
   * 空状态的标题
   */
  title?: React.ReactNode
  /**
   * 图标尺寸
   */
  size?: EmptyStateSizeEnum
  /**
   * 指示器的样式。暂不对外暴露
   * @private
   */
  imageStyle?: React.CSSProperties
  /**
   * 指示器的类名。暂不对外暴露
   * @private
   */
  imageClassName?: string
}

if (__DEV__) {
  EmptyState.displayName = 'EmptyState'
}
