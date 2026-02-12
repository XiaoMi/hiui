export type BeCheckedPromiseType<T> =
  | Promise<T | null | void | undefined>
  | T
  | null
  | void
  | undefined

// 这里可能还会有个公用的检查函数
export const _CHECK_RESULT_IGNORE_ME_ = '_CHECK_RESULT_IGNORE_ME_'
