import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { usePopConfirm, UsePopConfirmProps } from './use-pop-confirm'
import Button from '@hi-ui/button'
import Popper from '@hi-ui/popper'
import { defaultTipIcon } from './icons'

import { isUndef } from '@hi-ui/type-assertion'

const POP_CONFIRM_PREFIX = getPrefixCls('pop-confirm')

/**
 * 气泡确认框
 */
export const PopConfirm = forwardRef<HTMLDivElement | null, PopConfirmProps>(
  (
    {
      prefixCls = POP_CONFIRM_PREFIX,
      role = 'alert-dialog',
      className,
      children,
      title,
      content,
      icon = defaultTipIcon,
      cancelText: cancelTextProp,
      confirmText: confirmTextProp,
      footer,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const cancelText = isUndef(cancelTextProp) ? i18n.get('popConfirm.cancelText') : cancelTextProp
    const confirmText = isUndef(confirmTextProp)
      ? i18n.get('popConfirm.confirmText')
      : confirmTextProp

    const { rootProps, getPopperProps, getTriggerProps, onCancel, onConfirm } = usePopConfirm(rest)

    const cls = cx(prefixCls, className)

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
        <Popper {...getPopperProps()}>
          <div ref={ref} className={cls} {...rootProps}>
            <section className={`${prefixCls}__content`}>
              {icon ? <span className={`${prefixCls}__content-icon`}>{icon}</span> : null}
              <div className={`${prefixCls}__content-title`}>{title}</div>
            </section>

            {content ? <div className={`${prefixCls}__body`}>{content}</div> : null}

            {hasFooter ? (
              <footer className={`${prefixCls}__footer`}>
                {footer === undefined
                  ? [
                      hasCancel ? (
                        <Button
                          key="1"
                          className={`${prefixCls}__btn-cancel`}
                          type="default"
                          size="md"
                          onClick={onCancel}
                        >
                          {cancelText}
                        </Button>
                      ) : null,
                      hasConfirm ? (
                        <Button
                          key="2"
                          className={`${prefixCls}__btn-confirm`}
                          type="primary"
                          size="md"
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

export interface PopConfirmProps extends Omit<HiBaseHTMLProps<'div'>, 'title'>, UsePopConfirmProps {
  /**
   * 确认框标题
   */
  title: React.ReactNode
  /**
   * 确认框内容
   */
  content: React.ReactNode
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
