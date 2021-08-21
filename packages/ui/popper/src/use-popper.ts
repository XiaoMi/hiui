import { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import * as PopperJS from '@popperjs/core'
import { createPopper } from '@popperjs/core'
import { useUnmountEffect } from '@hi-ui/use-unmount-effect'
import { useLatestRef } from '@hi-ui/use-latest'

const NOOP_ARRAY = [] as []

export const usePopper = (
  targetElement: Element | PopperJS.VirtualElement | null,
  popperElement: HTMLElement | null,
  props: UsePopperProps = {}
) => {
  const {
    disabled = false,
    modifiers: customModifiers = NOOP_ARRAY,
    strategy = 'absolute',
    placement = 'bottom-start',
    cross = 0,
    gutter = 8,
    arrowPadding = 6,
    flip = true,
    matchWidth = true,
    eventListeners = true,
    preventOverflow = true,
  } = props

  const targetElRef = useLatestRef(targetElement)
  const popperElRef = useLatestRef(popperElement)

  const [state, setState] = useState<PopperState>(() => ({
    styles: {
      popper: {
        position: strategy,
        left: '0',
        top: '0',
        minWidth: 'max-content',
        inset: '0 auto auto 0',
      },
      arrow: {
        position: 'absolute',
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
        console.log(state)

        setState({
          styles: {
            popper: state.styles.popper || {},
            arrow: state.styles.arrow || {},
          },
          attributes: state.attributes,
        })
      },
      requires: ['computeStyles'],
    }),
    []
  )

  const instanceRef = useRef<PopperJS.Instance | null>(null)

  const destroyInstance = useCallback(() => {
    instanceRef.current?.destroy()
    instanceRef.current = null
  }, [])

  const setupPopper = useCallback(
    (targetEl: Element | PopperJS.VirtualElement | null, popperEl: HTMLElement | null) => {
      if (disabled) return

      if (!targetEl || !popperEl) return

      destroyInstance()

      instanceRef.current = createPopper(targetEl, popperEl, {
        strategy,
        placement,
        modifiers: [
          getMatchWidthModifier(matchWidth),
          getEventListenersModifier(eventListeners),
          {
            name: 'arrow',
            options: {
              padding: arrowPadding,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [cross, gutter],
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
          },
          updateStateModifier,
          { name: 'applyStyles', enabled: false },
          ...customModifiers,
        ],
      })

      instanceRef.current.forceUpdate()
    },
    [
      disabled,
      strategy,
      placement,
      cross,
      gutter,
      arrowPadding,
      eventListeners,
      matchWidth,
      flip,
      preventOverflow,
      updateStateModifier,
      customModifiers,
      destroyInstance,
    ]
  )

  useUnmountEffect(() => {
    if (!targetElRef.current || !popperElRef.current) {
      destroyInstance()
    }
  })

  useEffect(() => {
    setupPopper(targetElement, popperElement)
  }, [targetElement, popperElement, setupPopper])

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
    [key: string]: Partial<CSSStyleDeclaration>
  }
  attributes: {
    [key: string]: {
      [key: string]: string | boolean
    }
  }
}

export interface UsePopperProps {
  /**
   * 是否禁用 popper
   */
  disabled?: boolean
  /**
   * 设置基于 reference 元素的间隙偏移量
   */
  gutter?: number
  /**
   * 设置基于 reference 元素的正交偏移量
   */
  cross?: number
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
   * 自定义 popper.js 的装饰器，可以覆盖已有的
   */
  modifiers?: ReadonlyArray<PopperJS.Modifier<string, any>>
  /**
   * 设置 arrow 的 padding，用来避免 arrow 处在 popper 的边界
   */
  arrowPadding?: number
  /**
   * 设置 popper 的 css 定位方式
   */
  strategy?: 'absolute' | 'fixed'
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
