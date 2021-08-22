import React, { useRef, useState, useMemo, useLayoutEffect } from 'react'
import * as PopperJS from '@popperjs/core'
import { createPopper } from '@popperjs/core'
import { useLatestRef } from '@hi-ui/use-latest'

const NOOP_ARRAY = [] as []

export const usePopper = (props: UsePopperProps) => {
  const {
    targetElement,
    popperElement,
    arrowElement,
    disabled = false,
    modifiers: customModifiers = NOOP_ARRAY,
    strategy = 'absolute',
    placement = 'bottom-start',
    zIndex,
    crossGap = 0,
    gutterGap = 8,
    arrowPadding = 12,
    flip = true,
    matchWidth = false,
    eventListeners = true,
    preventOverflow = true,
  } = props

  const [state, setState] = useState<PopperState>(() => ({
    styles: {
      popper: {
        position: strategy,
        zIndex,
        inset: '0 auto auto 0',
        minWidth: 'max-content',
        visibility: 'hidden',
      },
      arrow: {
        position: 'absolute',
        zIndex: 1,
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
              visibility: 'visible',
              // 保证内容能正常展示，即使开启了 matchWidth
              minWidth: 'max-content',
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
    [zIndex]
  )

  const instanceRef = useRef<PopperJS.Instance | null>(null)

  const popperOptions = useMemo(() => {
    return {
      strategy,
      placement,
      modifiers: [
        getTransformOriginModifier(),
        getMatchWidthModifier(matchWidth),
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
  ])

  const popperOptionsRef = useLatestRef(popperOptions)

  useLayoutEffect(() => {
    instanceRef.current?.setOptions(popperOptions)
  }, [popperOptions])

  useLayoutEffect(() => {
    if (disabled) return
    if (!targetElement || !popperElement) return

    const instance = createPopper(targetElement, popperElement, popperOptionsRef.current)

    instance.forceUpdate()

    instanceRef.current = instance

    return () => {
      // 销毁当前的 instance
      instance.destroy()
      instanceRef.current = null
    }
  }, [disabled, targetElement, popperElement, popperOptionsRef])

  return {
    styles: state.styles,
    attributes: state.attributes,
    update() {
      instanceRef.current?.update()
    },
    forceUpdate() {
      instanceRef.current?.forceUpdate()
    },
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

export interface UsePopperProps {
  /**
   * reference 目标元素
   */
  targetElement: Element | PopperJS.VirtualElement | null
  /**
   * popper 所在元素
   */
  popperElement: HTMLElement | null
  /**
   * arrow 所在元素
   */
  arrowElement?: HTMLElement | null
  /**
   * 是否禁用 popper
   */
  disabled?: boolean
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
   * 自动计算匹配 reference 的宽度与其一致
   */
  matchWidth?: boolean
  /**
   * 开启重新定位，当 `scroll` 和 `resize` 触发时
   */
  eventListeners?: boolean | { scroll?: boolean; resize?: boolean }
  /**
   * 相对 reference 的位置
   */
  placement?: PopperJS.Placement
  /**
   * 自定义 popper.js 的装饰器
   */
  modifiers?: ReadonlyArray<PopperJS.Modifier<string, any>>
  /**
   * 设置 arrow 的 padding，避免 arrow 处在 popper 边界
   */
  arrowPadding?: number
  /**
   * 设置 popper 的 css 定位方式
   */
  strategy?: 'absolute' | 'fixed'
  /**
   * 手动指定层级
   */
  zIndex?: number
}

export const getMatchWidthModifier = (enabled: boolean): PopperJS.Modifier<'matchWidth', any> => {
  return {
    name: 'matchWidth',
    enabled,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }) => {
      state.styles.popper.width = `${state.rects.reference.width}px`
    },
    effect: ({ state }) => () => {
      const reference = state.elements.reference as HTMLElement
      state.elements.popper.style.width = `${reference.offsetWidth}px`
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
