import Button from '@hi-ui/button'
import { AssetMonitorFilled } from '@hi-ui/icons'
import React from 'react'
import PopConfirm from '../src'

export const customIcon = () => {
  return (
    <>
      <h1>customIcon</h1>
      <div className="pop-confirm-custom-icon__wrap">
        <PopConfirm title="Are U ok ?" icon={<AssetMonitorFilled />}>
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
