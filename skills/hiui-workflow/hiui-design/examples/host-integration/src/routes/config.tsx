import type { ReactNode } from 'react'
import { AppStoreFilled } from '@hi-ui/icons'
import type { MenuRouteObject } from './types'
import { BasicTablePage } from '../pages/basic-table'
import { DataVisualizationPage } from '../pages/data-visualization'
import { TableStatPage } from '../pages/table-stat'
import { DrawerDetailPage } from '../pages/drawer-detail'
import { DrawerFormPage } from '../pages/drawer-form'
import { FeedbackStatusPage } from '../pages/feedback-status'
import { FullPageDetailPage } from '../pages/full-page-detail'
import type { FullPageEditDetailTablePreset } from '../pages/full-page-edit'
import { FullPageEditPage } from '../pages/full-page-edit'
import { InventorySplitPage } from '../pages/inventory-split'
import { TreeTablePage } from '../pages/tree-table'
import { ExampleAppShell } from '../app-shell'
import { typicalExamplePrompts } from './example-prompts'

type RouteRenderOptions = {
  wrapInShell?: boolean
}

const fullPageEditPreviewDetailTable: FullPageEditDetailTablePreset = {
  visible: true,
  orderOptions: [
    { id: 'SO20260418001', title: 'SO20260418001' },
    { id: 'SO20260418002', title: 'SO20260418002' },
    { id: 'SO20260418003', title: 'SO20260418003' },
  ],
  initialRows: [
    {
      id: 'product-1',
      productName: '智能门锁 X1',
      productCode: 'LOCK-X1-2026',
      imeiOrSn: 'SN-X1000001',
      relatedOrder: 'SO20260418001',
      warrantyStart: '2026-04-18',
      warrantyEnd: '2027-04-17',
    },
    {
      id: 'product-2',
      productName: '室内摄像头 C2',
      productCode: 'CAM-C2-2026',
      imeiOrSn: 'SN-C2000008',
      relatedOrder: 'SO20260418001',
      warrantyStart: '2026-04-18',
      warrantyEnd: '2027-04-17',
    },
  ],
}

function renderTypicalPage(title: string, element: ReactNode, options: RouteRenderOptions) {
  if (!options.wrapInShell) return element

  return <ExampleAppShell title={title}>{element}</ExampleAppShell>
}

export function createTypicalPagePreviewRoutes(
  options: RouteRenderOptions = {}
): MenuRouteObject[] {
  return [
    {
      title: '示例',
      icon: <AppStoreFilled />,
      children: [
        {
          title: '表格',
          path: 'table',
          children: [
            {
              title: '基础表格',
              path: 'common/basic',
              examplePrompt: typicalExamplePrompts.basicTable,
              element: renderTypicalPage('基础表格', <BasicTablePage />, options),
            },
            {
              title: '数据统计表',
              path: 'common/table-stat',
              examplePrompt: typicalExamplePrompts.tableStat,
              element: renderTypicalPage('数据统计表', <TableStatPage />, options),
            },
            {
              title: '树形表格',
              path: 'common/tree',
              examplePrompt: typicalExamplePrompts.treeTable,
              element: renderTypicalPage('树形表格', <TreeTablePage />, options),
            },
            {
              title: '左树右表',
              path: 'common/split',
              examplePrompt: typicalExamplePrompts.inventorySplit,
              element: renderTypicalPage('左树右表', <InventorySplitPage />, options),
            },
          ],
        },
        {
          title: '图表',
          path: 'chart',
          children: [
            {
              title: '数据可视化',
              path: 'common/data-visualization',
              examplePrompt: typicalExamplePrompts.dataVisualization,
              element: renderTypicalPage('数据可视化', <DataVisualizationPage />, options),
            },
          ],
        },
        {
          title: '表单',
          path: 'form',
          children: [
            {
              title: '全页编辑',
              path: 'typical/edit',
              examplePrompt: typicalExamplePrompts.fullPageEdit,
              element: renderTypicalPage(
                '全页编辑',
                <FullPageEditPage detailTablePreset={fullPageEditPreviewDetailTable} />,
                options
              ),
            },
            {
              title: '抽屉表单',
              path: 'typical/drawer',
              examplePrompt: typicalExamplePrompts.drawerForm,
              element: renderTypicalPage('抽屉表单', <DrawerFormPage />, options),
            },
          ],
        },
        {
          title: '详情',
          path: 'detail',
          children: [
            {
              title: '全页详情',
              path: 'typical/page',
              examplePrompt: typicalExamplePrompts.fullPageDetail,
              element: renderTypicalPage('全页详情', <FullPageDetailPage />, options),
            },
            {
              title: '抽屉详情',
              path: 'typical/drawer',
              examplePrompt: typicalExamplePrompts.drawerDetail,
              element: renderTypicalPage('抽屉详情', <DrawerDetailPage />, options),
            },
          ],
        },
        {
          title: '异常',
          path: 'feedback',
          children: [
            {
              title: '空状态',
              path: 'empty-state',
              examplePrompt: typicalExamplePrompts.emptyState,
              element: renderTypicalPage('空状态', <FeedbackStatusPage variantId="empty-state" />, options),
            },
            {
              title: '加载失败',
              path: 'load-fail',
              examplePrompt: typicalExamplePrompts.loadFail,
              element: renderTypicalPage('加载失败', <FeedbackStatusPage variantId="load-fail" />, options),
            },
            {
              title: '页面不存在',
              path: 'page-not-found',
              examplePrompt: typicalExamplePrompts.pageNotFound,
              element: renderTypicalPage('页面不存在', <FeedbackStatusPage variantId="page-not-found" />, options),
            },
            {
              title: '暂无权限',
              path: 'no-permission',
              examplePrompt: typicalExamplePrompts.noPermission,
              element: renderTypicalPage('暂无权限', <FeedbackStatusPage variantId="no-permission" />, options),
            },
            {
              title: '页面建设中',
              path: 'under-construction',
              examplePrompt: typicalExamplePrompts.underConstruction,
              element: renderTypicalPage(
                '页面建设中',
                <FeedbackStatusPage variantId="under-construction" />,
                options
              ),
            },
            {
              title: '网络异常',
              path: 'network-error',
              examplePrompt: typicalExamplePrompts.networkError,
              element: renderTypicalPage('网络异常', <FeedbackStatusPage variantId="network-error" />, options),
            },
            {
              title: '未连接内网',
              path: 'intranet-offline',
              examplePrompt: typicalExamplePrompts.intranetOffline,
              element: renderTypicalPage('未连接内网', <FeedbackStatusPage variantId="intranet-offline" />, options),
            },
          ],
        },
      ],
    },
  ]
}

export default createTypicalPagePreviewRoutes()
