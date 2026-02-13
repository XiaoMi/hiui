import React, { forwardRef, useImperativeHandle } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext, useGlobalContext } from '@hi-ui/core'
import { usePopConfirm, UsePopConfirmProps } from './use-pop-confirm'
import Button from '@hi-ui/button'
import Popper, { PopperSemanticName } from '@hi-ui/popper'
import { defaultTipIcon } from './icons'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { isUndef } from '@hi-ui/type-assertion'

export const POP_CONFIRM_PREFIX = getPrefixCls('pop-confirm')

/**
 * 气泡确认框
 */
export const PopConfirm = forwardRef<HTMLDivElement | null, PopConfirmProps>(
  (
    {
      prefixCls = POP_CONFIRM_PREFIX,
      innerRef,
      role = 'alert-dialog',
      className,
      children,
      title,
      content,
      icon = defaultTipIcon,
      cancelText: cancelTextProp,
      confirmText: confirmTextProp,
      footer,
      classNames: classNamesProp,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()
    const { popConfirm: popConfirmConfig } = useGlobalContext()
    const { classNames, styles } = useMergeSemantic<
      PopConfirmSemanticClassNames,
      PopConfirmSemanticStyles,
      PopConfirmProps
    >({
      classNamesList: [popConfirmConfig?.classNames, classNamesProp],
      stylesList: [popConfirmConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          title,
          content,
          icon,
          footer,
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

    const cancelText = isUndef(cancelTextProp) ? i18n.get('popConfirm.cancelText') : cancelTextProp
    const confirmText = isUndef(confirmTextProp)
      ? i18n.get('popConfirm.confirmText')
      : confirmTextProp

    const {
      rootProps,
      getPopperProps,
      getTriggerProps,
      onCancel,
      onConfirm,
      visibleAction,
    } = usePopConfirm(rest)

    useImperativeHandle(innerRef, () => ({
      open: visibleAction.on,
      close: visibleAction.off,
    }))

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--icon-less`]: icon === null,
    })

    const hasConfirm = confirmText !== null
    const hasCancel = cancelText !== null
    const hasFooter = hasConfirm || hasCancel || footer !== null

    return (
      <>
        {React.isValidElement(children)
          ? React.cloneElement(
              children,
              // @ts-ignore
              getTriggerProps(children.props, children.ref)
            )
          : null}
        <Popper {...getPopperProps()} classNames={popperClassNames} styles={popperStyles}>
          <div
            ref={ref}
            className={cx(cls, classNames?.wrapper)}
            style={styles?.wrapper}
            {...rootProps}
          >
            <section
              className={cx(`${prefixCls}__content`, classNames?.contentSection)}
              style={styles?.contentSection}
            >
              {icon ? (
                <span
                  className={cx(`${prefixCls}__content-icon`, classNames?.contentIcon)}
                  style={styles?.contentIcon}
                >
                  {icon}
                </span>
              ) : null}
              <div
                className={cx(`${prefixCls}__content-title`, classNames?.contentTitle)}
                style={styles?.contentTitle}
              >
                {title}
              </div>
            </section>

            {content ? (
              <div className={cx(`${prefixCls}__body`, classNames?.body)} style={styles?.body}>
                {content}
              </div>
            ) : null}

            {hasFooter ? (
              <footer
                className={cx(`${prefixCls}__footer`, classNames?.footer)}
                style={styles?.footer}
              >
                {footer === undefined
                  ? [
                      hasCancel ? (
                        <Button
                          key="1"
                          className={cx(`${prefixCls}__btn-cancel`, classNames?.btnCancel)}
                          style={styles?.btnCancel}
                          type="default"
                          appearance="line"
                          size="sm"
                          onClick={onCancel}
                        >
                          {cancelText}
                        </Button>
                      ) : null,
                      hasConfirm ? (
                        <Button
                          key="2"
                          className={cx(`${prefixCls}__btn-confirm`, classNames?.btnConfirm)}
                          style={styles?.btnConfirm}
                          type="primary"
                          size="sm"
                          onClick={onConfirm}
                        >
                          {confirmText}
                        </Button>
                      ) : null,
                    ]
                  : footer}
              </footer>
            ) : null}
          </div>
        </Popper>
      </>
    )
  }
)

export type PopConfirmSemanticName =
  | PopperSemanticName
  | 'wrapper'
  | 'contentSection'
  | 'contentIcon'
  | 'contentTitle'
  | 'body'
  | 'footer'
  | 'btnCancel'
  | 'btnConfirm'
export type PopConfirmSemanticClassNames = SemanticClassNamesType<
  PopConfirmProps,
  PopConfirmSemanticName
>
export type PopConfirmSemanticStyles = SemanticStylesType<PopConfirmProps, PopConfirmSemanticName>
export type PopConfirmSemantic = ComponentSemantic<
  PopConfirmSemanticClassNames,
  PopConfirmSemanticStyles
>

export interface PopConfirmProps
  extends Omit<HiBaseHTMLProps<'div'>, 'title'>,
    UsePopConfirmProps,
    PopConfirmSemantic {
  innerRef?: React.Ref<{ open: () => void; close: () => void }>
  /**
   * 确认框标题
   */
  title: React.ReactNode
  /**
   * 确认框内容
   */
  content?: React.ReactNode
  /**
   * 取消按钮文案
   */
  cancelText?: React.ReactNode
  /**
   * 确认按钮文案
   */
  confirmText?: React.ReactNode
  /**
   * 自定义提示的 icon 图标
   */
  icon?: React.ReactNode
  /**
   * 自定义底部内容
   */
  footer?: React.ReactNode
}

if (__DEV__) {
  PopConfirm.displayName = 'PopConfirm'
}
