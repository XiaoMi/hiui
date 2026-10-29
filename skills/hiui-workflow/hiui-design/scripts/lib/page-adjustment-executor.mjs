function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function unique(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean).map((item) => String(item).trim()))]
}

function normalizeText(value) {
  return String(value || '').trim()
}

function slugifyId(value, index) {
  const base = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)

  return base || `adjustment-tab-${index + 1}`
}

function stringifyLiteral(value) {
  return JSON.stringify(value, null, 2)
}

function insertBeforeFirstExport(source, block) {
  const exportIndex = source.indexOf('\nexport ')
  if (exportIndex < 0) return `${source.trimEnd()}\n\n${block}\n`
  return `${source.slice(0, exportIndex)}\n\n${block}${source.slice(exportIndex)}`
}

function getLineIndent(source, index) {
  const lineStart = source.lastIndexOf('\n', index) + 1
  return source.slice(lineStart, index)
}

function findSelfClosingComponentRange(source, componentName) {
  const openIndex = source.indexOf(`<${componentName}`)
  if (openIndex < 0) return null

  let braceDepth = 0
  let quote = ''
  let escaped = false

  for (let index = openIndex + componentName.length + 1; index < source.length - 1; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') {
      braceDepth += 1
      continue
    }

    if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1)
      continue
    }

    if (braceDepth === 0 && char === '/' && next === '>') {
      return {
        start: openIndex,
        end: index + 2,
      }
    }
  }

  return null
}

function replaceFirst(source, searchValue, replacement, description) {
  const nextSource = source.replace(searchValue, replacement)
  if (nextSource === source) {
    throw new Error(`Unable to apply page adjustment transform: missing ${description}`)
  }
  return nextSource
}

function ensureNamedImports(source, importSource, requiredSymbols) {
  const symbols = unique(requiredSymbols)
  if (symbols.length === 0) return source

  const importPattern = new RegExp(
    `(^|\\n)(\\s*import\\s*\\{)([\\s\\S]*?)(\\}\\s*from\\s*['"]${escapeRegExp(importSource)}['"]\\s*;?)`,
    'm'
  )
  const match = source.match(importPattern)

  if (!match) {
    return `import { ${symbols.join(', ')} } from '${importSource}'\n${source}`
  }

  const existingSymbols = unique(
    match[3]
      .split(',')
      .map((item) => item.replace(/\bas\b[\s\S]*$/, '').trim())
      .filter(Boolean)
  )
  const mergedSymbols = unique([...existingSymbols, ...symbols])

  return source.replace(importPattern, `${match[1]}${match[2]} ${mergedSymbols.join(', ')} ${match[4]}`)
}

function resolveAdjustmentViewModel(brief, executionPlan) {
  const model = brief.pageGenerationDecision?.pageAdjustmentViewModel
  if (!model || typeof model !== 'object') {
    throw new Error('Unable to apply page adjustment transform: missing pageAdjustmentViewModel')
  }

  const normalizedLabels = unique(model.observedLabels).slice(0, 4)
  const presentation = model.presentation === 'tabs' ? 'tabs' : 'info-card'
  const normalizedTabs = presentation === 'tabs'
    ? unique((Array.isArray(model.tabs) ? model.tabs : []).map((item) => item?.title || ''))
        .map((title, index) => ({
          id: slugifyId(title, index),
          title,
        }))
    : []

  return {
    title: String(model.title || '受控局部改造'),
    regionLabel: executionPlan.selectedRegion,
    summary:
      String(model.summary || '') ||
      brief.pageAdjustmentContract?.userAdjustmentIntent ||
      '当前页面需要在保留基础典型页主体结构的前提下，执行一次受控局部改造。',
    structureSummary: normalizeText(model.structureSummary),
    intentContract:
      model.intentContract && typeof model.intentContract === 'object'
        ? {
            mustHave: unique(model.intentContract.mustHave),
            mustNotAdd: unique(model.intentContract.mustNotAdd),
          }
        : {
            mustHave: [],
            mustNotAdd: [],
          },
    observedModules:
      model.observedModules && typeof model.observedModules === 'object'
        ? {
            productTypeTabs: unique(model.observedModules.productTypeTabs),
            formFields: unique(model.observedModules.formFields),
            primaryActions: unique(model.observedModules.primaryActions),
            detailTableColumns: unique(model.observedModules.detailTableColumns),
            fallbackLabels: unique(model.observedModules.fallbackLabels),
          }
        : {
            productTypeTabs: [],
            formFields: [],
            primaryActions: [],
            detailTableColumns: [],
            fallbackLabels: [],
          },
    observedLabels: normalizedLabels,
    retainedCharacteristics: unique(model.retainedCharacteristics).slice(0, 4),
    designSystemConstraints: unique(model.designSystemConstraints).slice(0, 4),
    validationRules: unique(model.validationRules).slice(0, 4),
    presentation,
    tabs: normalizedTabs,
  }
}

const PAGE_ADJUSTMENT_FIELD_KEY_OVERRIDES = {
  商家ID标签: 'merchantIdTag',
  'IMEI/SN': 'imeiSn',
  商家订单编号: 'merchantOrderNo',
  商家销售日期: 'merchantSaleDate',
  订单妥投时间: 'orderDeliveredAt',
  服务类型: 'serviceType',
  处理方式: 'handlingMethod',
  故障分类: 'faultCategory',
  故障描述: 'faultDescription',
}

const PAGE_ADJUSTMENT_DETAIL_COLUMN_KEY_OVERRIDES = {
  品编号: 'skuCode',
  物品名称: 'productName',
  'IMEI/SN': 'imeiSn',
  处理方式: 'handlingMethodTitle',
  ID标签: 'merchantIdTag',
  故障现象: 'faultSymptom',
  故障描述: 'faultDescription',
  商家订单号: 'merchantOrderNo',
  商家销售日期: 'merchantSaleDate',
  服务方式: 'serviceTypeTitle',
  操作: 'actions',
}

const PAGE_ADJUSTMENT_DETAIL_COLUMN_WIDTH_OVERRIDES = {
  skuCode: 120,
  productName: 160,
  imeiSn: 160,
  handlingMethodTitle: 120,
  merchantIdTag: 140,
  faultSymptom: 140,
  faultDescription: 220,
  merchantOrderNo: 160,
  merchantSaleDate: 140,
  serviceTypeTitle: 120,
  actions: 100,
}

