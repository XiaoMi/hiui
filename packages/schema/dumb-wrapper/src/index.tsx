import React from 'react'
import { useDebounceFn } from 'ahooks'

// 提取受控组件的必要类型
type ControlledComponentProps<T = unknown> = {
  value?: T
  onChange?: (...args: AnyType[]) => void
  defaultValue?: T
  disabled?: boolean
  onBlur?: (...args: AnyType[]) => void
}

type DumbWrapperOptsType<P extends ControlledComponentProps<T>, T = unknown> = {
  /** 防抖等待时间(ms) */
  wait?: number
  /** 从 onChange 参数中提取值的方法 */
  getChangedValue?: (...args: Parameters<NonNullable<P['onChange']>>) => T
}

/**
 * DumbWrapper - 让组件变得"迟钝"的高阶组件
 *
 * 主要功能:
 * 1. 包装受控组件，使其 onChange 触发变得"迟钝"(防抖)
 * 2. 维护内部状态，实时响应用户输入
 * 3. 延迟通知外部状态变化
 * 4. 失焦时立即同步状态
 *
 * @template T - 组件值的类型
 * @template P - 组件的 Props 类型,需要继承自 ControlledComponentProps<T>
 */
export function DumbWrapper<
  T = unknown,
  P extends ControlledComponentProps<T> = ControlledComponentProps<T>
>(props: DumbWrapperOptsType<P, T> & { children: React.ReactElement }) {
  const { children, ...options } = props

  // 确保children是单个React元素
  const child = React.Children.only(children)

  // 使用 mapToDumb 包装
  const DumbComponent = mapToDumb(child.type as React.ComponentType<P>, options)

  // 传递原始 props 到包装后的组件
  return <DumbComponent {...(child.props as P)} />
}

export function mapToDumb<
  T = unknown,
  P extends ControlledComponentProps<T> = ControlledComponentProps<T>
>(WrappedComponent: React.ComponentType<P>, options: DumbWrapperOptsType<P, T> = {}) {
  const {
    // 默认300ms
    wait = 300,
    // 默认取最后一个参数作为值
    getChangedValue = (...args: unknown[]) => args[args.length - 1] as T,
  } = options

  return function DumbComponent(props: P) {
    const [innerValue, setInnerValue] = React.useState<T | undefined>(
      props.value ?? props.defaultValue
    )

    // 外部value变化时同步更新内部状态
    React.useEffect(() => {
      if (props.value !== undefined) {
        setInnerValue(props.value)
      }
    }, [props.value])

    // 防抖通知外部
    // 不必单独在卸载时调用返回的 cancel 方法，因为 useDebounceFn 会自动在组件卸载时取消
    const { run: notifyChange, flush: flushNotifyChange } = useDebounceFn(
      (...args: unknown[]) => {
        props.onChange?.(...args)
      },
      { wait }
    )

    const handleChange = (...args: Parameters<NonNullable<P['onChange']>>) => {
      // disabled 状态不处理
      if (props.disabled) return

      // 使用指定方法提取新值
      const newValue = getChangedValue(...args)
      // 实时更新内部状态
      setInnerValue(newValue)
      // 延迟通知外部
      notifyChange(...args)
    }

    // 处理 blur 时立即同步
    const handleBlur = (...args: Parameters<NonNullable<P['onBlur']>>) => {
      flushNotifyChange()
      props.onBlur?.(...args)
    }

    return (
      <WrappedComponent
        // WrappedComponent
        {...props}
        value={innerValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }
}
