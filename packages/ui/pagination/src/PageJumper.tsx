import React, { useRef, useCallback, useState } from 'react'
import { Input } from '@hi-ui/input'
import { __DEV__ } from '@hi-ui/env'

/**
 * TODO: What is PageOption
 */
export const PageJumper: React.FC<PageJumperProps> = ({ pageText, prefixCls, onJump, maxJump }) => {
  const [jumpPage, setJumpPage] = useState<string>('')
  const onJumperChange = useCallback<(e: React.ChangeEvent<HTMLInputElement>) => void>((e) => {
    setJumpPage(e.target.value)
  }, [])
  const _onJump = useCallback<(evt: React.FocusEvent<HTMLInputElement>) => void>(
    (e) => {
      if (e.target.value) {
        let value = Number(e.target.value)
        if (!isNaN(value)) {
          if (value > maxJump) {
            value = maxJump
          }
          if (value <= 0) {
            value = 1
          }

          onJump(value)
        }
        setJumpPage('')
      }
    },
    [onJump, maxJump]
  )
  const jumperRef = useRef<HTMLInputElement>(null)
  return (
    <div className={`${prefixCls}__jumper`}>
      {pageText[0]}
      <Input
        ref={jumperRef}
        value={jumpPage}
        style={{ width: 50, margin: '0 8px' }}
        onBlur={_onJump}
        // @ts-ignore
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            _onJump(e)
          }
        }}
        onChange={onJumperChange}
      />
      {pageText[1]}
    </div>
  )
}

export interface PageJumperProps {
  pageText: [string, string]
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  onJump: (page: number) => void
  maxJump: number
}

if (__DEV__) {
  PageJumper.displayName = 'PageJumper'
}
