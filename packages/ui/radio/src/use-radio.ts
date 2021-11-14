import { useCallback } from 'react'
import { RadioDataItem } from './types'

const NOOP_ARRAY = [] as []

export const  useRadio = ({
data: dataProp = NOOP_ARRAY,
  ...rest
}: UseRadioProps) => {
  const getRootProps = useCallback(() => {
    return rest
  }, [rest])

  return { getRootProps }
}

export interface UseRadioProps {
  data: RadioDataItem[]
}

export type UseRadioReturn = ReturnType<typeof useRadio>
