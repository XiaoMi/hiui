import { Subscription } from './class'

/**
 * 空订阅
 * @desc 给可选订阅的一个占位，使用时不会创建额外的无效订阅
 */
export const NOOP_SUBSCRIPTION = new Subscription<AnyType>({})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 此处增加一个额外标识，用来 debug，没有其他意义，因此忽略类型检查
NOOP_SUBSCRIPTION.IS_NOOP_SUBSCRIPTION = true
