import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PageHeaderProps } from '@hi-ui/hiui'
import { useLayoutContentContext } from './layout-content-context'
import { useTranslation } from '../../../translation'

type SlotPortalProps = {
  children: React.ReactNode
}

export function HostPageHeaderPortal({ children }: SlotPortalProps) {
  const { headerRef, titleTextRef } = useLayoutContentContext()
  const { t } = useTranslation()
  const [, forceUpdate] = useState(0)
  const element = children as React.ReactElement<PageHeaderProps>

  useEffect(() => {
    Promise.resolve(1).then(forceUpdate)
  }, [])

  if (!React.isValidElement(element)) return null

  const pageProps = element.props
  const translatedTitle =
    typeof pageProps.title === 'string'
      ? t(pageProps.title)
      : pageProps.title !== undefined && pageProps.title !== null
        ? pageProps.title
        : titleTextRef.current
  const resolvedTitle = translatedTitle
  const resolvedStyle = {
    ...(pageProps.style ?? {}),
    margin: 0,
    paddingBlock: 0,
    paddingBottom: 0,
    paddingTop: 0,
    width: '100%',
    minWidth: 0,
  } as const

  const container = headerRef.current
  if (!container) return null

  return createPortal(
    React.cloneElement(element, {
      ...pageProps,
      title: resolvedTitle,
      style: resolvedStyle,
      ...(!pageProps.onBack ? { backIcon: false as const } : {}),
    }),
    container
  )
}

export function HostPageFooterPortal({ children }: SlotPortalProps) {
  const { footerRef } = useLayoutContentContext()
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    Promise.resolve(1).then(forceUpdate)
  }, [])

  const element = children as React.ReactElement
  if (!React.isValidElement(element)) return null
  const container = footerRef.current
  if (!container) return null

  return createPortal(element, container)
}
