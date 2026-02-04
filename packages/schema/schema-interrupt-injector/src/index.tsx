import React from 'react'
import { useLatest } from 'ahooks'
import { isNil } from 'lodash-es'
import { isInvalidValue } from '@hi-ui/schema-utils'
import { ModalApi, type ModalApiProps } from '@hi-ui/schema-modal-extensions'

export type CustomInterruptFnCtxType = {
  originalOnChange: AnyFn
  args: AnyArray
  prevValue: unknown
}

export type InterruptConfigType = {
  /** 提示标题 */
  title?: string
  /** 提示内容 */
  content?: React.ReactNode
  /** 确认按钮文案 */
  confirmText?: string
  /** 取消按钮文案 */
  cancelText?: string
  /**
   * 是否跳过确认
   * - 开启后，将不再显示确认对话框，默认不开启
   * - 建议配合 isNextInvalid 使用，否则中断配置就没有什么意义了
   */
  skipConfirm?: boolean
  /** 确认时的回调函数 */
  onConfirm?: (...args: AnyArray) => void | Promise<void>
  /** 取消时的回调函数 */
  onCancel?: (...args: AnyArray) => void | Promise<void>
  /**
   * 前一个值是否无效
   * @deprecated 请使用 isPrevValueInvalid 替代
   */
  isValueInvalid?: (value: unknown) => boolean
  /**
   * 前一个值是否无效
   * - 前一个值无效时(此函数返回true)，将不再触发拦截
   * - 默认判断逻辑为：是否为 null/undefined/空串/空数组
   */
  isPrevInvalid?: (value: unknown) => boolean
  /**
   * 下一个值是否无效
   * - 下一个值无效时(此函数返回true)，将不再触发拦截
   * - 参数为底层组件的 onChange 的参数，请自行处理
   * - 默认无此函数，即认为下一个值均有效
   */
  isNextInvalid?: (...args: AnyArray) => boolean
  /**
   * 默认空值
   * - 若字段值为空，使用 isNextInvalid 选中无效值时
   * - 会导致表单数据不变，但选项值显示未无效值
   * - 此时可使用该配置，将使用该值覆盖初值
   * - 若不提供，则保持原始行为，初次视觉上可以选择无效值，实际表单值未变化
   */
  dftEmptyValue?: unknown
  /**
   * 自定义中断拦截
   * - 若提供，则直接执行该函数，不再执行默认的中断逻辑
   */
  customInterrupt?: (ctx: CustomInterruptFnCtxType) => void
  /** 其他Modal配置 */
  modalProps?: Omit<ModalApiProps, 'onConfirm' | 'onCancel' | 'content' | 'title'>
}

export type InterruptInjectorProps = {
  /** 中断配置，如果提供则启用中断拦截，否则不拦截 */
  config?: InterruptConfigType
  /** 子组件 */
  children: React.ReactElement
}

export function InterruptInjector(props: InterruptInjectorProps) {
  const { config, children, ...restProps } = props

  // 从子组件或者 props 获取原始的属性
  const originalOnChange = getPropOrChildrenProp<AnyFn>(props, children, 'onChange')
  const currentValue = getPropOrChildrenProp<unknown>(props, children, 'value')
  // 记录从外部注入的最新的字段值，用于判断是否需要拦截
  const latestValueRef = useLatest(currentValue)

  // 如果没有提供 config，直接返回原组件（完全透明）
  if (!config) {
    // 直接返回原组件，也包含由父组件传递的 props
    return React.cloneElement(children, { ...restProps, ...children.props })
  }

  const {
    title = '请确认',
    content = '确认要变更吗？',
    confirmText = '确认',
    cancelText = '取消',
    skipConfirm,
    onConfirm,
    onCancel,
    dftEmptyValue,
    customInterrupt,
    modalProps = {},
  } = config

  const isPrevValueInvalid = config.isPrevInvalid ?? config.isValueInvalid ?? isInvalidValue
  const isNextValueInvalid = config.isNextInvalid

  // 被拦截的 onChange 处理函数
  function interceptedOnChange(...args: AnyArray) {
    if (!originalOnChange || typeof originalOnChange !== 'function') {
      return
    }

    // 如果自定义中断拦截，则直接执行
    if (customInterrupt) {
      // 累了，毁灭吧，爱咋中断咋中断
      customInterrupt({ originalOnChange, args, prevValue: latestValueRef.current })
      return
    }

    // 如果下一个值无效，则直接退出
    if (isNextValueInvalid?.(...args)) {
      // dftEmptyValue 不为空，并且前一个值是无效值
      if (!isNil(dftEmptyValue) && isPrevValueInvalid(latestValueRef.current)) {
        // 主动触发一次onChange
        originalOnChange(dftEmptyValue)
      }

      return
    }

    // 如果前一个值无效，则直接执行原始 onChange（不拦截）
    // 这通常发生在初始化或从空值开始输入的场景
    if (isPrevValueInvalid(latestValueRef.current)) {
      originalOnChange(...args)
      return
    }

    // 如果跳过确认，则直接执行原始 onChange
    if (skipConfirm) {
      originalOnChange(...args)
      return
    }

    // 显示确认对话框
    ModalApi.open({
      title,
      content,
      confirmText,
      cancelText,
      ...modalProps,
      onConfirm: async () => {
        try {
          // 执行用户配置的确认回调
          await onConfirm?.(...args)
          // 确认后才执行原始的 onChange
          originalOnChange(...args)
        } catch (error) {
          // 若确认回调出错，则不执行原始的 onChange
          console.log('Interrupt injector confirm callback error:', error)
        }
      },
      onCancel: async () => {
        try {
          // 执行用户配置的取消回调
          await onCancel?.(...args)
          // 取消时不执行原始的 onChange
        } catch (error) {
          console.log('Interrupt injector cancel callback error:', error)
        }
      },
    })
  }

  // 克隆 children 并注入被拦截的 onChange
  return React.cloneElement(children, {
    // restProps/children.props 这俩值一般只会存在一个
    ...restProps,
    ...children.props,
    onChange: interceptedOnChange,
  })
}

/**
 * 智能获取属性值的 hook
 * 先尝试从 props 上取值，再尝试从 children.props 上取值
 * @param props InterruptInjector 的 props
 * @param children 子组件
 * @param propName 要获取的属性名
 * @returns 属性值
 */
export function getPropOrChildrenProp<T = unknown>(
  props: Record<string, unknown>,
  children: React.ReactElement,
  propName: string
): T | undefined {
  // 先检查 props 中是否有该属性
  if (propName in props) {
    return props[propName] as T
  }

  // 再检查 children.props 中是否有该属性
  if (children?.props && propName in children.props) {
    return children.props[propName] as T
  }

  return undefined
}
