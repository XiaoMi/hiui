import React from 'react'
import type {
  FilterFn,
  SortingFn,
  ColumnFiltersState,
  SortingColumnDef,
  BuiltInAggregationFn,
  AggregationFn,
} from '@tanstack/react-table'
import type { SelectDataItem } from '@hi-ui/select'
import type { UsePopoverProps } from '@hi-ui/popover/lib/types/use-popover'
import type { PopoverProps } from '@hi-ui/popover'
import type { PipeGetter, BoolConfig, RawItemType } from '@hi-ui/schema-utils'

import type {
  // fields
  EnhancedRenderersType,
  ProFieldsProps,
  BuiltinFieldMapType,
  // renderers/form
  FormItemProps,
  EnhancedFormRefType,
  FormFieldDataIndexType,
  // components
  DependencyRenderCtx,
  InterruptConfigType,
  CustomLabelFn,
  // BatchDepUpdate, // TODO batchUpdate 待实现
  FilterType,
  CustomFilterProps,
  FilterExtraOptsType,
  TableSorterProps,
  DynamicEditableCtxType,
  FieldCustomHeaderActionsFn,
  BuiltInSortingFn,
  BuiltInFilterFn,
  GetHeaderCellWrapperDynamicAttrsFnType,
  GetBodyCellWrapperDynamicAttrsFnType,
} from '../interface'

import type { FieldRendererType } from './abstract'

export type ValueTypePresets = keyof BuiltinFieldMapType
export type ValueType = LiteralUnion<ValueTypePresets>

export type FormDependencyFieldsCtx<TData extends AnyObject = AnyObject> =
  DependencyRenderCtx<TData> & {
    formRef: EnhancedFormRefType<TData>
    /** 父字段的数据索引 */
    parentDataIndex?: FormFieldDataIndexType
  }

/**
 * 依赖字段创建函数
 * @param depValues 依赖字段值
 * @param ctx 依赖上下文
 * @returns 新的字段清单
 */
export type DependencyFieldsFn<T extends AnyObject = AnyObject, Key extends keyof T = keyof T> = (
  depValues: Pick<T, Key>,
  ctx: FormDependencyFieldsCtx<Pick<T, Key> & T>
) => FieldConfigType[]

export type FormDependencyValueCtx<T extends AnyObject = AnyObject> = FormDependencyFieldsCtx<T> & {
  /** 批量更新字段 */
  // TODO batchUpdate 待实现
  // batchUpdate: typeof BatchDepUpdate.update
}

/**
 * 依赖值函数
 * @param depValues 依赖字段值
 * @param ctx 依赖上下文
 * @returns 新的字段值，自动写入formInstance
 */
export type DependencyValueFn<T extends AnyObject = AnyObject, Key extends keyof T = keyof T> = (
  depValues: Pick<T, Key>,
  ctx: FormDependencyValueCtx<Pick<T, Key> & T>
) => unknown

export type FormDependencyPropsCtx<T extends AnyObject = AnyObject> = FormDependencyFieldsCtx<T> & {
  field: FieldConfigType
}

// 下面三个作用类似

/** 依赖字段属性函数 */
export type DependencyFieldPropsFn<
  T extends AnyObject = AnyObject,
  Key extends keyof T = keyof T,
  FieldProps = AnyObject
> = (depValues: Pick<T, Key>, ctx: FormDependencyPropsCtx<Pick<T, Key> & T>) => FieldProps
/** 依赖字段外层包裹属性函数 */
export type DependencyWrapperPropsFn<
  T extends AnyObject = AnyObject,
  Key extends keyof T = keyof T,
  WrapperProps = AnyObject
> = (depValues: Pick<T, Key>, ctx: FormDependencyPropsCtx<Pick<T, Key> & T>) => WrapperProps
/** 依赖字段表单项属性函数 */
export type DependencyFormItemPropsFn<
  T extends AnyObject = AnyObject,
  Key extends keyof T = keyof T
> = (depValues: Pick<T, Key>, ctx: FormDependencyPropsCtx<Pick<T, Key> & T>) => FormItemProps

export type FieldConfigType<
  // FieldProps是指字段底层组件本身的props
  FieldProps = AnyObject,
  // WrapperProps是指字段外部包裹组件的props，例如Descriptions.Item
  WrapperProps = AnyObject
