import type { ReactNode } from 'react'

export const feedbackStatusVariantIds = [
  'empty-state',
  'load-fail',
  'page-not-found',
  'no-permission',
  'under-construction',
  'network-error',
  'intranet-offline',
] as const

export type FeedbackStatusVariantId = (typeof feedbackStatusVariantIds)[number]

export type FeedbackStatusDescription = {
  leadingText: string
  accentText?: string
  trailingText?: string
}

export type FeedbackStatusVariant = {
  id: FeedbackStatusVariantId
  title: string
  description: FeedbackStatusDescription
  primaryActionLabel: string
  indicator?: ReactNode
}
