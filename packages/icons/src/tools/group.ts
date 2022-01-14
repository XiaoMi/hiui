import { ComponentGroup } from '../@types/group'

export const getAllIconDescription = () => {
  return Object.keys(ComponentGroup)
    .map((key) => ComponentGroup[key as keyof typeof ComponentGroup])
    .reduce((result, item) => [...result, ...item], [])
}

export const getIconGroupInfo = () => ComponentGroup
