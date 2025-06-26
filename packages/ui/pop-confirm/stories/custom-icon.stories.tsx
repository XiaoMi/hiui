import Button from '@hi-ui/button'
import { AssetMonitorFilled } from '@hi-ui/icons'
import React from 'react'
import PopConfirm from '../src'

/**
 * @title 自定义图标
 */
export const customIcon = () => {
  return (
    <>
      <h1>customIcon</h1>
      <div className="pop-confirm-custom-icon__wrap">
        <PopConfirm title="Hello! Are you OK?" icon={<AssetMonitorFilled />}>
          <Button>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
