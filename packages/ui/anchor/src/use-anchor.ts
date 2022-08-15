import { AnchorDataItem } from './types'

const DEFAULT_DATA = [] as []

export const  useAnchor = ({
data: dataProp = DEFAULT_DATA,
  ...rest
}: UseAnchorProps) => {

  return { rootProps: rest }
}

export interface UseAnchorProps {
  data?: AnchorDataItem[]
}

export type UseAnchorReturn = ReturnType<typeof useAnchor>