> = {
  title: string | React.ReactElement
  /** 标题的纯文本，用于记录原始信息 */
  _titleText?: string
  dataIndex: string
  key: string
  valueType: ValueType
  renderer: FieldRendererType
  fieldProps: PipeGetter<FieldProps>
  wrapperProps?: WrapperProps
  formItemProps?: PipeGetter<FormItemProps>

  /**
   * 子字段，用来描述嵌套字段
   * @desc 通常用在表格表头头分组
   */
  children?: FieldConfigType[]
  // 字段控制功能
  control?: FieldControlType
  // 辅助功能
  payload?: FieldPayloadType

  // 增强功能
  /** 依赖能力 */
  dependency?: {
    /** 依赖的字段 */
    deps: string[]
    /** 字段创建函数，返回新的字段清单 */
    fields?: DependencyFieldsFn
    /** 复杂字段的子字段创建函数，返回新的字段清单 */
    childFields?: DependencyFieldsFn
    /** 依赖值函数，返回新的字段值，自动写入 formInstance */
    value?: DependencyValueFn
    /** 依赖属性函数，返回新的 props 配置 */
    props?: {
      fieldProps?: DependencyFieldPropsFn
      wrapperProps?: DependencyWrapperPropsFn
      formItemProps?: DependencyFormItemPropsFn
    }
  }

  /**
   * 其他额外配置
   * @desc 用来定义无法被上述功能包含的配置
   */
  extra?: FieldExtraConfigType
}

export interface FieldExtraConfigType {
  /** 自定义表头操作 */
  headerActions?: FieldCustomHeaderActionsFn
  /**
   * 是否必须与组一起使用
   * @desc 通常备用在复杂多值字段中，例如典型的【可编辑表】
   * @desc 当字段被标记为 mustInGroup，且不在组中使用时，会被自动过滤掉，并在控制台得到警告
   */
  mustInGroup?: boolean
  /**
   * 自定义表单字段 Label
   */
  customLabel?: CustomLabelFn
  /**
   * 弹出层配置
   * - 此处仅包含 popper 组件 UsePopoverProps 中的公共配置
   * - 会直接透传给底层的 popper 组件
   * - 例如 TableFilter 等组件
   */
  popperProps?: Partial<UsePopoverProps>
  /**
   * 增强型的自定义渲染函数
   * - 用于在字段内部渲染逻辑的基础之上进行额外增强
   * - 会在内部渲染逻辑执行完毕后，执行本函数（若有）
   * - 目前仅在可编辑表的 renderEditable 上受支持
   */
  enhancedRenderers?: EnhancedRenderersType
}

/**
 * 控制字段的配置，用来配置字段的行为
 * @desc 不同字段配置会被不同的渲染器中被消费，并不一定都会生效
 * @desc 若字段与外部配置冲突，则字段配置的值优先级更高
 */
export type FieldControlType = {
  /**
   * 字段的文本对齐方式
   * @desc 仅在表格中生效
   * @desc 默认值为 left
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 字段(描述、表格)是否可编辑
   * @desc 仅在可编辑描述和可编辑表格中生效
   * @desc 在不可编辑的位置开启编辑
   */
  editable?: boolean
  /**
   * 【动态】判断字段是否可编辑
   * - 仅在可编辑描述和可编辑表格中生效
   * - 本函数返回真值时，字段开启编辑，否则改为只读
   */
  dynamicEditable?: (ctx: DynamicEditableCtxType) => boolean
  /**
   * 字段是否只读
   * @desc 在可编辑组件中生效
   * @desc 在可编辑的位置开启只读
   */
  readonly?: boolean
  /**
   * 字段是否禁用
   * @desc 在可编辑组件中生效
   * @desc 在可编辑的位置开启禁用
   */
  disabled?: boolean
  /**
   * 字段是否隐藏
   * @desc 在所有组件中生效
   */
  hidden?: boolean
  /**
   * 字段是否隐藏标签
   * @desc 在表单组件中生效
   */
  hideLabel?: boolean
  /**
   * 字段是否启动层次背景
   * @desc 在表单的 FormList 组件中生效
   */
  tieredBg?: boolean
  /**
   * 字段是否展示元素边框
   * @desc 在表单的 FormList 组件中生效
   */
  bordered?: boolean
  /**
   * 字段是否必填
   * @desc 在可编辑组件中生效
   */
  required?: boolean
  /**
   * 字段是否固定
   * @desc 仅在可编辑表格中生效
   */
  fixed?: 'left' | 'right'
  /**
   * 字段是否可拖拽
   * @desc 仅在表格中生效
   */
  draggable?: boolean
  /**
   * 字段是否渲染成本很大
   * @desc 常用在自定义的复杂组件中
   * @desc 默认情况下，字段定义变化时，会重新渲染表单项
   * @desc 开启后，无论字段定义如何变化，都不会重新渲染表单项
   * @desc 带来的副作用是，字段定义的复杂组件，必须不能依赖 fields 数组所在上下文中的动态变量
   */
  expensive?: boolean
  /**
   * 字段是否为简单字段
   * @desc 仅在表格中生效，直接展示字段值，不进行其他任何包装
   * @desc 值为 undefined/null/空字符串时，展示 - 占位符，其他直接展示字段值
   */
  simple?: boolean
  /**
   * 是否仅在 hover 时显示表头操作
   * @desc 仅在表格中生效
   */
  hoverOnly?: boolean
  /**
   * 是否开启过滤
   * @desc 仅在表格中生效
   */
  filter?: BoolConfig<FieldFilterConfigType>
  /**
   * 是否开启排序
   * @desc 仅在表格中生效
   */
  sorter?: BoolConfig<FieldSorterConfigType>
  /**
   * 是否开启列分组
   * @desc 仅在表格中生效
   */
  grouping?: BoolConfig<FieldGroupingConfigType>
  /**
   * 自定义表格表头单元格的渲染属性
   * @desc 仅在可编辑表格中生效
   * @desc 返回值会透传给底层的 TH 元素
   */
  headerCell?: GetHeaderCellWrapperDynamicAttrsFnType
  /**
   * 自定义表格主体单元格的渲染属性
   * @desc 仅在可编辑表格中生效
   * @desc 返回值会透传给底层的 TD 元素
   */
  bodyCell?: GetBodyCellWrapperDynamicAttrsFnType
  /**
   * 中断配置
   * @desc 会直接透传给底层的 InterruptInjector 组件
   */
  interrupt?: InterruptConfigType
}

