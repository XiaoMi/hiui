/**
 * useDrawerContext：在「当前 React 树」内渲染抽屉，使抽屉内容能访问外层 Context（主题、国际化等）。
 *
 * 原理简述：
 * - 静态 API（Drawer.open）用 createRoot 在独立容器渲染 → 新 React 树 → 拿不到 Context。
 * - 本 Hook 通过 usePatchElement 把每次 open 的抽屉「挂」到一个占位节点（contextHolder）下，
 *   占位节点由调用方放在自己的 JSX 里（通常在 Provider 下），所以抽屉和页面在同一棵树里，Context 可用。
 *
 * 流程：open(config) → 创建 <DrawerManager> 元素 → patchElement 塞进 holder → holder 在用户树里渲染这些元素
 *      关闭/动画结束 → 调用 afterClose → 执行 patchElement 返回的卸载函数，从 holder 里移除该元素
 */
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { uuid } from '@hi-ui/use-id'
import { usePatchElement } from '@hi-ui/use-patch-element'
import { DrawerProps } from './Drawer'
import { DrawerManager } from './with-api'
import type { DrawerManagerRef } from './with-api'

export interface UseDrawerApiProps extends Omit<DrawerProps, 'visible'> {
  content?: React.ReactNode
  key?: string
  confirmText?: React.ReactNode | null
  cancelText?: React.ReactNode | null
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export interface DrawerInstance {
  /** 主动关闭当前抽屉并从 React 树中移除 */
  close: () => void
  /**
   * Promise 风格：用户点击「确定」时 resolve(true)，点击「取消」或关闭时 resolve(false)
   * - 用于在用户选择后再执行后续逻辑，如 `drawer.open({...}).then(ok => { if (ok) ... })`
   */
  then: <T>(resolve: (confirmed: boolean) => T) => Promise<T>
}

interface ElementsHolderRef {
  patchElement: ReturnType<typeof usePatchElement>[1]
}

// ---------- 步骤 1：占位组件，负责在「当前树」里渲染所有被 patch 进来的抽屉实例 ----------
const ElementsHolder = React.memo(
  React.forwardRef<ElementsHolderRef>((_props, ref) => {
    const [elements, patchElement] = usePatchElement()
    React.useImperativeHandle(ref, () => ({ patchElement }), [patchElement])
    return <>{elements}</>
  })
)
ElementsHolder.displayName = 'DrawerElementsHolder'

// ---------- 步骤 2：使用 with-api 的 DrawerManager，传入 onExited=afterClose、onResolve，关闭后从树中移除 ----------

// ---------- 步骤 3：Hook 暴露 open + contextHolder；open 时 patch 到 holder，关闭时通过 afterClose 卸载 ----------
export interface UseDrawerContextDrawerApi {
  open: (config: UseDrawerApiProps) => DrawerInstance
}

export function useDrawerContext(): [UseDrawerContextDrawerApi, React.ReactElement] {
  const holderRef = useRef<ElementsHolderRef>(null)
  // 若在首帧就调用 instance.close()，此时 ref 可能尚未挂载，先入队，在 useEffect 里再执行
  const [actionQueue, setActionQueue] = useState<Array<() => void>>([])

  useEffect(() => {
    if (actionQueue.length > 0) {
      const queue = [...actionQueue]
      setActionQueue([])
      queue.forEach((fn) => fn())
    }
  }, [actionQueue])

  const open = useCallback((config: UseDrawerApiProps) => {
    const key = config.key ?? uuid()
    const hookDrawerRef = React.createRef<DrawerManagerRef>()
    let resolvePromise!: (confirmed: boolean) => void
    const promise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })

    const afterClose = () => {
      closeFunc?.()
    }

    const drawer = (
      <DrawerManager
        key={`drawer-${key}`}
        ref={hookDrawerRef}
        {...config}
        onExited={afterClose}
        onResolve={resolvePromise}
      />
    )

    // 关键：把本次抽屉实例挂到 contextHolder 下，并拿到「从树中移除」的函数
    const closeFunc = holderRef.current?.patchElement(drawer)

    const instance: DrawerInstance = {
      close: () => {
        const closeAction = () => hookDrawerRef.current?.close()
        if (hookDrawerRef.current) {
          closeAction()
        } else {
          setActionQueue((prev) => [...prev, closeAction])
        }
      },
      then: (resolve) => promise.then(resolve),
    }

    return instance
  }, [])

  const drawerApi = React.useMemo(() => ({ open }), [open])

  // contextHolder 必须由调用方放在需要消费 Context 的 Provider 下方
  return [drawerApi, <ElementsHolder key="drawer-context-holder" ref={holderRef} />]
}
