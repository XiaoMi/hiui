/**
 * useModalContext：在「当前 React 树」内渲染确认框，使弹层内容能访问外层 Context（主题、国际化等）。
 *
 * 原理简述：
 * - 静态 API（Modal.confirm）用 createRoot 在独立容器渲染 → 新 React 树 → 拿不到 Context。
 * - 本 Hook 通过 usePatchElement 把每次 confirm 的弹框「挂」到一个占位节点（contextHolder）下，
 *   占位节点由调用方放在自己的 JSX 里（通常在 Provider 下），所以弹框和页面在同一棵树里，Context 可用。
 *
 * 流程：confirm(config) → 创建 <HookModal> 元素 → patchElement 塞进 holder → holder 在用户树里渲染
 *      关闭/动画结束 → 调用 afterClose → 执行 patchElement 返回的卸载函数，从 holder 里移除该元素
 */
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { usePatchElement } from '@hi-ui/use-patch-element'
import { Modal as PureModal, ModalProps } from './Modal'
import { uuid } from '@hi-ui/use-id'

export interface UseModalContextModalApiProps extends Omit<ModalProps, 'visible' | 'innerRef'> {
  key?: string
  content?: React.ReactNode
}

export interface ModalInstance {
  /** 主动关闭当前弹框并从 React 树中移除 */
  close: () => void
  /**
   * Promise 风格：用户点击「确定」时 resolve(true)，点击「取消」或关闭时 resolve(false)
   * - 用于在用户选择后再执行后续逻辑，如 `modal.confirm({...}).then(ok => { if (ok) ... })`
   */
  then: <T>(resolve: (confirmed: boolean) => T) => Promise<T>
}

interface ElementsHolderRef {
  patchElement: ReturnType<typeof usePatchElement>[1]
}

// ---------- 步骤 1：占位组件，负责在「当前树」里渲染所有被 patch 进来的弹框实例 ----------
const ElementsHolder = React.memo(
  React.forwardRef<ElementsHolderRef>((_props, ref) => {
    const [elements, patchElement] = usePatchElement()
    React.useImperativeHandle(ref, () => ({ patchElement }), [patchElement])
    return <>{elements}</>
  })
)

ElementsHolder.displayName = 'ElementsHolder'

interface HookModalProps {
  config: UseModalContextModalApiProps
  afterClose: () => void
  onResolve: (confirmed: boolean) => void
}

// ---------- 步骤 2：单次「逻辑弹框」包装器，管 visible / 确认取消 / 关闭后从树中移除 ----------
const HookModal = React.forwardRef<
  { close: () => void; updateConfirmLoading: (v: boolean) => void },
  HookModalProps
>(({ config, afterClose, onResolve }, ref) => {
  const [visible, setVisible] = useState(true)
  const modalRef = React.useRef<{
    close: () => void
    updateConfirmLoading: (v: boolean) => void
  } | null>(null)
  const closeFn = useCallback(() => setVisible(false), [])

  React.useImperativeHandle(
    ref,
    () => modalRef.current ?? { close: closeFn, updateConfirmLoading: () => {} },
    [closeFn]
  )

  const { onConfirm, onCancel } = config ?? {}
  const handleConfirm = useCallback(async () => {
    modalRef.current?.updateConfirmLoading(true)
    try {
      await onConfirm?.()
      onResolve(true)
    } catch (e) {
      console.warn('onConfirm error', e)
      onResolve(false)
    } finally {
      modalRef.current?.updateConfirmLoading(false)
      closeFn()
    }
  }, [onConfirm, onResolve, closeFn])

  const handleCancel = useCallback(() => {
    onCancel?.()
    onResolve(false)
    closeFn()
  }, [onCancel, onResolve, closeFn])

  // 动画结束后从 ElementsHolder 里移除本实例（调用 patchElement 返回的卸载函数）
  const handleExited = useCallback(() => {
    afterClose()
  }, [afterClose])

  const { content, width = 400, ...rest } = config
  const modalContent = content ? <div style={{ paddingLeft: 32 }}>{content}</div> : config.children

  return (
    <PureModal
      {...rest}
      width={width}
      showHeaderDivider={false}
      type={rest.type ?? 'info'}
      visible={visible}
      innerRef={modalRef}
      onExited={handleExited}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      {modalContent}
    </PureModal>
  )
})

HookModal.displayName = 'HookModal'

// ---------- 步骤 3：Hook 暴露 confirm + contextHolder；confirm 时 patch 到 holder，关闭时通过 afterClose 卸载 ----------
export interface UseModalContextModalApi {
  open: (config: UseModalContextModalApiProps) => ModalInstance
  confirm: (config: UseModalContextModalApiProps) => ModalInstance
}

export function useModalContext(): [UseModalContextModalApi, React.ReactElement] {
  const holderRef = useRef<ElementsHolderRef>(null)
  // 若在首帧就调用 instance.destroy()，此时 ref 可能尚未挂载，先入队，在 useEffect 里再执行
  const [actionQueue, setActionQueue] = useState<Array<() => void>>([])

  useEffect(() => {
    if (actionQueue.length > 0) {
      const queue = [...actionQueue]
      setActionQueue([])
      queue.forEach((fn) => fn())
    }
  }, [actionQueue])

  const confirm = useCallback((config: UseModalContextModalApiProps) => {
    const key = config.key ?? uuid()
    const hookModalRef = React.createRef<{
      close: () => void
      updateConfirmLoading: (v: boolean) => void
    }>()
    let resolvePromise!: (confirmed: boolean) => void
    const promise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })

    const afterClose = () => {
      closeFunc?.()
    }

    const modal = (
      <HookModal
        key={`modal-${key}`}
        ref={hookModalRef}
        config={config}
        afterClose={afterClose}
        onResolve={resolvePromise}
      />
    )

    // 关键：把本次弹框实例挂到 contextHolder 下，并拿到「从树中移除」的函数
    const closeFunc = holderRef.current?.patchElement(modal)

    const instance: ModalInstance = {
      close: () => {
        const closeAction = () => hookModalRef.current?.close()
        if (hookModalRef.current) {
          closeAction()
        } else {
          setActionQueue((prev) => [...prev, closeAction])
        }
      },
      then: (resolve) => promise.then(resolve),
    }

    return instance
  }, [])

  const modalApi = React.useMemo(() => ({ confirm, open: confirm }), [confirm])

  // contextHolder 必须由调用方放在需要消费 Context 的 Provider 下方
  return [modalApi, <ElementsHolder key="modal-context-holder" ref={holderRef} />]
}
