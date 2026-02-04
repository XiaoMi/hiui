import Emittery from 'emittery'
import { isEqual, get } from 'lodash-es'
import { mergeValues, type PatchType } from '@hi-ui/schema-utils'

// 定义事件类型
export type Events<T> = {
  stateChange: {
    value: T
    prev: T
    changedValues: PatchType<T>
    extra?: NotifyOpts
  }
  error: Error
}

export type SubscriptionExtraOpts = {
  /** setValue 时是否开启严格比较 */
  strictCompareWhenSetValue?: boolean
}

type NotifyOpts = {
  /** 标记是否静默更新 */
  silent?: boolean
  /** 标记是否完全更新 */
  complete?: boolean
}

export type EventListenerType<T> = (value: Events<T>['stateChange']) => void

export type BatchUpdateResult<T> = {
  changedValues: PatchType<T>
  allValues: T
}

/** 路径片段类型 */
type PathSegment = string | number | symbol
/** 单个完整路径 */
type SinglePath = PathSegment[]
/** 路径类型 */
type PathType = SinglePath | SinglePath[]

/** 订阅选项 */
export type SubscribeOptions = {
  /**
   * 订阅的数据路径
   * @example [0, 'name'] - 订阅单个路径，内部会自动转换为 [[0, 'name']]
   * @example [[0, 'name'], [1, 'age']] - 订阅多个关联路径
   * @example [['name'], ['age']] - 订阅对象中的多个字段路径(使用较少)
   * @example ['name', 'age'] - 【反例】会被认为是订阅 Obj.name.age，而不是订阅 Obj.name 和 Obj.age
   */
  path?: PathType
}

export class Subscription<T> {
  /** 配置项 */
  opts: SubscriptionExtraOpts

  /** 当前值 */
  #value: T
  /** 前一个值 */
  #prev: T
  /** 事件发射器 */
  #emitter = new Emittery<Events<T>>()
  /** 订阅者集合 */
  #listeners = new Set<EventListenerType<T>>()
  /** 路径订阅者集合 */
  #pathListeners = new Set<{ path: PathType; listener: EventListenerType<T> }>()

  /** 暂存的草稿补丁集合 */
  #draft: PatchType<T> | null = null

