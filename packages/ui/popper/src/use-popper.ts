import React, { useRef, useState, useMemo, useLayoutEffect, useCallback, useEffect } from 'react'
import * as PopperJS from '@popperjs/core'
import { createPopper } from '@popperjs/core'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { mergeRefs } from '@hi-ui/react-utils'
import { useRefsOutsideClick } from '@hi-ui/use-outside-click'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { useLazyRender } from '@hi-ui/use-lazy-render'

const DEFAULT_MODIFIERS = [] as []

export const usePopper = ({
  modifiers: customModifiers = DEFAULT_MODIFIERS,
  strategy = 'fixed',
  placement = 'bottom-start',
  // @DesignToken zIndex: `popper`
  zIndex = 1030,
  crossGap = 0,
  gutterGap = 8,
  arrowPadding = 12,
  flip = true,
  matchWidth = false,
  matchWidthStrictly = false,
  eventListeners = true,
  preventOverflow = true,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  visible = false,
  attachEl: attachElement,
  onClose,
  onOutsideClick,
  preload = false,
  unmountOnClose = true,
  // 保证内容能正常展示，即使开启了 matchWidth
  minWidth: minWidthProp = 'max-content',
}: UsePopperProps) => {
  const minWidth = matchWidthStrictly ? undefined : minWidthProp
  const nonInteractive = !visible

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)

  const [state, setState] = useState<PopperState>(() => ({
    styles: {
      popper: {
        position: strategy,
        zIndex,
        inset: '0 auto auto 0',
        minWidth: minWidth,
        visibility: 'hidden',
      },
      arrow: {
        position: 'absolute',
        zIndex: zIndex + 1,
      },
    },
    attributes: {},
  }))

  const updateStateModifier: PopperJS.Modifier<'updateState', any> = useMemo(
    () => ({
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: ({ state }) => {
        setState({
          styles: {
            popper: {
              zIndex,
              minWidth: minWidth,
              ...state.styles.popper,
            } as React.CSSProperties,
            arrow: {
              zIndex: 1,
              ...state.styles.arrow,
            } as React.CSSProperties,
          },
          attributes: state.attributes,
        })
      },
      requires: ['computeStyles'],
    }),
    [zIndex, minWidth]
  )

  const instanceRef = useRef<PopperJS.Instance | null>(null)

  const popperOptions = useMemo(() => {
    return {
      strategy,
      placement,
      modifiers: [
        getTransformOriginModifier(),
        getMatchWidthModifier(matchWidth, matchWidthStrictly),
        getEventListenersModifier(eventListeners),
        {
          name: 'arrow',
          options: {
            element: arrowElement,
            padding: arrowPadding,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [crossGap, gutterGap],
          },
        },
        {
          name: 'flip',
          enabled: flip,
          options: { padding: 8 },
        },
        {
          name: 'preventOverflow',
          enabled: preventOverflow,
          options: { boundary: 'clippingParents' },
        },
        // https://popper.js.org/docs/v2/modifiers/apply-styles//#phase
        { name: 'applyStyles', enabled: false },
        updateStateModifier,
        ...customModifiers,
      ],
    }
  }, [
    strategy,
    placement,
    crossGap,
    gutterGap,
    arrowPadding,
    eventListeners,
    matchWidth,
    flip,
    preventOverflow,
    updateStateModifier,
    customModifiers,
    arrowElement,
    matchWidthStrictly,
  ])

  const popperOptionsRef = useLatestRef(popperOptions)

  useLayoutEffect(() => {
    instanceRef.current?.setOptions(popperOptions)
  }, [popperOptions])

  useLayoutEffect(() => {
    if (nonInteractive) return
    if (!attachElement || !popperElement) return

    const instance = createPopper(attachElement, popperElement, popperOptionsRef.current)

    instance.forceUpdate()

    instanceRef.current = instance

    return () => {
      // 销毁当前的 instance
      instance.destroy()
      instanceRef.current = null
    }
  }, [nonInteractive, attachElement, popperElement, popperOptionsRef])

  useEffect(() => {
    let resizeObserver: ResizeObserver

    if (attachElement) {
      resizeObserver = new ResizeObserver(() => {
        instanceRef.current?.update()
      })
      resizeObserver.observe(attachElement as Element)
    }

    return () => {
      resizeObserver?.disconnect()
    }
  }, [attachElement])

  const onCloseLatest = useLatestCallback(() => {
    if (nonInteractive) return
    onClose?.()
  })

  const popperElRef = useLatestRef(popperElement)
  const targetElRef = useLatestRef(attachElement)

  useRefsOutsideClick(
    // @ts-ignore
    [popperElRef, targetElRef],
    mockDefaultHandlers(onOutsideClick, () => {
      if (closeOnOutsideClick) {
        onCloseLatest()
      }
    })
  )

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (closeOnEsc && evt.keyCode === 27) {
        onCloseLatest()
      }
    },
    [closeOnEsc, onCloseLatest]
  )

  const shouldRenderPopper = useLazyRender({ visible, preload, unmountOnExit: unmountOnClose })

  const getPopperProps = useCallback(
    (popperProps = {}, refs = null) => {
      const { tabIndex = -1, onKeyDown, style } = popperProps
      const { attributes, styles } = state

      // 合并 refs，同时向前兼容单个 ref 的用法
      const _refs = Array.isArray(refs) ? refs : [refs]

      return {
        ...popperProps,
        ...attributes.popper,
        ref: mergeRefs(setPopperElement, ..._refs),
        style: {
          outline: 'none',
          visibility: visible ? 'visible' : 'hidden',
          pointerEvents: visible ? 'all' : 'none',
          ...style,
          ...styles.popper,
        },
        tabIndex,
        onKeyDown: mockDefaultHandlers(onKeyDown, handleKeyDown),
      }
    },
    [state, handleKeyDown, visible]
  )

  const getArrowProps = useCallback(
    (arrowProps = {}, ref = null) => {
      const { style } = arrowProps
      const { styles } = state

      return {
        ...arrowProps,
        style: {
          ...style,
          ...styles.arrow,
        },
        ref: mergeRefs(setArrowElement, ref),
      }
    },
    [state]
  )

  return {
    shouldRenderPopper,
    styles: state.styles,
    attributes: state.attributes,
    update() {
      instanceRef.current?.update()
    },
    forceUpdate() {
      instanceRef.current?.forceUpdate()
    },
    popperElement,
    arrowElement,
    getPopperProps,
    getArrowProps,
  }
}

