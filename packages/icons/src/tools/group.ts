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

/**
 * 根据 tagName 获取对应icon 组件
 * @param tagName 标签名（EM:CheckCircleFilled）
 */
export const getIconComponentFromTagName = (tagName: string) => {
  if (!IconDescriptionMapCache) {
    IconDescriptionMapCache = new Map<string, IconComponent>()
    const allIcons = getAllIconDescription()
    allIcons.forEach((item) => IconDescriptionMapCache?.set(item.tagName, item.component))
  }

  return IconDescriptionMapCache.get(tagName)
}

/**
 * 获取图标组别信息
 */
export const getIconGroupInfo = () => ComponentGroup
