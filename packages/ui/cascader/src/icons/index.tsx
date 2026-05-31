import React from 'react'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'
import { Spinner } from '@hi-ui/spinner'
import { useGlobalContext } from '@hi-ui/core'

export const DefaultSuffixIcon = () => {
  const { direction } = useGlobalContext()
  return direction === 'rtl' ? <LeftOutlined /> : <RightOutlined />
}

export const defaultLeafIcon = null

export const defaultLoadingIcon = <Spinner size="sm" />
