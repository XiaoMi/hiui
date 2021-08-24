import React, { forwardRef, useMemo, useRef } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { Portal } from '@hi-ui/portal'
import { Popper, PopperProps } from './Popper'

/**
 * TODO: What is PopperPortal
 */
export const PopperPortal = forwardRef<HTMLDivElement | null, PopperPortalProps>(
  (
    {
      visible = false,
      container,
      disabledPortal = false,
      preload = false,
      unmountOnClose = true,
      ...rest
    },
    ref
  ) => {
    const [transitionExited, transitionExitedAction] = useToggle(!visible)

    const hasOpenedRef = useRef(false)
    if (visible) {
      hasOpenedRef.current = true
    }

    const shouldRenderPopper = useMemo(() => {
      if (visible || !transitionExited) return true

      // 初次未渲染，且开启预渲染时渲染 children
      if (!hasOpenedRef.current) return preload

      // 未开启关闭时销毁，保留渲染 children
      if (!unmountOnClose) return true

      return false
    }, [preload, unmountOnClose, visible, transitionExited])

    return (
      <Portal container={container} disabled={disabledPortal}>
        {shouldRenderPopper ? (
          <Popper
            ref={ref}
            visible={visible}
            preload={preload}
            unmountOnClose={unmountOnClose}
            onEnter={() => {
              console.log('onEnter')
              transitionExitedAction.off()
            }}
            onExited={() => {
              console.log('onExited')
              transitionExitedAction.on()
            }}
            {...rest}
          />
        ) : null}
      </Portal>
    )
  }
)

export interface PopperPortalProps extends PopperProps {
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
}

if (__DEV__) {
  PopperPortal.displayName = 'PopperPortal'
}
