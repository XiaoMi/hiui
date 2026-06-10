import { Suspense, lazy } from 'react'
import type { ComponentType, ReactNode } from 'react'
import type { MenuRouteObject } from './types'
import { ExampleAppShell } from '../app-shell'
import { typicalExamplePrompts } from './example-prompts'

type RouteRenderOptions = {
  wrapInShell?: boolean
}

function createLazyPage<TModule>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule
): ComponentType {
  return lazy(async () => {
    const mod = await loader()
    return {
      default: mod[exportName] as ComponentType,
    }
  })
}

const BasicTablePage = createLazyPage(() => import('../pages/basic-table'), 'BasicTablePage')
const DataVisualizationPage = createLazyPage(
  () => import('../pages/data-visualization'),
  'DataVisualizationPage'
)
const TableStatPage = createLazyPage(() => import('../pages/table-stat'), 'TableStatPage')
const DrawerDetailPage = createLazyPage(() => import('../pages/drawer-detail'), 'DrawerDetailPage')
const DrawerFormPage = createLazyPage(() => import('../pages/drawer-form'), 'DrawerFormPage')
const EmptyStatePage = createLazyPage(() => import('../pages/empty-state'), 'EmptyStatePage')
const FullPageDetailPage = createLazyPage(
  () => import('../pages/full-page-detail'),
  'FullPageDetailPage'
)
const FullPageEditPage = createLazyPage(() => import('../pages/full-page-edit'), 'FullPageEditPage')
const IntranetOfflinePage = createLazyPage(
  () => import('../pages/intranet-offline'),
  'IntranetOfflinePage'
)
const InventorySplitPage = createLazyPage(
  () => import('../pages/inventory-split'),
  'InventorySplitPage'
)
const LoadFailPage = createLazyPage(() => import('../pages/load-fail'), 'LoadFailPage')
const NetworkErrorPage = createLazyPage(() => import('../pages/network-error'), 'NetworkErrorPage')
const NoPermissionPage = createLazyPage(() => import('../pages/no-permission'), 'NoPermissionPage')
const PageNotFoundPage = createLazyPage(
  () => import('../pages/page-not-found'),
  'PageNotFoundPage'
)
const TreeTablePage = createLazyPage(() => import('../pages/tree-table'), 'TreeTablePage')
const UnderConstructionPage = createLazyPage(
  () => import('../pages/under-construction'),
  'UnderConstructionPage'
)

function renderTypicalPage(title: string, element: ReactNode, options: RouteRenderOptions) {
  const content = <Suspense fallback={null}>{element}</Suspense>

  if (!options.wrapInShell) return content

  return <ExampleAppShell title={title}>{content}</ExampleAppShell>
}

export function createTypicalPageReuseRoutes(
  options: RouteRenderOptions = {}
): MenuRouteObject[] {
  return [
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
          element: renderTypicalPage('全页编辑', <FullPageEditPage />, options),
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
          element: renderTypicalPage('空状态', <EmptyStatePage />, options),
        },
        {
          title: '加载失败',
          path: 'load-fail',
          examplePrompt: typicalExamplePrompts.loadFail,
          element: renderTypicalPage('加载失败', <LoadFailPage />, options),
        },
        {
          title: '页面不存在',
          path: 'page-not-found',
          examplePrompt: typicalExamplePrompts.pageNotFound,
          element: renderTypicalPage('页面不存在', <PageNotFoundPage />, options),
        },
        {
          title: '暂无权限',
          path: 'no-permission',
          examplePrompt: typicalExamplePrompts.noPermission,
          element: renderTypicalPage('暂无权限', <NoPermissionPage />, options),
        },
        {
          title: '页面建设中',
          path: 'under-construction',
          examplePrompt: typicalExamplePrompts.underConstruction,
          element: renderTypicalPage('页面建设中', <UnderConstructionPage />, options),
        },
        {
          title: '网络异常',
          path: 'network-error',
          examplePrompt: typicalExamplePrompts.networkError,
          element: renderTypicalPage('网络异常', <NetworkErrorPage />, options),
        },
        {
          title: '未连接内网',
          path: 'intranet-offline',
          examplePrompt: typicalExamplePrompts.intranetOffline,
          element: renderTypicalPage('未连接内网', <IntranetOfflinePage />, options),
        },
      ],
    },
  ]
}

export default createTypicalPageReuseRoutes()
