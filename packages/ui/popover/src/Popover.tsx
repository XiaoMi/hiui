import React, {
  cloneElement,
  isValidElement,
  forwardRef,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import Popper, { PopperSemanticName } from '@hi-ui/popper'
import { usePopover, UsePopoverProps } from './use-popover'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { isString } from '@hi-ui/type-assertion'

const _role = 'popover'
export const prefix = getPrefixCls(_role)

/**
 * 气泡卡片
 */
export const Popover = forwardRef<HTMLDivElement | null, PopoverProps>(
  (
    {
      prefixCls = prefix,
      innerRef,
      className,
      children,
      title,
      content,
      shouldWrapChildren = false,
      autoWrapChildren = true,
      wrapTagName = 'span',
      showTitleDivider = false,
      classNames: classNamesProp,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const { popover: popoverConfig } = useGlobalContext()
    const { classNames, styles } = useMergeSemantic<
      PopoverSemanticClassNames,
      PopoverSemanticStyles,
      PopoverProps
    >({
      classNamesList: [popoverConfig?.classNames, classNamesProp],
      stylesList: [popoverConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          title,
          content,
          showTitleDivider,
        },
      },
    })
    const popperClassNames = {
      root: classNames?.root,
      container: classNames?.container,
      arrow: classNames?.arrow,
      content: classNames?.content,
    }
    const popperStyles = {
      root: styles?.root,
      container: styles?.container,
      arrow: styles?.arrow,
      content: styles?.content,
    }
    const {
      rootProps,
      getTriggerProps,
      getPopperProps,
      getOverlayProps,
      visibleAction,
    } = usePopover(rest)

    const popperRef = useRef<{ update: () => void } | null>(null)

    useImperativeHandle(innerRef, () => ({
      open: visibleAction.on,
      close: visibleAction.off,
      update: () => {
        popperRef.current?.update()
      },
    }))

    const triggerMemo = useMemo(() => {
      let trigger: React.ReactElement | null | undefined

      if (isValidElement(children)) {
        trigger = cloneElement(
          children,
          // @ts-ignore
          getTriggerProps(children.props, children.ref)
        )
      } else {
        const TagName = wrapTagName

        if (shouldWrapChildren || (autoWrapChildren && isString(children))) {
          trigger = (
            <TagName tabIndex={0} {...getTriggerProps()}>
              {children}
            </TagName>
          )
        } else {
          trigger = children as React.ReactElement

          if (__DEV__) {
            invariant(
              false,
              'Make sure that the children supports the event corresponding to the trigger, you can set `shouldWrapChildren=true` to solve it.'
            )
          }
        }
      }

      return trigger
    }, [children, getTriggerProps, autoWrapChildren, shouldWrapChildren, wrapTagName])

    const cls = cx(prefixCls, showTitleDivider && `${prefixCls}--divided`, className)

    return (
      <>
        {triggerMemo}
        <Popper
          ref={popperRef}
          {...getPopperProps()}
          {...getOverlayProps()}
          autoFocus={false}
          classNames={popperClassNames}
          styles={popperStyles}
        >
          <div
            ref={ref}
            className={cx(cls, classNames?.wrapper)}
            style={styles?.wrapper}
            {...rootProps}
          >
            {title ? (
              <div className={cx(`${prefixCls}__title`, classNames?.title)} style={styles?.title}>
                {title}
              </div>
            ) : null}
            <div className={cx(`${prefixCls}__content`, classNames?.body)} style={styles?.body}>
              {content}
            </div>
          </div>
        </Popper>
      </>
    )
  }
)

export type PopoverSemanticName = PopperSemanticName | 'wrapper' | 'title' | 'body'
export type PopoverSemanticClassNames = SemanticClassNamesType<PopoverProps, PopoverSemanticName>
export type PopoverSemanticStyles = SemanticStylesType<PopoverProps, PopoverSemanticName>
export type PopoverSemantic = ComponentSemantic<PopoverSemanticClassNames, PopoverSemanticStyles>

export interface PopoverProps extends HiBaseHTMLProps<'div'>, UsePopoverProps, PopoverSemantic {
  innerRef?: React.Ref<PopoverHelper>
  /**
   * 气泡卡片标题
   */
  title?: React.ReactNode
  /**
   * 气泡卡片内容
   */
  content: React.ReactNode
  /**
   * 使用标签强制包裹 children，使触发器支持 trigger 的事件
   */
  shouldWrapChildren?: boolean
  /**
   * 使用标签自动包裹 children，使触发器支持 trigger 的事件
   */
  autoWrapChildren?: boolean
  /**
   * 指定包裹 children 的标签
   */
  wrapTagName?: React.ElementType<any>
  /**
   * 吸附的元素
   */
  attachEl?: HTMLElement
  /**
   * 显示标题分割线
   */
  showTitleDivider?: boolean
}

export interface PopoverHelper {
  open: () => void
  close: () => void
  update: () => void
}

if (__DEV__) {
  Popover.displayName = 'Popover'
}
