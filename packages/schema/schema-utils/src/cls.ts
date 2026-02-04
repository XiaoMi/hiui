import { cx } from '@hi-ui/classname'

type ClassValue = string | undefined | false | null
type ClassObject = Record<string, boolean | undefined | null>

/**
 * 创建一个添加指定前缀的 className 工具函数
 * @param prefix 类名前缀
 * @returns 返回一个可以添加指定前缀的 className 函数
 */
export function createPrefixClassnames(prefix: string) {
  return function cls(...args: (ClassValue | ClassObject)[]) {
    const classes = args.map((arg) => {
      if (typeof arg === 'string') {
        return `${prefix}__${arg}`
      }
      if (arg && typeof arg === 'object') {
        const obj: ClassObject = {}
        Object.entries(arg).forEach(([key, value]) => {
          obj[`${prefix}__${key}`] = value
        })
        return obj
      }
      return arg
    })

    return cx(classes)
  }
}