const PAGE_ADJUSTMENT_SELECT_OPTION_PRESETS = {
  serviceType: [
    { id: 'merchant-return', title: '商家退货' },
    { id: 'store-accept', title: '门店受理' },
    { id: 'express-pickup', title: '快递取件' },
  ],
  handlingMethod: [
    { id: 'full-return', title: '整机退货' },
    { id: 'partial-return', title: '配件退货' },
    { id: 'inspect-return', title: '检测后退货' },
  ],
  faultCategory: [
    { id: 'power', title: '不开机' },
    { id: 'appearance', title: '外观损伤' },
    { id: 'performance', title: '性能异常' },
    { id: 'other', title: '其他故障' },
  ],
}

function toGeneratedAsciiKey(label, index, prefix) {
  const normalizedLabel = normalizeText(label)
  if (!normalizedLabel) return `${prefix}${index + 1}`

  const asciiKey = normalizedLabel
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^\w]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment, segmentIndex) =>
      segmentIndex === 0
        ? segment.toLowerCase()
        : `${segment.slice(0, 1).toUpperCase()}${segment.slice(1).toLowerCase()}`
    )
    .join('')

  return asciiKey || `${prefix}${index + 1}`
}

function inferPageAdjustmentFieldKind(label) {
  if (/描述/u.test(label)) return 'textarea'
  if (/日期/u.test(label)) return 'date'
  if (/时间/u.test(label)) return 'datetime'
  if (/类型|方式|分类/u.test(label)) return 'select'
  return 'text'
}

function buildPageAdjustmentFieldConfigs(model) {
  const formFields = unique(model?.observedModules?.formFields)

  return formFields.map((label, index) => {
    const key =
      PAGE_ADJUSTMENT_FIELD_KEY_OVERRIDES[label] ||
      toGeneratedAsciiKey(label, index, 'field')

    return {
      label,
      key,
      kind: inferPageAdjustmentFieldKind(label),
      required: true,
      fullSpan: /描述/u.test(label),
    }
  })
}

function buildPageAdjustmentTabConfigs(model) {
  const rawTabs =
    unique(model?.observedModules?.productTypeTabs).length > 0
      ? unique(model.observedModules.productTypeTabs)
      : unique(model?.observedLabels)

  if (rawTabs.length === 0) {
    return [{ id: 'default-type', title: '默认类型' }]
  }

  return rawTabs.map((title, index) => ({
    id: slugifyId(title, index),
    title,
  }))
}

function buildPageAdjustmentDetailColumnConfigs(model) {
  const columns = unique(model?.observedModules?.detailTableColumns)

  return columns.map((label, index) => {
    const dataKey =
      PAGE_ADJUSTMENT_DETAIL_COLUMN_KEY_OVERRIDES[label] ||
      toGeneratedAsciiKey(label, index, 'column')

    return {
      title: label,
      dataKey,
      width: PAGE_ADJUSTMENT_DETAIL_COLUMN_WIDTH_OVERRIDES[dataKey] || 160,
      isAction: dataKey === 'actions',
    }
  })
}

function resolveAdjustmentBusinessSectionTitles(brief, model) {
  const pageTitle = normalizeText(
    brief?.requestedBusiness?.title || brief?.pageGenerationDecision?.businessSlotPlan?.title
  )
  const summary = normalizeText(model?.summary)

  if (pageTitle.includes('退货') || summary.includes('退货')) {
    return {
      formGroupTitle: '退货商品信息',
      detailTableTitle: '退货商品明细',
    }
  }

  return {
    formGroupTitle: '业务录入信息',
    detailTableTitle: '业务明细',
  }
}

function buildPageAdjustmentFormFieldConfigsLiteral(fieldConfigs) {
  return stringifyLiteral(fieldConfigs)
}

function buildPageAdjustmentDetailColumnConfigsLiteral(columnConfigs) {
  return stringifyLiteral(columnConfigs)
}

function buildPageAdjustmentTabsLiteral(tabs) {
  return stringifyLiteral(tabs)
}

function buildPageAdjustmentSelectOptionsLiteral(fieldConfigs) {
  const optionsByFieldKey = {}

  for (const field of fieldConfigs) {
    if (field.kind !== 'select') continue
    optionsByFieldKey[field.key] =
      PAGE_ADJUSTMENT_SELECT_OPTION_PRESETS[field.key] || [
        { id: `${field.key}-option-1`, title: `${field.label}选项一` },
        { id: `${field.key}-option-2`, title: `${field.label}选项二` },
        { id: `${field.key}-option-3`, title: `${field.label}选项三` },
      ]
  }

  return stringifyLiteral(optionsByFieldKey)
}

