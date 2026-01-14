import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { useAnchor, UseAnchorProps, useAnchorItem, UseAnchorItemProps } from './use-anchor'
import { AnchorProvider } from './context'

const ANCHOR_PREFIX = getPrefixCls('anchor')

/**
 * 锚点
 */
export const Anchor = forwardRef<HTMLDivElement | null, AnchorProps>(
  (
    {
      prefixCls = ANCHOR_PREFIX,
      role = 'anchor',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      ...rest
    },
    ref
  ) => {
    const { anchor: anchorConfig } = useGlobalContext()
    const { rootProps, ...context } = useAnchor(rest)
    const { getAnchorInkProps } = context

    const { classNames, styles } = useMergeSemantic<
      AnchorSemanticClassNames,
      AnchorSemanticStyles,
      AnchorProps
    >({
      classNamesList: [anchorConfig?.classNames, classNamesProp],
      stylesList: [anchorConfig?.styles, stylesProp],
      info: { props: { ...rest } },
    })

    const cls = cx(prefixCls, className, classNames?.root)

    return (
      <AnchorProvider value={context}>
        <div
          ref={ref}
          role={role}
          className={cls}
          style={{ ...style, ...styles?.root }}
          {...rootProps}
        >
          <ul className={cx(`${prefixCls}__list`, classNames?.list)} style={styles?.list}>
            {children}
          </ul>
          <div
            className={cx(`${prefixCls}-ink`, classNames?.ink)}
            style={{ ...styles?.ink, ...getAnchorInkProps().style }}
          ></div>
        </div>
      </AnchorProvider>
    )
  }
)

export type AnchorSemanticName = 'root' | 'list' | 'ink'
export type AnchorSemanticClassNames = SemanticClassNamesType<AnchorProps, AnchorSemanticName>
export type AnchorSemanticStyles = SemanticStylesType<AnchorProps, AnchorSemanticName>
export type AnchorSemantic = ComponentSemantic<AnchorSemanticClassNames, AnchorSemanticStyles>

export interface AnchorProps extends HiBaseHTMLProps<'div'>, UseAnchorProps, AnchorSemantic {}

if (__DEV__) {
  Anchor.displayName = 'Anchor'
}

const ANCHOR_ITEM_PREFIX = getPrefixCls('anchor-item')

export const AnchorItem = forwardRef<HTMLLIElement | null, AnchorItemProps>(
  (
    {
      prefixCls = ANCHOR_ITEM_PREFIX,
      role = 'anchor-item',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      title,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { anchorItem: anchorItemConfig } = useGlobalContext()
    const { rootProps, getAnchorLinkProps, showActive } = useAnchorItem(rest)

    const { classNames, styles } = useMergeSemantic<
      AnchorItemSemanticClassNames,
      AnchorItemSemanticStyles,
      AnchorItemProps
    >({
      classNamesList: [anchorItemConfig?.classNames, classNamesProp],
      stylesList: [anchorItemConfig?.styles, stylesProp],
      info: { props: { ...rest } },
    })

    const cls = cx(prefixCls, className, classNames?.root, showActive && `${prefixCls}--active`)

    return (
      <li
        ref={ref}
        role={role}
        className={cls}
        style={{ ...style, ...styles?.root }}
        {...rootProps}
      >
        <a
          className={cx(`${prefixCls}__link`, classNames?.link)}
          style={styles?.link}
          {...getAnchorLinkProps()}
        >
          {title}
        </a>
        {children}
      </li>
    )
  }
)

export type AnchorItemSemanticName = 'root' | 'link'
export type AnchorItemSemanticClassNames = SemanticClassNamesType<
  AnchorItemProps,
  AnchorItemSemanticName
>
export type AnchorItemSemanticStyles = SemanticStylesType<AnchorItemProps, AnchorItemSemanticName>
export type AnchorItemSemantic = ComponentSemantic<
  AnchorItemSemanticClassNames,
  AnchorItemSemanticStyles
>

export interface AnchorItemProps
  extends HiBaseHTMLProps<'li'>,
    UseAnchorItemProps,
    AnchorItemSemantic {
  /**
   * 锚点项标题内容
   */
  title?: React.ReactNode
  /**
   * 下一级锚点节点列表，可传入 `AnchorItem`
   */
  children?: React.ReactNode
}

if (__DEV__) {
  AnchorItem.displayName = 'AnchorItem'
}
