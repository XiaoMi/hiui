import type { LegacyPageType } from '../types'
import type { LegacyPageSpec } from './types'
import { drawerDetailSpec } from './drawer-detail'
import { drawerFormSpec } from './drawer-form'
import { feedbackStatusSpec } from './feedback-status'
import { fullPageDetailSpec } from './full-page-detail'
import { fullPageEditSpec } from './full-page-edit'
import { tableBasicSpec } from './table-basic'
import { tableStatSpec } from './table-stat'
import { treeSplitSpec } from './tree-split'
import { treeTableSpec } from './tree-table'

const specs: Record<LegacyPageType, LegacyPageSpec> = {
  'drawer-detail': drawerDetailSpec,
  'drawer-form': drawerFormSpec,
  'feedback-status': feedbackStatusSpec,
  'full-page-detail': fullPageDetailSpec,
  'full-page-edit': fullPageEditSpec,
  'table-basic': tableBasicSpec,
  'table-stat': tableStatSpec,
  'tree-split': treeSplitSpec,
  'tree-table': treeTableSpec,
}

export function getLegacyPageSpec(pageType: LegacyPageType): LegacyPageSpec {
  return specs[pageType]
}

export const legacyPageSpecs = specs
export type { LegacyPageSpec } from './types'