function buildFullPageEditAdjustmentSupportSource({ brief, executionPlan }) {
  const model = resolveAdjustmentViewModel(brief, executionPlan)
  const fieldConfigs = buildPageAdjustmentFieldConfigs(model)
  const tabConfigs = buildPageAdjustmentTabConfigs(model)
  const detailColumnConfigs = buildPageAdjustmentDetailColumnConfigs(model)
  const sectionTitles = resolveAdjustmentBusinessSectionTitles(brief, model)
  const primaryActionLabel = unique(model?.observedModules?.primaryActions)[0] || '添加'
  const pageAdjustmentSummary = normalizeText(model.summary)
  const pageAdjustmentStructureSummary = normalizeText(model.structureSummary)

  return [
    `const pageAdjustmentSelectedRegion = ${JSON.stringify(executionPlan.selectedRegion)}`,
    `const pageAdjustmentFormGroupTitle = ${JSON.stringify(sectionTitles.formGroupTitle)}`,
    `const pageAdjustmentDetailTableTitle = ${JSON.stringify(sectionTitles.detailTableTitle)}`,
    `const pageAdjustmentPrimaryActionLabel = ${JSON.stringify(primaryActionLabel)}`,
    `const pageAdjustmentProductTypeTabs = ${buildPageAdjustmentTabsLiteral(tabConfigs)}`,
    `const pageAdjustmentProductTypeTitleMap = pageAdjustmentProductTypeTabs.reduce((acc, item) => {`,
    `  acc[item.id] = item.title`,
    `  return acc`,
    `}, {} as Record<string, string>)`,
    `const pageAdjustmentFormFieldConfigs = ${buildPageAdjustmentFormFieldConfigsLiteral(fieldConfigs)}`,
    `const pageAdjustmentSelectOptions = ${buildPageAdjustmentSelectOptionsLiteral(fieldConfigs)}`,
    `const pageAdjustmentDetailColumnConfigs = ${buildPageAdjustmentDetailColumnConfigsLiteral(detailColumnConfigs)}`,
    '',
    `function buildPageAdjustmentDetailRow(tab, tabIndex, rowIndex) {`,
    `  const ordinal = rowIndex + 1`,
    `  const titleText = String(tab?.title || \`类型\${tabIndex + 1}\`)`,
    `  const dateSeed = String(10 + tabIndex * 2 + rowIndex).padStart(2, '0')`,
    `  const serializedHint = titleText.includes('串号')`,
    `  const baseRow = {`,
    `    id: \`\${tab?.id || \`type-\${tabIndex + 1}\`}-\${ordinal}\`,`,
    `  }`,
    '',
    `  for (const column of pageAdjustmentDetailColumnConfigs) {`,
    `    if (column.dataKey === 'actions') continue`,
    `    switch (column.dataKey) {`,
    `      case 'skuCode':`,
    `        baseRow[column.dataKey] = \`RET-\${tabIndex + 1}\${String(ordinal).padStart(2, '0')}\``,
    `        break`,
    `      case 'productName':`,
    `        baseRow[column.dataKey] = \`\${titleText}示例商品\${ordinal}\``,
    `        break`,
    `      case 'imeiSn':`,
    `        baseRow[column.dataKey] = serializedHint`,
    `          ? \`86888888888\${tabIndex + 1}\${ordinal}\``,
    `          : \`BATCH-\${tabIndex + 1}-\${ordinal}\``,
    `        break`,
    `      case 'handlingMethodTitle':`,
    `        baseRow[column.dataKey] = pageAdjustmentSelectOptions.handlingMethod?.[rowIndex % (pageAdjustmentSelectOptions.handlingMethod?.length || 1)]?.title || '处理方式示例'`,
    `        break`,
    `      case 'merchantIdTag':`,
    `        baseRow[column.dataKey] = \`MID-\${tabIndex + 1}\${String(ordinal).padStart(3, '0')}\``,
    `        break`,
    `      case 'faultSymptom':`,
    `        baseRow[column.dataKey] = serializedHint ? '设备异常' : '包装异常'`,
    `        break`,
    `      case 'faultDescription':`,
    `        baseRow[column.dataKey] = \`\${titleText}示例故障描述\${ordinal}\``,
    `        break`,
    `      case 'merchantOrderNo':`,
    `        baseRow[column.dataKey] = \`SO-20261015-\${tabIndex + 1}\${String(ordinal).padStart(2, '0')}\``,
    `        break`,
    `      case 'merchantSaleDate':`,
    `        baseRow[column.dataKey] = \`2026-10-\${dateSeed}\``,
    `        break`,
    `      case 'serviceTypeTitle':`,
    `        baseRow[column.dataKey] = pageAdjustmentSelectOptions.serviceType?.[rowIndex % (pageAdjustmentSelectOptions.serviceType?.length || 1)]?.title || '服务方式示例'`,
    `        break`,
    `      default:`,
    `        baseRow[column.dataKey] = \`\${column.title}示例值\${ordinal}\``,
    `        break`,
    `    }`,
    `  }`,
    '',
    `  return baseRow`,
    `}`,
    '',
    `const pageAdjustmentDetailRowsByType = pageAdjustmentProductTypeTabs.reduce((acc, item, tabIndex) => {`,
    `  acc[item.id] = Array.from({ length: 2 }, (_, rowIndex) => buildPageAdjustmentDetailRow(item, tabIndex, rowIndex))`,
    `  return acc`,
    `}, {} as Record<string, Array<Record<string, string>>>)`,
    '',
    `function resolvePageAdjustmentFieldPlaceholder(field, activeProductTypeTitle, translate) {`,
    `  if (field.key === 'merchantIdTag') return translate('商家ID标签, 不允许输入特殊字符')`,
    `  if (field.key === 'imeiSn') {`,
    `    return activeProductTypeTitle.includes('串号')`,
    `      ? translate('扫描串号回车')`,
    `      : translate('可填写批次或辅助标识')`,
    `  }`,
    `  if (field.kind === 'select') return translate(\`请选择\${field.label}\`)`,
    `  if (field.kind === 'date') return translate('选择日期')`,
    `  if (field.kind === 'datetime') return translate('选择时间')`,
    `  if (field.kind === 'textarea') return translate(\`请输入\${field.label}\`)`,
    `  return translate(field.label)`,
    `}`,
    '',
    `function buildPageAdjustmentFormField(field, translate, activeProductTypeTitle) {`,
    `  let schemaField = F(translate(field.label), field.key)`,
    `  const placeholder = resolvePageAdjustmentFieldPlaceholder(field, activeProductTypeTitle, translate)`,
    '',
    `  if (field.kind === 'select') {`,
    `    schemaField = schemaField.Select({`,
    `      data: (pageAdjustmentSelectOptions[field.key] || []).map((option) => ({`,
    `        ...option,`,
    `        title: translate(option.title),`,
    `      })),`,
    `    })`,
    `  } else if (field.kind === 'date') {`,
    `    schemaField = schemaField.Date({ ...dateProps, placeholder })`,
    `  } else if (field.kind === 'datetime') {`,
    `    schemaField = schemaField.Date({ ...dateTimeProps, placeholder })`,
    `  } else if (field.kind === 'textarea') {`,
    `    schemaField = schemaField.Textarea({ rows: 4, placeholder })`,
    `  } else {`,
    `    schemaField = schemaField.Text().Placeholder(placeholder)`,
    `  }`,
    '',
    `  if (field.required !== false) {`,
    `    schemaField = schemaField.Required()`,
    `  }`,
    '',
    `  if (field.fullSpan) {`,
    `    schemaField = schemaField.MWP({ span: 24 })`,
    `  }`,
    '',
    `  return schemaField.val`,
    `}`,
    '',
    `function buildPageAdjustmentInitialValues() {`,
    `  return pageAdjustmentFormFieldConfigs.reduce((acc, field) => {`,
    `    if (field.kind === 'select') {`,
    `      acc[field.key] = pageAdjustmentSelectOptions[field.key]?.[0]?.id || ''`,
    `      return acc`,
    `    }`,
    `    acc[field.key] = ''`,
    `    return acc`,
    `  }, {} as Record<string, string>)`,
    `}`,
    '',
    `const pageAdjustmentInitialValues = buildPageAdjustmentInitialValues()`,
    `const pageAdjustmentIntentSummary = ${JSON.stringify(pageAdjustmentSummary)}`,
    `const pageAdjustmentStructureSummary = ${JSON.stringify(pageAdjustmentStructureSummary)}`,
  ].join('\n')
}

