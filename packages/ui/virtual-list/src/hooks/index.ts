export const useCheckInVirtual = ({
  data,
  height,
  virtual,
  itemHeight,
}: UseCheckInVirtualProps) => {
  const useVirtual = !!(virtual !== false && height && itemHeight)
  // @ts-ignore
  const inVirtual = useVirtual && Array.isArray(data) && itemHeight * data.length > height

  return { useVirtual, inVirtual }
}

export interface UseCheckInVirtualProps {
  data?: any[]
  height?: number
  virtual?: boolean
  itemHeight?: number
}
