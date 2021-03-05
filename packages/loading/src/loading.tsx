import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { CSSTransition } from "react-transition-group"
import cx from 'classnames'
import __DEV__ from './env'

const componentName = 'loading'
export const _prefix = 'hi4-loading'

export const Loading: React.FC<LoadingProps> = forwardRef<null, LoadingProps>(
  (
    { prefixCls = _prefix, className, children, role = componentName, label, active = true, full = false, ...restProps },
    ref
  ) => {
    const [internalActive, setInternalActive] = useState(false)

    // @ts-ignore
    useImperativeHandle(ref, () => ({
      close: () => setInternalActive(false),
    }))

    useEffect(() => {
      setInternalActive(active)
    }, [active])

    const maskCls = cx(
      `${prefixCls}__mask`,
      children && `${prefixCls}__mask--withchildren`,
      full && `${prefixCls}__mask--full`
    )
    const iconCls = cx(`${prefixCls}__icon`)
    const labelCls = cx(`${prefixCls}__label`)

    return (
      <CSSTransition
        classNames={`${prefixCls}__mask`}
        in={internalActive}
        unmountOnExit
        timeout={300}
      >
        <div role={role} className={maskCls} {...restProps}>
          <div className={cx(prefixCls, className)}>
            <div className={`${prefixCls}__icon-wrapper`}>
              <div className={iconCls} />
            </div>
            {label ? <span className={labelCls}>{label}</span> : null}
            {children}
          </div>
        </div>
      </CSSTransition>
    )
  }
)

interface LoadingProps {
  prefixCls?: string
  role?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  label?: React.ReactNode
  active?: boolean
  full?: boolean
}

if (__DEV__) {
  Loading.displayName = 'Loading'
}

export default Loading
