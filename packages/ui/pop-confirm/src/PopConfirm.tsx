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
      ...rest
    },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, getPopperProps, getTriggerProps, onCancel, onConfirm } = usePopConfirm(rest)

    const cls = cx(prefixCls, className)

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
            <div className={`${prefixCls}__footer`}>
              <Button
                className={`${prefixCls}__btn-cancel`}
                type="default"
                appearance="line"
                size="small"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
              <Button
                className={`${prefixCls}__btn-confirm`}
                type="primary"
                size="small"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
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
}

if (__DEV__) {
  PopConfirm.displayName = 'PopConfirm'
}
