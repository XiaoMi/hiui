import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { usePopConfirm, UsePopConfirmProps } from './use-pop-confirm'
import Button from '@hi-ui/button'
import { PopperPortal } from '@hi-ui/popper'
import { defaultTipIcon } from './icons'

const POP_CONFIRM_PREFIX = getPrefixCls('pop-confirm')

/**
 * TODO: What is PopConfirm
 */
export const PopConfirm = forwardRef<HTMLDivElement | null, PopConfirmProps>(
  (
    {
      prefixCls = POP_CONFIRM_PREFIX,
      role = 'alert-dialog',
      className,
      children,
      title,
      icon = defaultTipIcon,
      cancelText = '取消',
      confirmText = '确认',
      footer,
      ...rest
    },
    ref
  ) => {
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
        <PopperPortal {...getPopperProps()}>
          <div ref={ref} className={cls} {...rootProps}>
            <section className={`${prefixCls}__content`}>
              {icon ? <span className={`${prefixCls}__content-icon`}>{icon}</span> : null}
              <div className={`${prefixCls}__content-title`}>{title}</div>
            </section>

            {hasFooter ? (
              <footer className={`${prefixCls}__footer`}>
                {footer === undefined
                  ? [
                      hasCancel ? (
                        <Button
                          key="1"
                          className={`${prefixCls}__btn-cancel`}
                          type="default"
                          size="small"
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
                          size="small"
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
        </PopperPortal>
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
