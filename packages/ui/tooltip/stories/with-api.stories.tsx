import React from 'react'
import Button from '@hi-ui/button'
import Tooltip from '../src'

/**
 * @title API 调用
 */
export const WithAPI = () => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const triggerElementRef = React.useRef<HTMLSpanElement | null>(null)

  const toggleTooltip = () => {
    if (showTooltip) {
      Tooltip.close('123')
      setShowTooltip(false)
    } else {
      Tooltip.open(triggerElementRef.current, {
        key: '123',
        title: 'Click again to hide me.',
        placement: 'right',
      })
      setShowTooltip(true)
    }
  }

  return (
    <>
      <h1>WithAPI</h1>
      <div className="modal-with-api__wrap">
        <Button type="primary" onClick={toggleTooltip}>
          {showTooltip ? 'Hide' : 'Show'} tooltip
        </Button>
        <br />
        <span ref={triggerElementRef} style={{ marginTop: '10px', display: 'inline-block' }}>
          <Button disabled>Show tooltip on me</Button>
        </span>
      </div>
    </>
  )
}
