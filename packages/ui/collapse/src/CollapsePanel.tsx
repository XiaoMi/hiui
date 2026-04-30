import React, { forwardRef, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useCollapseContext } from './context'
import { RightOutlined, DownOutlined } from '@hi-ui/icons'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { isFunction } from '@hi-ui/type-assertion'
import { IconButton } from '@hi-ui/icon-button'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _role = 'collapse-panel'
const _prefix = getPrefixCls(_role)

const ActionDelayMs = 100

/**
 * 折叠面板
 */
export const CollapsePanel = forwardRef<HTMLDivElement | null, CollapsePanelProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      disabled = false,
      id,
      title,
      extra,
      ...rest
    },
    ref
  ) => {
    const isInInitialize = useRef(true)

    const {
      judgeIsActive,
      showArrow,
      arrowPlacement,
      onClickPanel,
      arrowRender,
    } = useCollapseContext()

    const { collapsePanel: collapsePanelConfig } = useGlobalContext()

    const { classNames, styles } = useMergeSemantic<
      SemanticClassNamesType<CollapsePanelProps, CollapsePanelSemanticName>,
      SemanticStylesType<CollapsePanelProps, CollapsePanelSemanticName>,
      CollapsePanelProps
    >({
      classNamesList: [collapsePanelConfig?.classNames, classNamesProp],
      stylesList: [collapsePanelConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          disabled,
          id,
          title,
          extra,
        },
      },
    })

    const active = useMemo(() => judgeIsActive(id), [id, judgeIsActive])

    const contentRef = useRef<HTMLDivElement | null>(null)

    const [wrapperStyle, setWrapperStyle] = useState<React.CSSProperties>(
      active ? { height: 'auto' } : { height: '0px' }
    )

    // 动画结束时，当活跃状态，去除具体值（此时用户添加更多内容一样可以跟随）
    const onTransitionEnd = useCallback(() => {
      setWrapperStyle(active ? { height: 'auto' } : { height: '0px' })
    }, [active])

    useEffect(() => {
      // 初始化时不做任何处理
      if (isInInitialize.current) {
        isInInitialize.current = false
        return
      }
      let handler

      // 清除之未完成的副作用
      clearTimeout(handler)

      if (active) {
        // 切换成激活态
        // 先将 height 设置为 0px
        // 延迟后设置真实的高度
        setWrapperStyle({ height: '0px', opacity: '0' })
        handler = setTimeout(() => {
          if (contentRef.current) {
            setWrapperStyle({
              height: `${contentRef.current.getBoundingClientRect().height}px`,
              opacity: 1,
            })
          }
        }, ActionDelayMs)
      } else {
        // 切换成隐藏态
        // 先将 height 设置为 真实高度尺寸
        // 延迟后设置 0px 隐藏
        if (contentRef.current) {
          setWrapperStyle({
            height: `${contentRef.current.getBoundingClientRect().height}px`,
            opacity: 1,
          })
        }
        handler = setTimeout(() => {
          setWrapperStyle({ height: '0px', opacity: '0' })
        }, ActionDelayMs)
      }
    }, [active])

    return (
      <div
        ref={ref}
        role={role}
        style={{
          ...style,
          ...styles?.root,
        }}
        className={cx(prefixCls, className, classNames?.root, {
          [`${prefixCls}--disabled`]: disabled,
          [`${prefixCls}--show`]: active,
        })}
        {...rest}
      >
        <div
          className={cx(`${prefixCls}__head`, classNames?.head)}
          style={styles?.head}
          onClick={() => !disabled && onClickPanel(id)}
        >
          {showArrow && arrowPlacement === 'left' ? (
            isFunction(arrowRender) ? (
              arrowRender(active)
            ) : (
              <IconButton
                className={cx(`${prefixCls}__icon`, `${prefixCls}__icon--left`, classNames?.icon)}
                style={styles?.icon}
                icon={<RightOutlined />}
                disabled={disabled}
                effect
              />
            )
          ) : null}
          <div
            className={cx(`${prefixCls}__title-container`, classNames?.titleContainer)}
            style={styles?.titleContainer}
          >
            <div className={cx(`${prefixCls}__title`, classNames?.title)} style={styles?.title}>
              {title}
            </div>
            {extra ? (
              <div className={cx(`${prefixCls}__extra`, classNames?.extra)} style={styles?.extra}>
                {extra}
              </div>
            ) : null}
          </div>
          {showArrow && arrowPlacement === 'right' ? (
            isFunction(arrowRender) ? (
              arrowRender(active)
            ) : (
              <IconButton
                className={cx(`${prefixCls}__icon`, `${prefixCls}__icon--right`, classNames?.icon)}
                style={styles?.icon}
                disabled={disabled}
                icon={<DownOutlined />}
                effect
              />
            )
          ) : null}
        </div>
        <div
          className={cx(`${prefixCls}__content-wrapper`, classNames?.contentWrapper)}
          style={{
            ...wrapperStyle,
            ...styles?.contentWrapper,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          <div
            className={cx(`${prefixCls}__content`, classNames?.content)}
            style={styles?.content}
            ref={contentRef}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)

export type CollapsePanelSemanticName =
  | 'root'
  | 'head'
  | 'icon'
  | 'titleContainer'
  | 'title'
  | 'extra'
  | 'contentWrapper'
  | 'content'
export type CollapsePanelSemanticClassNames = SemanticClassNamesType<
  CollapsePanelProps,
  CollapsePanelSemanticName
>
export type CollapsePanelSemanticStyles = SemanticStylesType<
  CollapsePanelProps,
  CollapsePanelSemanticName
>
export type CollapsePanelSemantic = ComponentSemantic<
  CollapsePanelSemanticClassNames,
  CollapsePanelSemanticStyles
>

export interface CollapsePanelProps extends HiBaseHTMLProps<'div'>, CollapsePanelSemantic {
  /**
   * 	面板唯一标识
   */
  id: string
  /**
   * 面板的标题
   */
  title: React.ReactNode
  /**
   * 额外元素
   */
  extra?: React.ReactNode
  /**
   * 是否禁用面板
   * @default false
   */
  disabled?: boolean
  /**
   * 面板的内容
   */
  children?: React.ReactNode
}

if (__DEV__) {
  CollapsePanel.displayName = 'Collapse.Panel'
}
