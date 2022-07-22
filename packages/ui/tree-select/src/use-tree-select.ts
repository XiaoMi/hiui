import { TreeSelectDataItem } from './types'

const DEFAULT_DATA = [] as []

export const  useTreeSelect = ({
data: dataProp = DEFAULT_DATA,
  ...rest
}: UseTreeSelectProps) => {

  return { rootProps: rest }
}

export interface UseTreeSelectProps {
  data?: TreeSelectDataItem[]
}

export type UseTreeSelectReturn = ReturnType<typeof useTreeSelect>
