import React from 'react'
import { useUpdate } from 'ahooks'

export function useInitialRender() {
  const forceUpdate = useUpdate()
  React.useEffect(() => {
    forceUpdate()
  }, [forceUpdate])
}