function buildFullPageEditAdjustmentSetupBlock({ brief, executionPlan }) {
  return [
    `  const [activeProductType, setActiveProductType] = useState(pageAdjustmentProductTypeTabs[0]?.id || '')`,
    `  const activeProductTypeTitle = pageAdjustmentProductTypeTitleMap[activeProductType] || pageAdjustmentProductTypeTabs[0]?.title || ''`,
    `  const detailRows = useMemo(`,
    `    () =>`,
    `      (pageAdjustmentDetailRowsByType[activeProductType] || []).map((row) => ({`,
    `        ...row,`,
    `        handlingMethodTitle: row.handlingMethodTitle ? t(String(row.handlingMethodTitle)) : row.handlingMethodTitle,`,
    `        serviceTypeTitle: row.serviceTypeTitle ? t(String(row.serviceTypeTitle)) : row.serviceTypeTitle,`,
    `      })),`,
    `    [activeProductType, t]`,
    `  )`,
    `  const detailColumns = useMemo(`,
    `    () =>`,
    `      pageAdjustmentDetailColumnConfigs.map((column) => {`,
    `        if (column.isAction) {`,
    `          return {`,
    `            title: t(column.title),`,
    `            dataKey: column.dataKey,`,
    `            width: column.width,`,
    `            render: (_unusedValue, row) => (`,
    `              <Button`,
    `                type="primary"`,
    `                appearance="link"`,
    `                icon={<DeleteOutlined />}`,
    `                onClick={() =>`,
    `                  Message.open({`,
    `                    title: t('已移除 {item}', {`,
    `                      item: String(row?.productName || activeProductTypeTitle || '当前商品'),`,
    `                    }),`,
    `                  })`,
    `                }`,
    `              >`,
    `                {t('删除')}`,
    `              </Button>`,
    `            ),`,
    `          }`,
    `        }`,
    ``,
    `        return {`,
    `          title: t(column.title),`,
    `          dataKey: column.dataKey,`,
    `          width: column.width,`,
    `        }`,
    `      }),`,
    `    [activeProductTypeTitle, t]`,
    `  )`,
    `  const detailActionColumnKey = useMemo(`,
    `    () => pageAdjustmentDetailColumnConfigs.find((column) => column.isAction)?.dataKey || '',`,
    `    []`,
    `  )`,
    `  const groups = useMemo(`,
    `    () => [`,
    `      GS(t(pageAdjustmentFormGroupTitle))`,
    `        .Simple()`,
    `        .Fields(`,
    `          pageAdjustmentFormFieldConfigs.map((field) =>`,
    `            buildPageAdjustmentFormField(field, t, activeProductTypeTitle)`,
    `          )`,
    `        )`,
    `        .CardProps({ size: 'lg' })`,
    `        .val,`,
    `      GS(t(pageAdjustmentDetailTableTitle))`,
    `        .Custom({`,
    `          render: () => (`,
    `            <div className={styles.detailTableSection}>`,
    `              <Table`,
    `                bordered={false}`,
    `                data={detailRows}`,
    `                fieldKey="id"`,
    `                columns={detailColumns}`,
    `                emptyContent={t(\`暂无\${pageAdjustmentDetailTableTitle}\`)}`,
    `                fixedToColumn={detailActionColumnKey ? { right: detailActionColumnKey } : undefined}`,
    `                showColMenu={false}`,
    `                setting={false}`,
    `                sticky={false}`,
    `              />`,
    `            </div>`,
    `          ),`,
    `        })`,
    `        .Actions([`,
    `          <Button`,
    `            key="add-detail-row"`,
    `            appearance="link"`,
    `            type="primary"`,
    `            onClick={() =>`,
    `              Message.open({`,
    `                type: 'success',`,
    `                title: t('{productType}商品已加入明细', {`,
    `                  productType: activeProductTypeTitle || '当前',`,
    `                }),`,
    `              })`,
    `            }`,
    `          >`,
    `            {t(pageAdjustmentPrimaryActionLabel)}`,
    `          </Button>,`,
    `        ])`,
    `        .CardProps({ size: 'lg' })`,
    `        .val,`,
    `    ],`,
    `    [`,
    `      activeProductTypeTitle,`,
    `      detailActionColumnKey,`,
    `      detailColumns,`,
    `      detailRows,`,
    `      t,`,
    `    ]`,
    `  )`,
  ].join('\n')
}

function buildFullPageEditFormReplacementSource() {
  return [
    `            <div`,
    `              className={styles.formScrollContent}`,
    `              data-hiui5-page-adjustment-region={pageAdjustmentSelectedRegion}`,
    `            >`,
    `              <div className={styles.productTypeTabs}>`,
    `                <Tabs`,
    `                  type="line"`,
    `                  activeId={activeProductType}`,
    `                  onChange={(tabId) => {`,
    `                    startTransition(() => {`,
    `                      setActiveProductType(String(tabId || pageAdjustmentProductTypeTabs[0]?.id || ''))`,
    `                    })`,
    `                  }}`,
    `                >`,
    `                  {pageAdjustmentProductTypeTabs.map((item) => (`,
    `                    <Tabs.Pane key={item.id} tabId={item.id} tabTitle={t(item.title)} />`,
    `                  ))}`,
    `                </Tabs>`,
    `              </div>`,
    ``,
    `              <Form`,
    `                groups={groups}`,
    `                initialValues={pageAdjustmentInitialValues}`,
    `                formProps={{ labelPlacement: 'top' }}`,
    `                borderedGroups={false}`,
    `                gridProps={{`,
    `                  columnCount: 3,`,
    `                  gutter: 40,`,
    `                }}`,
    `              />`,
    `            </div>`,
  ].join('\n')
}

