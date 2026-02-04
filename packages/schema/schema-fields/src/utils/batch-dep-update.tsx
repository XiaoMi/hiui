import { set } from 'lodash-es'

type BatchUpdatePayloadType<TData extends AnyObject> = {
  _IS_BATCH_UPDATE_: true
  values: Partial<TData>
}

export class BatchDepUpdate {
  static update<TData extends AnyObject>(values: Partial<TData>) {
    return { _IS_BATCH_UPDATE_: true as const, values }
  }

  static isBatch<TData extends AnyObject>(value: unknown): value is BatchUpdatePayloadType<TData> {
    return typeof value === 'object' && !!value && '_IS_BATCH_UPDATE_' in value && 'values' in value
  }

  // key 可能会是普通字符串或路径数组
  static getValues<TData extends AnyObject>(key: FieldPath, value: unknown): Partial<TData> {
    if (this.isBatch<TData>(value)) return value.values
    else {
      // 仅在明确传入路径数组时，才使用 set 方法
      if (Array.isArray(key)) return set({}, key, value) as Partial<TData>
      else return { [key]: value } as Partial<TData>
    }
  }
}
