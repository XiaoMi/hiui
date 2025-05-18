import React, { useCallback, useState } from 'react'
import { Input } from '@hi-ui/input'
import { __DEV__ } from '@hi-ui/env'

export const PageJumper: React.FC<PageJumperProps> = ({
  pageText,
  prefixCls,
  onJump,
  maxJump,
  size = 'md',
}) => {
  const [jumpPage, setJumpPage] = useState<string>('')
  const onJumperChange = useCallback((e) => {
    setJumpPage(e.target.value)
  }, [])
  const _onJump = useCallback(
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

  return (
    <div className={`${prefixCls}__jumper`}>
      {pageText[0]}
      <Input
        value={jumpPage}
        style={{ width: 50, margin: '0 4px' }}
        onBlur={_onJump}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            _onJump(e as any)
          }
        }}
        onChange={onJumperChange}
        size={size}
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
  /**
   * 设置尺寸
   */
  size?: 'xs' | 'sm' | 'md'
}

if (__DEV__) {
  PageJumper.displayName = 'PageJumper'
}