function insertBeforeToken(source, token, block, description) {
  const index = source.indexOf(token)
  if (index < 0) {
    throw new Error(`Unable to apply page adjustment transform: missing ${description}`)
  }

  return `${source.slice(0, index)}${block}\n\n${source.slice(index)}`
}

function insertBeforeFunctionDeclaration(source, functionName, block, description) {
  const pattern = new RegExp(`function\\s+${functionName}\\s*\\([\\s\\S]*?\\)\\s*\\{`, 'm')
  const match = pattern.exec(source)
  if (!match || match.index < 0) {
    throw new Error(`Unable to apply page adjustment transform: missing ${description}`)
  }

  return `${source.slice(0, match.index)}${block}\n\n${source.slice(match.index)}`
}

function replaceRange(source, range, replacement) {
  return `${source.slice(0, range.start)}${replacement}${source.slice(range.end)}`
}

function replaceFullPageEditSetupBlock(source, replacementBlock) {
  const start = source.indexOf('  const groups = useMemo(')
  if (start < 0) {
    throw new Error('Unable to apply page adjustment transform: missing full-page-edit groups block')
  }

  const end = source.indexOf('\n  return (', start)
  if (end < 0) {
    throw new Error('Unable to apply page adjustment transform: missing full-page-edit return statement')
  }

  return `${source.slice(0, start)}${replacementBlock}\n${source.slice(end)}`
}

function applyFullPageEditBusinessStructureTransform({ source, brief, executionPlan }) {
  let nextSource = source
  const helperSource = buildFullPageEditAdjustmentSupportSource({ brief, executionPlan })
  const setupBlock = buildFullPageEditAdjustmentSetupBlock({ brief, executionPlan })
  const formReplacementSource = buildFullPageEditFormReplacementSource()

  nextSource = ensureNamedImports(nextSource, 'react', ['startTransition', 'useMemo', 'useState'])
  nextSource = ensureNamedImports(nextSource, '@hi-ui/hiui', ['Button', 'Message', 'PageHeader', 'Space', 'Table', 'Tabs'])
  nextSource = ensureNamedImports(nextSource, '@hi-ui/icons', ['DeleteOutlined'])
  nextSource = insertBeforeFunctionDeclaration(
    nextSource,
    'FullPageEditInner',
    helperSource,
    'FullPageEditInner declaration'
  )
  nextSource = replaceFullPageEditSetupBlock(nextSource, setupBlock)

  const formRange = findSelfClosingComponentRange(nextSource, 'Form')
  if (!formRange) {
    throw new Error('Unable to apply page adjustment transform: missing Form block inside full-page-edit template')
  }

  nextSource = replaceRange(nextSource, formRange, formReplacementSource)
  return nextSource
}

function getExecutionSpec(pageTypeId) {
  const portalSpecs = {
    'table-basic': {
      mode: 'portal-relative-adjustment',
      transformType: 'frame-wrapper',
      frameComponent: 'TablePageFrame',
      anchorPlans: [
        {
          region: 'whiteBody top controlled region',
          targetClassExpression: 'proTablePageStyles.whiteBody',
          insertPosition: 'prepend',
        },
        {
          region: 'pre-table controlled region',
          targetClassExpression: 'proTablePageStyles.tableContainer',
          insertPosition: 'before',
        },
      ],
    },
    'tree-table': {
      mode: 'portal-relative-adjustment',
      transformType: 'frame-wrapper',
      frameComponent: 'TablePageFrame',
      anchorPlans: [
        {
          region: 'whiteBody top controlled region',
          targetClassExpression: 'proTablePageStyles.whiteBody',
          insertPosition: 'prepend',
        },
        {
          region: 'pre-table controlled region',
          targetClassExpression: 'proTablePageStyles.tableContainer',
          insertPosition: 'before',
        },
      ],
    },
    'table-stat': {
      mode: 'portal-relative-adjustment',
      transformType: 'frame-wrapper',
      frameComponent: 'StatListPageFrame',
      anchorPlans: [
        {
          region: 'whiteBody top controlled region',
          targetClassExpression: 'proStatPageStyles.whiteBody',
          insertPosition: 'prepend',
        },
        {
          region: 'pre-table controlled region',
          targetClassExpression: 'proStatPageStyles.tableContainer',
          insertPosition: 'before',
        },
      ],
    },
    'tree-split': {
      mode: 'portal-relative-adjustment',
      transformType: 'frame-wrapper',
      frameComponent: 'TreeSplitPageFrame',
      anchorPlans: [
        {
          region: 'whiteBody top controlled region',
          targetClassExpression: 'proTreeSplitPageStyles.rightColumn',
          insertPosition: 'prepend',
        },
        {
          region: 'pre-table controlled region',
          targetClassExpression: 'proTreeSplitPageStyles.tableContainer',
          insertPosition: 'before',
        },
      ],
    },
  }

  const inlineSpecs = {
    'full-page-edit': {
      mode: 'inline-region-insert',
      transformType: 'inline-token',
      renderStrategy: 'full-page-edit-business-structure',
      supportedRegions: ['form-scroll top controlled region'],
      insertBeforeToken: '<div className={proEditPageShellStyles.formScrollBody}>',
      insertedNodeIndent: '      ',
    },
    'full-page-detail': {
      mode: 'inline-region-insert',
      transformType: 'inline-token',
      supportedRegions: ['detail-body top controlled region', 'whiteBody top controlled region'],
      insertBeforeToken: '<div className={styles.detailBody}>',
      insertedNodeIndent: '          ',
    },
    'drawer-form': {
      mode: 'inline-region-insert',
      transformType: 'inline-token',
      surfaceKind: 'plain',
      supportedRegions: ['drawer-body top controlled region'],
      insertBeforeToken: '<TypicalPageFieldMapProvider>',
      insertedNodeIndent: '        ',
    },
    'drawer-detail': {
      mode: 'inline-region-insert',
      transformType: 'inline-token',
      surfaceKind: 'plain',
      supportedRegions: ['drawer-body top controlled region'],
      insertBeforeToken: '<Loading visible={isDetailDataLoading}>',
      insertedNodeIndent: '          ',
    },
    'feedback-status': {
      mode: 'inline-region-insert',
      transformType: 'inline-token',
      supportedRegions: ['whiteBody top controlled region'],
      insertBeforeToken: '<div style={panelStyle}>',
      insertedNodeIndent: '        ',
    },
  }

  return portalSpecs[pageTypeId] || inlineSpecs[pageTypeId] || null
}

