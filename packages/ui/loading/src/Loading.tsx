import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
  forwardRef,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import debounce from 'lodash/debounce'
import CSSTransition from 'react-transition-group/CSSTransition'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import type { DebouncedFunc } from 'lodash'

const _role = 'loading'
export const _prefix = getPrefixCls(_role)

export const Loading = forwardRef<null, LoadingProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      role = _role,
      container,
      label,
      visible = true,
      full = false,
      size = 'md',
      delay = -1,
      ...restProps
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(false)

    // Real trigger loading update
    const updateLoadingStatus = useCallback(() => {
      if (internalVisible === visible) return
      setInternalVisible(visible)
    }, [internalVisible, visible])

    const prevDebouncedUpdateRef = useRef<null | DebouncedFunc<typeof updateLoadingStatus>>(null)

    const cancelWaitingLoading = () => {
      prevDebouncedUpdateRef.current?.cancel()
    }

    const shouldDelay = visible && delay >= 0

    const debouncedLoadingUpdater = useCallback(() => {
      cancelWaitingLoading()

      if (shouldDelay) {
        const debouncedUpdateLoading = debounce(updateLoadingStatus, delay)
        prevDebouncedUpdateRef.current = debouncedUpdateLoading

        debouncedUpdateLoading()
      } else {
        updateLoadingStatus()
        prevDebouncedUpdateRef.current = null
      }
    }, [delay, shouldDelay, updateLoadingStatus])

    useEffect(() => {
      debouncedLoadingUpdater()

      return () => {
        cancelWaitingLoading()
      }
    }, [debouncedLoadingUpdater])

    // @ts-ignore
    useImperativeHandle(ref, () => ({
      // @ts-ignore
      local: ref?.current,
      $close: () => setInternalVisible(false),
    }))

    const mountNode = container || (full ? document.body : '')

    const maskCls = cx(
      `${prefixCls}__mask`,
      children && `${prefixCls}__mask--withchildren`,
      full && `${prefixCls}__mask--full`,
      size && `${prefixCls}--size-${size}`
    )

    const loadingComponent = (
      <CSSTransition
        classNames={`${prefixCls}__mask`}
        in={internalVisible}
        unmountOnExit
        timeout={300}
      >
        <div className={maskCls} {...restProps}>
          <div ref={ref} role={role} className={cx(prefixCls, className)}>
            <div className={`${prefixCls}__icon-wrapper`}>
              <div className={`${prefixCls}__icon`}>
                <div />
                <div />
              </div>
            </div>
            {label ? <span className={`${prefixCls}__label`}>{label}</span> : null}
          </div>
        </div>
      </CSSTransition>
    )

    return (
      <Portal target={mountNode}>
        {children ? (
          // 可以测量 children margin，实现按内容位置偏移，排除 margin 影响
          // 暂时不考虑，如果有需要，完全可以把 margin 设置到加到父节点
          <div className={`${prefixCls}__wrapper`}>
            {children}
            {loadingComponent}
          </div>
        ) : (
          loadingComponent
        )}
      </Portal>
    )
  }
)

export interface LoadingProps {
  prefixCls?: string
  role?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  label?: React.ReactNode
  visible?: boolean
  full?: boolean
  container?: React.ReactNode
  delay?: number
  size?: 'md' | 'lg' | 'sm'
}

if (__DEV__) {
  Loading.displayName = 'Loading'
}

// TODO: 抽离封装
function Portal({ target, children }: any) {
  return target ? createPortal(children, target) : children
}
