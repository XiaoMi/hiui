import { isNil } from 'lodash-es'

type GetDataSetOptsType = {
  prefix?: string // 自定义前缀,默认为'data-'
  camelToKebab?: boolean // 是否将驼峰转换为连字符形式
}

/**
 * 将对象转换为HTML data-*属性对象
 * @param dataSet - 包含data属性的对象
 * @param opts - 配置选项
 */
export function getDataSet(
  dataSet: Record<string, Primitive | undefined> | undefined,
  opts: GetDataSetOptsType = {}
): Record<string, string> {
  if (!dataSet) return {}

  const { prefix = 'data-', camelToKebab = true } = opts

  // 转换驼峰为连字符形式
  const toKebabCase = (str: string): string => {
    return camelToKebab ? str.replace(/([A-Z])/g, '-$1').toLowerCase() : str
  }

  return Object.entries(dataSet).reduce((acc, [key, value]) => {
    // 跳过null和undefined
    if (isNil(value)) return acc

    try {
      const processedKey = toKebabCase(key)
      acc[prefix + processedKey] = String(value)
    } catch (err) {
      console.error(`getDataSet: Error processing ${key}:`, err)
    }

    return acc
  }, {} as Record<string, string>)
}