export function planPageAdjustmentExecution({ brief }) {
  if (!brief?.pageAdjustmentContract) {
    return {
      status: 'not-requested',
      mode: 'not-requested',
      transformType: 'none',
      supportedRegions: [],
      selectedRegion: '',
      message: 'No pageAdjustmentContract was provided.',
    }
  }

  const spec = getExecutionSpec(brief.pageType?.id || '')
  if (!spec) {
    return {
      status: 'unsupported',
      mode: 'unsupported',
      transformType: 'none',
      supportedRegions: [],
      selectedRegion: '',
      message: `pageAdjustment execution is not implemented for pageType ${brief.pageType?.id || 'unknown'}`,
    }
  }

  const supportedRegions = spec.anchorPlans
    ? spec.anchorPlans.map((item) => item.region)
    : spec.supportedRegions || []
  const allowedRegions = unique(brief.pageAdjustmentContract.allowedRegions)
  const selectedRegion =
    allowedRegions.find((item) => supportedRegions.includes(item)) || supportedRegions[0] || ''

  if (!selectedRegion) {
    return {
      status: 'unsupported-region',
      mode: spec.mode,
      transformType: spec.transformType,
      supportedRegions,
      selectedRegion: '',
      message: `No supported local-adjustment region found. Allowed regions: ${allowedRegions.join(', ') || '—'}`,
    }
  }

  return {
    status: 'ready',
    mode: spec.mode,
    transformType: spec.transformType,
    supportedRegions,
    selectedRegion,
    frameComponent: spec.frameComponent || '',
    anchorPlans: spec.anchorPlans || [],
    insertBeforeToken: spec.insertBeforeToken || '',
    insertedNodeIndent: spec.insertedNodeIndent || '      ',
    renderStrategy: spec.renderStrategy || 'default-adjustment-helper',
    message: `Execute the local adjustment as a ${spec.mode} transform at ${selectedRegion}.`,
    surfaceKind: spec.surfaceKind || 'card',
  }
}

