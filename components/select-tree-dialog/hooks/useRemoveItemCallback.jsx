import { useCallback } from 'react'

export const useRemoveItemCallback = (sourceArray, setSourceArray) =>
  useCallback(
    (item) => {
      const index = sourceArray.indexOf(item)
      if (index > -1) {
        const newArray = [...sourceArray]
        newArray.splice(index, 1)
        setSourceArray(newArray)
      }
    },
    [sourceArray, setSourceArray]
  )