  // 批量更新相关的状态
  readonly #batchUpdateRef = {
    /** 待处理的更新 */
    pendingUpdates: {} as PatchType<T>,
    /** 是否已调度更新 */
    isBatchUpdateScheduled: false,
    /** 当前批量更新的 Promise */
    currentBatchPromise: null as Promise<void> | null,
    /** 批量更新的结果 */
    batchUpdateResult: null as BatchUpdateResult<T> | null,
  }

  /**
   * 只读的当前值
   * @desc 与 getValue 等价，是为了debug时可以直接读取
   */
  get value(): T {
    return this.#value
  }

  /**
   * 只读的前一个值
   * @desc 与 getPrevValue 等价，是为了debug时可以直接读取
   */
  get prev(): T {
    return this.#prev
  }

  constructor(initialValue: T, opts: SubscriptionExtraOpts = {}) {
    this.#prev = initialValue
    this.#value = initialValue

    this.opts = opts
  }

  /**
   * 赋值，同时记录前一个值
   */
  protected assign(nextValue: T) {
    this.#prev = this.#value
    this.#value = nextValue
  }

  /**
   * 过滤出真正变化的值
   */
  protected filterChangedValues(patch?: PatchType<T>): PatchType<T> | undefined {
    if (!patch) return undefined

    // 处理原始值的情况
    if (typeof patch !== 'object') {
      return !isEqual(this.value, patch) ? patch : undefined
    }

    return filterObjectChanges(patch, this.value) as PatchType<T>
  }

  /**
   * 触发状态变更通知
   */
  notify(changedValues?: PatchType<T>, options?: NotifyOpts) {
    try {
      this.#emitter.emit('stateChange', {
        value: this.value,
        prev: this.prev,
        changedValues: changedValues ?? (this.value as PatchType<T>),
        extra: {
          ...options,
        },
      })
    } catch (err) {
      this.#emitter.emit('error', err as Error)
    }
  }

  /**
   * 获取当前状态值
   * @returns 返回当前存储的状态值
   */
  // 基础操作: 获取值
  getValue(): T {
    return this.#value
  }

  /**
   * 获取前一个状态值
   * @returns 返回前一个存储的状态值
   */
  getPrevValue(): T {
    return this.#prev
  }

  /**
   * 直接设置新的状态值并触发通知
   * @param value 新的状态值或更新函数
   * @desc 支持直接传值或函数式更新
   * @desc 不会修改原始值,而是创建新值
   * @example
   * subscription.setValue(newValue)
   * subscription.setValue(prev => ({ ...prev, count: prev.count + 1 }))
   */
  // 基础操作: 设置新值 + 通知
  setValue(newValue: T | ((prev: T) => T), extra?: Pick<NotifyOpts, 'silent' | 'complete'>): void {
    try {
      const nextValue =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(this.value)
          : // setValue
            newValue

      // 严格比较时，会增加一步操作，过滤出真正变化的值
      const strictCompare = this.opts.strictCompareWhenSetValue
      const changedValues = strictCompare
        ? this.filterChangedValues(nextValue as PatchType<T>)
        : undefined

      this.assign(nextValue)
      this.notify(changedValues, { complete: extra?.complete ?? true, silent: extra?.silent })
    } catch (err) {
      this.#emitter.emit('error', err as Error)
    }
  }

  /**
   * 合并值，但仅触发静默通知
   * @param patch 要合并的部分值
   * - 本质是 mergeValue 的简易别名
   * subscription.mergeSilently({ name: 'John' })
   */
  // 基础操作: 修改原值
  mergeSilently(patch: PatchType<T>, extra?: Pick<NotifyOpts, 'complete'>): void {
    this.mergeValue(patch, { complete: extra?.complete, silent: true })
  }

  /**
   * 合并值并触发通知
   * @param patch 要合并的部分值
   * @desc 支持对象和数组的深度合并
   * @desc 不会修改原始值,而是创建新值
   * @desc 会触发订阅者的通知
   * @example
   * subscription.mergeValue({ name: 'John' })
   */
  // 基础操作: 合并值 + 通知
  mergeValue(patch: PatchType<T>, extra?: Pick<NotifyOpts, 'silent' | 'complete'>) {
    try {
      const changedValues = this.filterChangedValues(patch)
      if (!changedValues) return null

      // 创建新值而不是修改原值
      const nextValue = mergeValues(this.value, changedValues)
      this.assign(nextValue)
      this.notify(changedValues, { silent: extra?.silent })

      return { changedValues, allValues: nextValue } as BatchUpdateResult<T>
    } catch (err) {
      this.#emitter.emit('error', err as Error)
      return null
    }
  }

  /**
   * 批量合并值
   * @param patch 要合并的部分值
   * @returns Promise<BatchUpdateResult<T> | null> 更新结果
   * @desc 支持对象和数组的深度合并
   * @desc 会将多次调用合并后统一修改并通知
   * @desc 基于 mergeValue 实现,不会修改原始值
   * @desc 返回 Promise 包含更新结果，但仅第一个注册的回调会收到结果
   * @example
   * subscription.batchMerge({ name: 'John' })
   *   .then((result) => {
   *     if (result) {
   *       console.log(result.changedValues) // { name: 'John' }
   *       console.log(result.allValues) // { name: 'John', age: 20 }
   *     }
   *   })
   */
  // 组合操作: 批量合并
  async batchMerge(patch: PatchType<T>): Promise<BatchUpdateResult<T> | null> {
    const batchUpdateRef = this.#batchUpdateRef

    // 合并更新
    batchUpdateRef.pendingUpdates = mergeValues(batchUpdateRef.pendingUpdates, patch)

    // 调度更新
    if (!batchUpdateRef.isBatchUpdateScheduled) {
      batchUpdateRef.isBatchUpdateScheduled = true
      batchUpdateRef.currentBatchPromise = Promise.resolve()
        .then(() => {
          const nextUpdates = batchUpdateRef.pendingUpdates

          // 多次合并后，可能会有与原值相同的属性，此时需要过滤掉
          const changedValues = this.filterChangedValues(nextUpdates)
          if (!changedValues) {
            batchUpdateRef.batchUpdateResult = null
            return
          }

          // 存在变化，则合并值并触发通知
          const nextValue = mergeValues(this.value, changedValues)
          this.assign(nextValue)
          this.notify(changedValues)

          // 存储结果
          batchUpdateRef.batchUpdateResult = {
            changedValues,
            allValues: this.value,
          }
        })
        .catch((err) => {
          this.#emitter.emit('error', err as Error)
          throw err
        })
        .finally(() => {
          // 无论如何，最后重置状态
          batchUpdateRef.pendingUpdates = {} as PatchType<T>
          batchUpdateRef.isBatchUpdateScheduled = false
          batchUpdateRef.currentBatchPromise = null
        })
    }

    // 返回更新结果
    // 合并更新后，通知外部更新完成，但是仅第一个注册的回调会收到值
    const promise = batchUpdateRef.currentBatchPromise as Promise<void>
    return promise.then(() => {
      const result = batchUpdateRef.batchUpdateResult
      batchUpdateRef.batchUpdateResult = null
      return result
    })
  }

  /**
   * 检查变更值是否影响指定路径
   */
  protected isPathAffected(path: PathType, changedValues: PatchType<T>): boolean {
    // 统一转换为路径数组
    const paths = Array.isArray(path[0]) ? (path as SinglePath[]) : [path as SinglePath]

    return paths.some((singlePath) => {
      return get(changedValues, singlePath) !== undefined
    })
  }

  /**
   * 处理路径订阅
   * @desc 只有路径订阅者会收到受影响路径的通知
   * @desc 用在复杂数据结构中，避免广播给数量众多的末端订阅者，例如表格单元格
   */
  protected subscribeWithPath(listener: EventListenerType<T>, path: PathType): () => void {
    const pathListener = { path, listener }
    this.#pathListeners.add(pathListener)

    const off = this.#emitter.on('stateChange', (event) => {
      if (this.isPathAffected(path, event.changedValues)) {
        listener(event)
      }
    })

    return () => {
      this.#pathListeners.delete(pathListener)
      off()
    }
  }

  /**
   * 订阅值的变化
   * @param listener - 订阅回调函数
   * @returns 取消订阅的函数
   * @desc 相同的监听函数只会被订阅一次
   * @desc 订阅者会在值变化时收到通知
   * @desc 返回的函数用于取消订阅
   * @example
   * const unsubscribe = subscription.subscribe(({ value }) => {
   *   console.log('Value changed:', value)
   * })
   *
   * // 取消订阅
   * unsubscribe()
   */
  // 订阅管理
  subscribe(listener?: EventListenerType<T>, opts?: SubscribeOptions): () => void {
    // 防止重复订阅
    if (!listener || this.#listeners.has(listener)) {
      return () => {
        // empty placeholder
      }
    }

    // 路径订阅
    if (opts?.path) {
      return this.subscribeWithPath(listener, opts.path)
    }

    // 全量订阅
    this.#listeners.add(listener)
    const off = this.#emitter.on('stateChange', listener)

    // 错误处理
    this.#emitter.on('error', (err) => {
      console.error('Subscription error:', err)
    })

    return () => {
      this.#listeners.delete(listener)
      off()
    }
  }

  /**
   * 获取暂存的草稿
   * @returns 返回当前暂存的草稿，如果没有则返回 null
   */
  getDraft(): PatchType<T> | null {
    return this.#draft
  }

  /**
   * 获取应用暂存草稿后的完整值
   * @returns 返回合并了暂存草稿后的完整值
   * @desc 用于预览应用暂存草稿后的结果
   */
  getDraftValue(): T {
    if (!this.#draft) return this.#value
    return mergeValues(this.#value, this.#draft)
  }

  /**
   * 检查是否有未保存的更改
   * @returns 是否有未保存的更改
   * @desc 用于判断是否有暂存的草稿需要保存
   */
  hasPendingDraft(): boolean {
    return this.#draft !== null
  }

  /**
   * 合并暂存草稿
   * @param patch 要合并的部分值
   * @desc 支持对象和数组的深度合并
   * @desc 不会触发订阅者的通知
   * @desc 多次调用会累积草稿，直到调用 saveDraft 或 clearDraft
   * @example
   * subscription.mergeDraft({ name: 'John' })
   */
  mergeDraft(patch: PatchType<T>): void {
    try {
      // 如果没有暂存补丁，直接使用当前补丁
      if (!this.#draft) {
        this.#draft = patch
      } else {
        // 否则合并到现有的暂存补丁中
        this.#draft = mergeValues(this.#draft, patch)
      }
    } catch (err) {
      this.#emitter.emit('error', err as Error)
    }
  }

  /**
   * 保存暂存的更改
   * @desc 将暂存的草稿应用到实际值并触发通知
   * @desc 保存后会清空暂存的草稿
   * @example
   * subscription.saveDraft()
   */
  saveDraft() {
    if (!this.#draft) return null

    const draft = this.#draft

    // 重置暂存状态
    this.#draft = null
    this.clearDraft()

    return this.mergeValue(draft)
  }

  /**
   * 清除暂存的更改补丁
   * @example
   * subscription.clearDraft()
   */
  clearDraft(): void {
    this.#draft = null
  }
}

export function filterObjectChanges<T>(patch: PatchType<T>, current: T): PatchType<T> | undefined {
  const changedValues: UnknownObject = {}
  let hasChanged = false

  Object.entries(patch).forEach(([key, value]) => {
    const currentValue = (current as UnknownObject)[key]

    // 如果是数组，只比较引用是否相等
    // 日期对象也是 // 日期对象变化检测异常时新增
    if (Array.isArray(value) || value instanceof Date) {
      if (value !== currentValue) {
        changedValues[key] = value
        hasChanged = true
      }
    }
    // 如果 value 是对象，递归比较
    else if (typeof value === 'object' && value !== null) {
      if (typeof currentValue === 'object' && currentValue !== null) {
        const nestedChanges = filterObjectChanges(value, currentValue)
        if (nestedChanges) {
          changedValues[key] = nestedChanges
          hasChanged = true
        }
      } else {
        // 如果当前值不是对象，则整个 value 都是变化
        changedValues[key] = value
        hasChanged = true
      }
    }
    // 原始值直接比较
    else if (!isEqual(value, currentValue)) {
      changedValues[key] = value
      hasChanged = true
    }
  })

  return hasChanged ? (changedValues as PatchType<T>) : undefined
}