function buildPageAdjustmentHelperSource({ brief, executionPlan }) {
  const model = resolveAdjustmentViewModel(brief, executionPlan)
  const anchorResolverBranches = executionPlan.anchorPlans
    .map((item, index) => {
      const prefix = index === 0 ? 'const resolvedClassName =' : '  :'
      return `${prefix} anchorPlan.targetClassExpression === '${item.targetClassExpression}' ? ${item.targetClassExpression}`
    })
    .join('\n')
  const lines = [
    `const pageAdjustmentHostStyle = {`,
    `  display: 'flex',`,
    `  flex: '1 1 0%',`,
    `  flexDirection: 'column',`,
    `  minWidth: 0,`,
    `  minHeight: 0,`,
    `  overflow: 'hidden',`,
    `} as const`,
    '',
    `const pageAdjustmentSectionStyle = {`,
    `  display: 'grid',`,
    `  gap: 12,`,
    `  minWidth: 0,`,
    `} as const`,
    '',
    `const pageAdjustmentTagGroupStyle = {`,
    `  display: 'flex',`,
    `  flexWrap: 'wrap',`,
    `  gap: 8,`,
    `} as const`,
    '',
    `const pageAdjustmentTextStyle = {`,
    `  margin: 0,`,
    `  minWidth: 0,`,
    `} as const`,
    '',
    `const pageAdjustmentTabContentStyle = {`,
    `  paddingTop: 12,`,
    `} as const`,
    '',
    `const pageAdjustmentSelectedRegion = ${JSON.stringify(model.regionLabel)}`,
    `const pageAdjustmentSummary = ${JSON.stringify(model.summary)}`,
    `const pageAdjustmentObservedLabels = ${stringifyLiteral(model.observedLabels)}`,
    `const pageAdjustmentRetainedCharacteristics = ${stringifyLiteral(model.retainedCharacteristics)}`,
    `const pageAdjustmentDesignSystemConstraints = ${stringifyLiteral(model.designSystemConstraints)}`,
    `const pageAdjustmentValidationRules = ${stringifyLiteral(model.validationRules)}`,
    `const pageAdjustmentTabs = ${stringifyLiteral(model.tabs)}`,
    '',
    `function Hiui5PageAdjustmentRegion() {`,
    `  return (`,
    executionPlan.surfaceKind === 'plain'
      ? `    <div data-hiui5-page-adjustment-region={pageAdjustmentSelectedRegion} style={pageAdjustmentSectionStyle}>`
      : `    <Card
      title={${JSON.stringify(model.title)}}
      size="sm"
      extra={<Tag type="primary" appearance="line">{pageAdjustmentSelectedRegion}</Tag>}
      data-hiui5-page-adjustment-region={pageAdjustmentSelectedRegion}
    >`,
    executionPlan.surfaceKind === 'plain'
      ? `      <div style={pageAdjustmentTagGroupStyle}>
        <Tag type="primary" appearance="line">{pageAdjustmentSelectedRegion}</Tag>
      </div>`
      : `      <div style={pageAdjustmentSectionStyle}>`,
    executionPlan.surfaceKind === 'plain'
      ? `      <p style={pageAdjustmentTextStyle}>{pageAdjustmentSummary}</p>`
      : `        <p style={pageAdjustmentTextStyle}>{pageAdjustmentSummary}</p>`,
    executionPlan.surfaceKind === 'plain'
      ? `      {pageAdjustmentObservedLabels.length > 0 ? (
        <div style={pageAdjustmentTagGroupStyle}>
          {pageAdjustmentObservedLabels.map((item) => (
            <Tag key={item} appearance="line">{item}</Tag>
          ))}
        </div>
      ) : null}`
      : `        {pageAdjustmentObservedLabels.length > 0 ? (
          <div style={pageAdjustmentTagGroupStyle}>
            {pageAdjustmentObservedLabels.map((item) => (
              <Tag key={item} appearance="line">{item}</Tag>
            ))}
          </div>
        ) : null}`,
    executionPlan.surfaceKind === 'plain'
      ? `      {pageAdjustmentTabs.length > 0 ? (
        <Tabs type="line" defaultActiveId={pageAdjustmentTabs[0]?.id}>
          {pageAdjustmentTabs.map((item) => (
            <TabPane key={item.id} tabId={item.id} tabTitle={item.title}>
              <div style={pageAdjustmentTabContentStyle}>
                <p style={pageAdjustmentTextStyle}>
                  当前局部改造围绕「{item.title}」展开，继续保留基础模板的主体结构和主阅读流。
                </p>
              </div>
            </TabPane>
          ))}
        </Tabs>
      ) : null}`
      : `        {pageAdjustmentTabs.length > 0 ? (
          <Tabs type="line" defaultActiveId={pageAdjustmentTabs[0]?.id}>
            {pageAdjustmentTabs.map((item) => (
              <TabPane key={item.id} tabId={item.id} tabTitle={item.title}>
                <div style={pageAdjustmentTabContentStyle}>
                  <p style={pageAdjustmentTextStyle}>
                    当前局部改造围绕「{item.title}」展开，继续保留基础模板的主体结构和主阅读流。
                  </p>
                </div>
              </TabPane>
            ))}
          </Tabs>
        ) : null}`,
    executionPlan.surfaceKind === 'plain'
      ? `      {pageAdjustmentRetainedCharacteristics.length > 0 ? (
        <div style={pageAdjustmentTagGroupStyle}>
          {pageAdjustmentRetainedCharacteristics.map((item) => (
            <Tag key={item} type="success" appearance="line">{item}</Tag>
          ))}
        </div>
      ) : null}`
      : `        {pageAdjustmentRetainedCharacteristics.length > 0 ? (
          <div style={pageAdjustmentTagGroupStyle}>
            {pageAdjustmentRetainedCharacteristics.map((item) => (
              <Tag key={item} type="success" appearance="line">{item}</Tag>
            ))}
          </div>
        ) : null}`,
    executionPlan.surfaceKind === 'plain'
      ? `      {pageAdjustmentDesignSystemConstraints.length > 0 ? (
        <div style={pageAdjustmentSectionStyle}>
          {pageAdjustmentDesignSystemConstraints.map((item) => (
            <p key={item} style={pageAdjustmentTextStyle}>{item}</p>
          ))}
        </div>
      ) : null}`
      : `        {pageAdjustmentDesignSystemConstraints.length > 0 ? (
          <div style={pageAdjustmentSectionStyle}>
            {pageAdjustmentDesignSystemConstraints.map((item) => (
              <p key={item} style={pageAdjustmentTextStyle}>{item}</p>
            ))}
          </div>
        ) : null}`,
    executionPlan.surfaceKind === 'plain'
      ? `      {pageAdjustmentValidationRules.length > 0 ? (
        <div style={pageAdjustmentSectionStyle}>
          {pageAdjustmentValidationRules.map((item) => (
            <p key={item} style={pageAdjustmentTextStyle}>{item}</p>
          ))}
        </div>
      ) : null}`
      : `        {pageAdjustmentValidationRules.length > 0 ? (
          <div style={pageAdjustmentSectionStyle}>
            {pageAdjustmentValidationRules.map((item) => (
              <p key={item} style={pageAdjustmentTextStyle}>{item}</p>
            ))}
          </div>
        ) : null}`,
    executionPlan.surfaceKind === 'plain' ? `    </div>` : `      </div>\n    </Card>`,
    `  )`,
    `}`,
  ]

  if (executionPlan.mode === 'portal-relative-adjustment') {
    lines.push(
      '',
      `const pageAdjustmentAnchorPlans = ${stringifyLiteral(
        executionPlan.anchorPlans.map((item) => ({
          region: item.region,
          insertPosition: item.insertPosition,
          targetClassExpression: item.targetClassExpression,
        }))
      )}`,
      '',
      `function resolvePageAdjustmentAnchor(hostElement) {`,
      `  if (!hostElement) return null`,
      `  const anchorPlan = pageAdjustmentAnchorPlans.find((item) => item.region === pageAdjustmentSelectedRegion)`,
      `  if (!anchorPlan) return null`,
      `${anchorResolverBranches}`,
      `  : null`,
      `  if (!resolvedClassName) return null`,
      `  const target = hostElement.querySelector(\`.\${resolvedClassName}\`)`,
      `  if (!target) return null`,
      `  return {`,
      `    insertPosition: anchorPlan.insertPosition,`,
      `    target,`,
      `  }`,
      `}`,
      '',
      `function Hiui5PageAdjustmentPortal({ hostRef }) {`,
      `  const [mountNode, setMountNode] = useState(null)`,
      '',
      `  useEffect(() => {`,
      `    const anchor = resolvePageAdjustmentAnchor(hostRef?.current || null)`,
      `    if (!anchor) return undefined`,
      '',
      `    const nextMountNode = document.createElement('div')`,
      `    nextMountNode.dataset.hiui5PageAdjustmentRegion = pageAdjustmentSelectedRegion`,
      `    nextMountNode.style.minWidth = '0'`,
      '',
      `    if (anchor.insertPosition === 'prepend') {`,
      `      anchor.target.prepend(nextMountNode)`,
      `    } else if (anchor.target.parentElement) {`,
      `      anchor.target.parentElement.insertBefore(nextMountNode, anchor.target)`,
      `    } else {`,
      `      return undefined`,
      `    }`,
      '',
      `    setMountNode(nextMountNode)`,
      '',
      `    return () => {`,
      `      setMountNode(null)`,
      `      nextMountNode.remove()`,
      `    }`,
      `  }, [hostRef])`,
      '',
      `  if (!mountNode) return null`,
      `  return createPortal(<Hiui5PageAdjustmentRegion />, mountNode)`,
      `}`
    )
  }

  return lines.join('\n')
}

