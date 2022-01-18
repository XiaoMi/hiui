import { ComponentGroup, IconDescription } from '../@types/group'
import { IconComponent } from '../@types/component'

let IconDescriptionMapCache: Map<string, IconComponent> | undefined
let AllIconDescriptionCache: IconDescription[] | undefined

/**
 * 获取所有的图标信息
 */
export const getAllIconDescription = () => {
  if (AllIconDescriptionCache) {
    return [...AllIconDescriptionCache]
  } else {
    AllIconDescriptionCache = Object.keys(ComponentGroup)
      .map((key) => ComponentGroup[key as keyof typeof ComponentGroup])
      .reduce((result, item) => [...result, ...item], [])
    return [...AllIconDescriptionCache]
  }
}

const getIconDescriptionMapCache = () => {
  if (!IconDescriptionMapCache) {
    IconDescriptionMapCache = new Map<string, IconComponent>()
    const allIcons = getAllIconDescription()
    allIcons.forEach((item) => {
      // name tagName 全都可以作为key 来检索
      // name 使用 小写+中划线
      // tagName 采用 首字母大写驼峰
      // 故而不可能出现重复现象
      IconDescriptionMapCache?.set(item.tagName, item.component)
      IconDescriptionMapCache?.set(item.name, item.component)
    })
  }

  return IconDescriptionMapCache
}
/**
 * 根据 tagName 获取对应icon 组件
 * @param tagName 标签名（EM:CheckCircleFilled）
 */
export const getIconComponentFromTagName = (tagName: string) => {
  return getIconDescriptionMapCache().get(tagName)
}

/**
 * 根据 name 获取对应icon 组件
 * @param name 标签名（EM:check-circle-filled）
 */
export const getIconComponentFromName = (name: string) => {
  return getIconDescriptionMapCache().get(name)
}

/**
 * 获取图标组别信息
 */
export const getIconGroupInfo = () => ComponentGroup
