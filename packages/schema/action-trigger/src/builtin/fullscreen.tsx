import React, { useEffect } from 'react'
import { useFullscreen } from 'ahooks'
import { FullscreenOutlined, FullscreenExitOutlined } from '@hi-ui/icons'

export type FullscreenProps = {
  elRef: React.RefObject<HTMLElement>
}

export function Fullscreen(props: FullscreenProps) {
  const [fullscreen, { toggleFullscreen }] = useFullscreen(props.elRef)

  useEffect(() => {
    if (props.elRef.current) {
      props.elRef.current.dataset.fullscreen = fullscreen.toString()
    }
  }, [fullscreen, props.elRef])

  return fullscreen ? (
    <FullscreenExitOutlined onClick={toggleFullscreen} />
  ) : (
    <FullscreenOutlined onClick={toggleFullscreen} />
  )
}