type PopperState = {
  styles: {
    [key: string]: React.CSSProperties
  }
  attributes: {
    [key: string]: {
      [key: string]: string | boolean
    }
  }
}

export type PopperPlacementEnum = PopperJS.Placement | undefined

export interface UsePopperProps {
  /**
   * 开启 popper 展示（受控）
   */
  visible: boolean
  /**
   * reference 目标元素，吸附跟随的节点
   */
  attachEl: Element | PopperJS.VirtualElement | null
  /**
   * 设置基于 reference 元素的间隙偏移量
   */
  gutterGap?: number
  /**
   * 设置基于 reference 元素的正交偏移量
   */
  crossGap?: number
  /**
   * 设置边缘区域可见
   */
  preventOverflow?: boolean
  /**
   * 自动反转，尽可能保证显示在可视区域
   */
  flip?: boolean
  /**
   * 自动计算匹配吸附元素的宽度与其一致
   */
  matchWidth?: boolean
  /**
   * 弹出层最小宽度
   */
  minWidth?: React.ReactText
  /**
   * 开启宽度匹配严格模式，将不会根据内容自适应撑开
   */
  matchWidthStrictly?: boolean
  /**
   * 开启重新定位，当 `scroll` 和 `resize` 触发时
   */
  eventListeners?: boolean | { scroll?: boolean; resize?: boolean }
  /**
   * 相对吸附元素的位置
   */
  placement?: PopperPlacementEnum
  /**
   * 自定义 popper.js 的装饰器
   */
  modifiers?: ReadonlyArray<Partial<PopperJS.Modifier<string, any>>>
  /**
   * 设置 arrow 的 padding，避免 arrow 处在 popper 边界
   */
  arrowPadding?: number
  /**
   * 设置 popper 的 css 定位方式
   */
  strategy?: 'absolute' | 'fixed'
  /**
   * 手动指定 css 展示层级
   */
  zIndex?: number
  /**
   * 开启按键 Esc 时触发 onClose 回调
   */
  closeOnEsc?: boolean
  /**
   * 关闭 popper 时回调
   */
  onClose?: () => void
  /**
   * 开启点击外部时触发 onClose 回调
   * TODO: 移除，使用失焦控制
   */
  closeOnOutsideClick?: boolean
  /**
   * 外界元素点击数触发
   */
  onOutsideClick?: (evt: React.SyntheticEvent) => void
  /**
   * 开启 popper 预加载渲染，用于性能优化，优先级小于 `unmountOnClose`
   */
  preload?: boolean
  /**
   * 开启 popper 关闭时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnClose?: boolean
}

export type UsePopperReturn = ReturnType<typeof usePopper>

export const getMatchWidthModifier = (
  enabled: boolean,
  matchWidthStrictly: boolean
): PopperJS.Modifier<'matchWidth', any> => {
  return {
    name: 'matchWidth',
    enabled,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }) => {
      const widthValue = `${state.rects.reference.width}px`

      if (matchWidthStrictly) {
        state.styles.popper.minWidth = widthValue
      }
      state.styles.popper.width = widthValue
    },
    effect: ({ state }) => () => {
      const reference = state.elements.reference as HTMLElement
      const widthValue = `${reference.offsetWidth}px`

      if (matchWidthStrictly) {
        state.elements.popper.style.minWidth = widthValue
      }
      state.elements.popper.style.width = widthValue
    },
  }
}

const defaultEventListeners = {
  scroll: true,
  resize: true,
}

export const getEventListenersModifier = (
  value?: boolean | Partial<typeof defaultEventListeners>
) => {
  if (typeof value === 'object') {
    return {
      name: 'eventListeners',
      enabled: true,
      options: Object.assign({}, defaultEventListeners, value),
    }
  }

  return {
    name: 'eventListeners',
    enabled: value,
    options: defaultEventListeners,
  }
}

const transforms: any = {
  top: 'center bottom',
  'top-start': 'left bottom',
  'top-end': 'right bottom',

  bottom: 'center top',
  'bottom-start': 'left top',
  'bottom-end': 'right top',

  left: 'center right',
  'left-start': 'top right',
  'left-end': 'bottom right',

  right: 'center left ',
  'right-start': 'top left ',
  'right-end': 'bottom left ',
}

const setTransformOrigin = (state: PopperJS.State) => {
  state.elements.popper.style.setProperty('--popper-transform-origin', transforms[state.placement])
}

const getTransformOriginModifier = (): PopperJS.Modifier<'transformOrigin', any> => {
  return {
    name: 'transformOrigin',
    enabled: true,
    phase: 'write',
    fn: ({ state }) => {
      setTransformOrigin(state)
    },
    effect: ({ state }) => () => {
      setTransformOrigin(state)
    },
  }
}
