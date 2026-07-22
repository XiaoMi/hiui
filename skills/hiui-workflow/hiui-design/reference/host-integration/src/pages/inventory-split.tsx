import { useCallback, useMemo, useRef, useState } from 'react'
import { Button, Message, Space, Tree } from '@hi-ui/hiui'
import type { TreeDataItem } from '@hi-ui/tree'
import { SearchInput } from '@hi-ui/query-filter'
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import {
  ProListPageProvider,
  queryFilterPickerOverlay,
  useProListPageContext,
} from '@hiui-design/typical-page-shells/pro-list-page'
import { TreeSplitPageFrame, proTreeSplitPageStyles } from '@hiui-design/typical-page-shells/pro-tree-split-page'
import {
  conditionOptions,
  createInventoryRowQuery,
  itemAttrOptions,
  materialCategoryTree,
  materialDefaultExpandedIds,
} from './typical-pages.mock'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './request-utils'
import styles from './inventory-split.module.scss'
import { useTranslation } from '../../translation'

const T = extendDsl(ReadonlyFieldCreator, {
})

function filterTreeByKeyword(nodes: TreeDataItem[], keyword: string): TreeDataItem[] {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) return nodes

  return nodes.flatMap((node) => {
    const title = String(node.title ?? '')
    const children = node.children?.length ? filterTreeByKeyword(node.children, keyword) : []

    if (title.toLowerCase().includes(normalized)) return [{ ...node }]
    if (children.length > 0) return [{ ...node, children }]
    return []
  })
}

function InventorySplitInner({
  treeCategoryRef,
}: {
  treeCategoryRef: React.MutableRefObject<string | null>
}) {
  const { locale, t, formatNumber } = useTranslation()
  const { subscription, refreshListData } = useProListPageContext()
  const [treeQuery, setTreeQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | number | null>(null)

  const treeData = useMemo(
    () =>
      filterTreeByKeyword(
        materialCategoryTree.map((node) => ({
          ...node,
          title: t(String(node.title ?? '')),
          children: node.children?.map((child) => ({
            ...child,
            title: t(String(child.title ?? '')),
          })),
        })),
        treeQuery
      ),
    [t, treeQuery]
  )

  const queryFields = useMemo(
    () => [
      F(t('物品属性'), 'itemAttr')
        .Select({
          data: itemAttrOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F(t('品相'), 'conditionGrade')
        .Select({
          data: conditionOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
    ],
    [t]
  )

  const tableFields = useMemo(
    () => [
      T(t('序号'), 'index').W(64).val,
      T(t('物料名称'), 'name').W(220).val,
      T(t('物料编码'), 'code').W(160).val,
      T(t('单位'), 'unit').W(80).val,
      T(t('串号管理'), 'serialManaged').W(100).renderCell((cellValue) => t(String(cellValue ?? ''))).val,
      T(t('物品属性'), 'itemAttr').W(100).renderCell((cellValue) => t(String(cellValue ?? ''))).val,
      T(t('品相'), 'conditionGrade').W(96).renderCell((cellValue) => t(String(cellValue ?? ''))).val,
      T(t('金额'), 'amount')
        .W(100)
        .renderCell((cellValue) => formatNumber(Number(String(cellValue ?? '').replace(/,/g, ''))))
        .val,
      T(t('操作'), '_actions')
        .W(100)
        .Control({ fixed: 'right' })
        .renderCell((_, ctx) => {
          const row = ctx.rawData as { name: string }

          return (
            <Button
              type="primary"
              appearance="link"
              onClick={() =>
                Message.open({
                  title: t('查看 {name}', { name: t(row.name) }),
                })
              }
            >
              {t('查看')}
            </Button>
          )
        })
        .val,
    ],
    [formatNumber, t]
  )

  const handleTreeSelect = useCallback(
    (id: string | number | null) => {
      setSelectedId(id)
      treeCategoryRef.current = id == null || id === '' ? null : String(id)
      subscription.mergeValue({
        pagination: { current: 1 },
      })
      void refreshListData()
    },
    [refreshListData, subscription, treeCategoryRef]
  )

  return (
    <TreeSplitPageFrame
      key={locale}
      title={t('左树右表')}
      queryFields={queryFields}
      tableFields={tableFields}
      searchPlaceholder={t('物料名称 / 物料编码')}
      storageKey="example-host-integration-tree-width"
      leftPane={
        <>
          <div className={styles.treeSearch}>
            <SearchInput
              className={styles.treeSearchInput}
              style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
              placeholder={t('搜索品类')}
              value={treeQuery}
              onChange={(_evt, nextValue) => setTreeQuery(nextValue)}
            />
          </div>
          <div className={styles.treeScroll}>
            <div className={styles.treePanel}>
              <Tree
                data={treeData}
                selectedId={selectedId ?? undefined}
                defaultExpandedIds={materialDefaultExpandedIds}
                onSelect={handleTreeSelect}
              />
            </div>
          </div>
        </>
      }
      extra={
        <Space className={proTreeSplitPageStyles.headerExtra}>
          <Button type="default" onClick={() => Message.open({ title: t('导入物料（示例）') })}>
            {t('导入')}
          </Button>
          <Button type="primary" onClick={() => Message.open({ title: t('新增物料（示例）') })}>
            {t('新增物料')}
          </Button>
        </Space>
      }
    />
  )
}

export function InventorySplitPage() {
  const { locale, t } = useTranslation()
  const treeCategoryRef = useRef<string | null>(null)
  const request = useMemo(() => {
    const queryInventoryRows = createInventoryRowQuery(() => treeCategoryRef.current)

    return async (params: Parameters<typeof queryInventoryRows>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)
      const translatedList = queryInventoryRows(nextParams).map((row) => ({
        ...row,
        conditionGrade: t(row.conditionGrade),
        itemAttr: t(row.itemAttr),
        name: t(row.name),
        serialManaged: t(row.serialManaged),
        unit: t(row.unit),
      }))
      const filteredList = filterListByKeyword(translatedList, keyword, [
        (row) => row.name,
        (row) => row.code,
      ])

      return paginateList(filteredList, nextParams)
    }
  }, [t])

  return (
    <ProListPageProvider key={locale} request={request}>
      <TypicalPageFieldMapProvider key={locale}>
        <InventorySplitInner treeCategoryRef={treeCategoryRef} />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