export function applyPageAdjustmentTransform({ source, brief, executionPlan }) {
  if (!brief?.pageAdjustmentContract) return source
  if (!executionPlan || executionPlan.status !== 'ready') {
    throw new Error(
      `Unable to apply page adjustment transform: execution plan is ${executionPlan?.status || 'missing'}`
    )
  }

  if (executionPlan.renderStrategy === 'full-page-edit-business-structure') {
    return applyFullPageEditBusinessStructureTransform({ source, brief, executionPlan })
  }

  let nextSource = source
  const helperSource = buildPageAdjustmentHelperSource({ brief, executionPlan })

  if (executionPlan.mode === 'portal-relative-adjustment') {
    nextSource = ensureNamedImports(nextSource, 'react', ['useEffect', 'useRef', 'useState'])
    nextSource = ensureNamedImports(nextSource, 'react-dom', ['createPortal'])
    nextSource = ensureNamedImports(nextSource, 'hiui5', ['Card', 'Tag', 'Tabs', 'TabPane'])
    nextSource = insertBeforeFirstExport(nextSource, helperSource)
    const frameRange = findSelfClosingComponentRange(nextSource, executionPlan.frameComponent)
    if (!frameRange) {
      throw new Error(`Unable to apply page adjustment transform: missing ${executionPlan.frameComponent}`)
    }
    const returnIndex = nextSource.lastIndexOf('return (', frameRange.start)
    if (returnIndex < 0) {
      throw new Error('Unable to apply page adjustment transform: missing owning return statement')
    }

    const returnIndent = getLineIndent(nextSource, returnIndex)
    nextSource = `${nextSource.slice(0, returnIndex)}${returnIndent}const pageAdjustmentHostRef = useRef(null)\n\n${nextSource.slice(returnIndex)}`

    const adjustedFrameRange = findSelfClosingComponentRange(nextSource, executionPlan.frameComponent)
    if (!adjustedFrameRange) {
      throw new Error(`Unable to apply page adjustment transform: missing ${executionPlan.frameComponent} after host insertion`)
    }

    const frameIndent = getLineIndent(nextSource, adjustedFrameRange.start)
    const originalFrame = nextSource.slice(adjustedFrameRange.start, adjustedFrameRange.end)
    const wrappedFrame = [
      `${frameIndent}<div ref={pageAdjustmentHostRef} style={pageAdjustmentHostStyle}>`,
      ...originalFrame.split('\n').map((line) => `${frameIndent}  ${line}`),
      `${frameIndent}  <Hiui5PageAdjustmentPortal hostRef={pageAdjustmentHostRef} />`,
      `${frameIndent}</div>`,
    ].join('\n')

    return `${nextSource.slice(0, adjustedFrameRange.start)}${wrappedFrame}${nextSource.slice(adjustedFrameRange.end)}`
  }

  nextSource = ensureNamedImports(nextSource, 'hiui5', ['Card', 'Tag', 'Tabs', 'TabPane'])
  nextSource = insertBeforeFirstExport(nextSource, helperSource)
  const injectedNode = `${executionPlan.insertedNodeIndent}<Hiui5PageAdjustmentRegion />\n\n${executionPlan.insertedNodeIndent}`

  return replaceFirst(
    nextSource,
    executionPlan.insertBeforeToken,
    `${injectedNode}${executionPlan.insertBeforeToken}`,
    executionPlan.insertBeforeToken
  )
}

export function collectPageAdjustmentExecutionViolations({ pageSource = '', brief, executionPlan }) {
  if (!brief?.pageAdjustmentContract) return []
  const violations = []

  if (!executionPlan || executionPlan.status !== 'ready') {
    violations.push(`${brief.pageType.id}: pageAdjustment execution plan is not ready`)
    return violations
  }

  if (!pageSource.includes('data-hiui5-page-adjustment-region')) {
    violations.push(`${brief.pageType.id}: generated output is missing page-adjustment runtime marker`)
  }

  if (executionPlan.renderStrategy === 'full-page-edit-business-structure') {
    if (!pageSource.includes('pageAdjustmentProductTypeTabs')) {
      violations.push(`${brief.pageType.id}: generated output is missing page-adjustment product type tabs`)
    }
    if (!pageSource.includes('styles.formScrollContent')) {
      violations.push(`${brief.pageType.id}: generated output is missing controlled form-scroll content container`)
    }
    if (!pageSource.includes('<Table')) {
      violations.push(`${brief.pageType.id}: generated output is missing business detail table`)
    }
    if (!pageSource.includes('pageAdjustmentPrimaryActionLabel')) {
      violations.push(`${brief.pageType.id}: generated output is missing business primary action`)
    }
    if (pageSource.includes('Hiui5PageAdjustmentRegion')) {
      violations.push(`${brief.pageType.id}: generated output must not fall back to Hiui5PageAdjustmentRegion helper`)
    }
    if (pageSource.includes('styles.detailTableHeader')) {
      violations.push(`${brief.pageType.id}: generated output must not hand-roll a second detail-table header block`)
    }
    if (pageSource.includes('styles.detailTableTitle')) {
      violations.push(`${brief.pageType.id}: generated output must not hand-roll a second detail-table title block`)
    }
    if (pageSource.includes('styles.detailTableHint')) {
      violations.push(`${brief.pageType.id}: generated output must not keep detail-table explanation hint residue`)
    }
    if (pageSource.includes('styles.addActionRow')) {
      violations.push(`${brief.pageType.id}: generated output must not keep a standalone add-action row outside group actions`)
    }
    if (pageSource.includes('styles.formSectionMeta')) {
      violations.push(`${brief.pageType.id}: generated output must not keep a standalone form-section meta helper block`)
    }

    if (!pageSource.includes(JSON.stringify(executionPlan.selectedRegion))) {
      violations.push(`${brief.pageType.id}: generated output does not declare the selected local adjustment region`)
    }

    return violations
  }

  if (!pageSource.includes('Hiui5PageAdjustmentRegion')) {
    violations.push(`${brief.pageType.id}: generated output is missing Hiui5PageAdjustmentRegion helper`)
  }

  if (executionPlan.mode === 'portal-relative-adjustment') {
    if (!pageSource.includes('Hiui5PageAdjustmentPortal')) {
      violations.push(`${brief.pageType.id}: generated output is missing Hiui5PageAdjustmentPortal`)
    }
    if (!pageSource.includes('createPortal')) {
      violations.push(`${brief.pageType.id}: generated output is missing createPortal for runtime local adjustment`)
    }

    for (const anchorPlan of executionPlan.anchorPlans) {
      if (anchorPlan.region === executionPlan.selectedRegion && !pageSource.includes(anchorPlan.targetClassExpression)) {
        violations.push(
          `${brief.pageType.id}: generated output is missing selected anchor ${anchorPlan.targetClassExpression}`
        )
      }
    }
  } else if (!pageSource.includes('<Hiui5PageAdjustmentRegion />')) {
    violations.push(`${brief.pageType.id}: generated output is missing inline local adjustment insertion`)
  }

  if (!pageSource.includes(JSON.stringify(executionPlan.selectedRegion))) {
    violations.push(`${brief.pageType.id}: generated output does not declare the selected local adjustment region`)
  }

  return violations
}
