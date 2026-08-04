import type { LegacyPageType } from '../types'

export type LegacyPageShell =
  | 'StatListPageFrame'
  | 'TablePageFrame'
  | 'TreeSplitPageFrame'
  | 'ProFormDrawer'
  | 'ProDetailDrawer'
  | 'ProEditPage'
  | 'ProDetailPage'
  | 'FeedbackStatePanel'

export type LegacyPageSpec = {
  pageType: LegacyPageType
  shell: LegacyPageShell
  regions: string[]
  regionOrder: string[]
  ownership: Record<string, string>
  editableSlots: string[]
  slotManifest: Array<{
    slotId: string
    label: string
    contentType: string
    owner: string
    maxItems?: number
    allowedChanges: string[]
    forbiddenChanges: string[]
  }>
  componentSources: Record<string, string>
  visualTokens: {
    scope: string
    tokenSource: string
    forbidPageLocalOverrides: string[]
  }
}