export type FieldFilterGetAsyncOptionsFn = (ctx: {
  /** 搜索关键字 */
  keyword?: string
  /** 当前字段的过滤值 */
  filterValue: unknown
  /** 所有字段的过滤值 */
  allFilters: ColumnFiltersState
  /** 内部的选项自动生成函数 */
  autoGenerateOpts: () => RawItemType<string>[]
}) => SelectDataItem[] | Promise<SelectDataItem[]>

export type FieldFilterConfigType = {
  /**
   * 过滤类型
   * @desc 暂时仅在可编辑表格中生效
   * @desc 非必传，默认会根据字段类型自动选择合适的过滤类型
   * @desc 使用 custom 时，必须要传入 custom 组件
   */
  type?: FilterType
  /**
   * 过滤函数
   * @desc 暂时强依赖`@tanstack/react-table`,仅在可编辑表格中生效
   * @desc 非必传，内部会根据字段类型自动选择合适的过滤函数
   */
  filterFn?: BuiltInFilterFn | FilterFn<AnyObject>
  /**
   * 自定义过滤器
   * @desc 暂时仅在可编辑表格中生效
   * @desc 非必传，内部会根据字段类型自动选择合适的过滤器组件
   * @desc 使用 custom 类型时，必须要传入本属性
   */
  custom?: React.ComponentType<CustomFilterProps>
  /**
   * 异步自定义选项
   * @desc 暂时仅在可编辑表格中生效
   * @desc 非必传，内部会根据字段类型自动选择合适的选项
   * @desc type 为 select 时，可以传入该选项
   */
  options?: FieldFilterGetAsyncOptionsFn
  /**
   * 额外配置
   * @desc 暂时仅在可编辑表格中生效
   * @desc 会直接透传给底层的 TableFilter 组件
   */
  extraProps?: FilterExtraOptsType
  /**
   * 弹出层配置
   * @desc 暂时仅在可编辑表格中生效
   * @desc 会直接透传给底层的 TableFilter 组件
   * - 注意与更底层的 popperProps 的区别
   */
  popoverProps?: Partial<PopoverProps>
}

export type FieldSorterConfigType = {
  /**
   * 排序函数
   * @desc 默认值为 textLocalCompare
   * @desc 暂时强依赖`@tanstack/react-table`，仅在可编辑表格中生效
   */
  sortingFn?: BuiltInSortingFn | SortingFn<AnyObject>
  /**
   * 如何排序 undefined 值
   * @desc 暂时强依赖`@tanstack/react-table`,仅在可编辑表格中生效
   * @desc 非必传，默认值为 'last'
   */
  sortUndefined?: SortingColumnDef<AnyObject>['sortUndefined']
  /**
   * 排序提示
   * @desc 暂时仅在可编辑表格中生效
   */
  // @ts-expect-error tooltip
  tooltip?: TableSorterProps['tooltip'] // TODO tooltip 待实现
}

export type FieldGroupingConfigType = {
  /**
   * 如何聚合分组后的列
   * @desc 暂时强依赖`@tanstack/react-table`,仅在可编辑表格中生效
   * @desc 仅在表格启用 grouping 选项后生效
   * @desc 非必传，默认值为 count
   */
  aggregationFn: BuiltInAggregationFn | AggregationFn<AnyObject>
}

/**
 * 辅助配置，用来保存渲染过程中的上下文状态
 */
export type FieldPayloadType = {
  /** 是否需要更新 */
  shouldUpdate?: boolean
  /** 设置下拉类型组件的选中值，用于在渲染时获取选中值的显示文本 */
  setSelectedRawOption?: (values?: AnyObject) => void
}

// 有点过于类型体操了，实际作用是：
// 在传入Getter类型是【对象】或者【函数】时，自动收敛至对应的对象定义
export type ExtractGetter<K extends ValueTypePresets, T> = T extends infer P
  ? P extends AnyFn // 先判断是否为函数
    ? PipeFn<ProFieldsProps[K]>
    : P extends object
    ? DeepPartial<P>
    : never
  : never
