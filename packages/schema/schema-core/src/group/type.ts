import type React from 'react'
import type { CardProps } from '@hi-ui/card'
import type { CollapsePanelProps } from '@hi-ui/collapse'
import type { TabsProps, TabPaneProps } from '@hi-ui/tabs'
import type { ColProps } from '@hi-ui/grid'
import type { BoolConfig } from '@hi-ui/schema-utils'
import type { FieldConfigType } from '../field/type'
import type {
  GridHelperProps,
  SchemaFormProps,
  SchemaTableProps,
  SchemaDescriptionsProps,
  EditTableProps,
  ActionsProps,
  ProEditTableProps,
} from '../interface'

// @ts-expect-error 忽略类型检查
export type GroupActionsConfigType = ActionsProps['actions']

/** 与内置组件对应的组类型 */
export type ElGroupType =
  | 'form'
  | 'table'
  | 'descriptions'
  // | 'edit-descriptions'
  | 'edit-table'

/** 容器组类型 */
type ContainerGroupType = 'tabs' | 'grid'

/** 逻辑组类型 */
type LogicGroupType = 'simple' | 'custom' | 'child-groups'

/** 完整组类型 */
export type GroupType = ElGroupType | ContainerGroupType | LogicGroupType

/** 表单中允许的组类型 */
export type FormGroupType = Extract<
  GroupType,
  'simple' | 'custom' | 'grid' | 'tabs' | 'edit-table' // | 'child-groups'
>

type FormRendererConfigType = {
  // @ts-expect-error 忽略类型检查
  fields: SchemaFormProps['fields']
  props?: Partial<SchemaFormProps>
  actions?: GroupActionsConfigType
}

type TableRendererConfigType = {
  // @ts-expect-error 忽略类型检查
  fields: SchemaTableProps['fields']
  props?: Partial<SchemaTableProps>
  actions?: GroupActionsConfigType
}

type DescriptionsRendererConfigType = {
  // @ts-expect-error 忽略类型检查
  fields: SchemaDescriptionsProps['fields']
  props?: Partial<SchemaDescriptionsProps>
  actions?: GroupActionsConfigType
}

type EditTableRendererConfigType = {
  /**
   * 绑定的表单字段
   * - 仅在表单中有效
   */
  // @ts-expect-error 忽略类型检查
  field?: SchemaFormProps['fields'][0]
  /**
   * 字段清单
   * - 表格本体的字段清单，等价于 props.fields
   * - 在表单、组渲染器中均有效
   */
  // @ts-expect-error 忽略类型检查
  fields: EditTableProps['fields']
  props?: Partial<EditTableProps>
  actions?: GroupActionsConfigType
  /**
   * 表单中额外配置
   * - 主要是表单中额外工具栏的配置
   */
  formExtra?: Pick<
    ProEditTableProps,
    // @ts-expect-error 忽略类型检查
    'toolbar' | 'actions' | 'catchInnerCtx' | 'doNotCompleteRerender'
  >
}

type CustomRendererConfigType = {
  render: () => React.ReactNode
  actions?: GroupActionsConfigType
}

type ChildGroupsRendererConfigType = {
  // child-groups 留空勿删
}

type SimpleRendererConfigType = {
  fields: FieldConfigType[]
  actions?: GroupActionsConfigType
}

type TabsRendererConfigType = {
  type?: TabsProps['type']
  defaultActiveId?: string
  children?: ChildGroupConfigType<TabPaneProps>[] // 使用子组类型
  props?: TabsProps
  actions?: GroupActionsConfigType
}

type GridRendererConfigType = {
  // @ts-expect-error 忽略类型检查
  columnCount?: GridHelperProps['columnCount']
  // @ts-expect-error 忽略类型检查
  gutter?: GridHelperProps['gutter']
  // @ts-expect-error 忽略类型检查
  rowGap?: GridHelperProps['rowGap']
  props?: GridHelperProps
  actions?: GroupActionsConfigType
  children?: ChildGroupConfigType<ColProps>[] // 使用子组类型
}

export type GroupRendererConfigType = {
  form: FormRendererConfigType
  table: TableRendererConfigType
  descriptions: DescriptionsRendererConfigType
  'edit-table': EditTableRendererConfigType
  custom: CustomRendererConfigType
  'child-groups': ChildGroupsRendererConfigType
  // 简单类型，只被表单消费，自身不会渲染为复杂组件
  simple: SimpleRendererConfigType
  tabs: TabsRendererConfigType
  grid: GridRendererConfigType
}

// 非嵌套的组类型配置
type BaseGroupConfigType<T extends GroupType> = {
  /**
   * 类型
   * @desc 分为基本类型和其他类型
   * @desc 基本类型与内置的表单、表格、描述等组件对应
   * @desc 其他类型则需要分别释义
   * @desc simple 类型，只被表单消费，自身不会渲染为复杂组件
   * @desc tabs 类型，渲染为标签页组件，需要传入子组配置
   */
  type: T
  /** 唯一标识 */
  id?: string
  /** 取值字段名 */
  dataIndex?: string
  /** 标题 */
  title: string | React.ReactElement
  /** 标题的纯文本，用于记录原始信息 */
  _titleText?: string
  /**
   * 副标题
   * - 折叠面板暂不支持副标题
   */
  subTitle?: string | React.ReactElement
  /** 副标题的纯文本，用于记录原始信息 */
  _subTitleText?: string
  /** 详细配置 */
  config: GroupRendererConfigType[T extends keyof GroupRendererConfigType ? T : never]
  // /** 组渲染器 */
  // renderer?: FieldsGroupRendererType
  /** 其他控制属性 */
  control?: GroupControlType
}

// 嵌套子组的辅助类型
export type ChildGroupConfigType<TChild = AnyObject> = {
  [T in GroupType]: BaseGroupConfigType<T> & {
    /**
     * 嵌套子组的包裹元素属性
     * @desc 例如 Tabs 时的 TabPaneProps
     */
    wrapperProps?: TChild
    /**
     * 嵌套子组的二次嵌套组
     * @desc 需被渲染器消费方可生效，目前仅被 Tabs 使用，用来在单个 Tab 中渲染多个子组
     */
    groups?: BaseGroupConfigType<GroupType>[]
  }
}[GroupType]

export type GroupConfigType<T extends GroupType = GroupType> = BaseGroupConfigType<T>

// export type FieldsGroupRendererType = {
//   left?: () => React.ReactNode
//   right?: () => React.ReactNode
// }

export type GroupControlType = {
  /**
   * 是否展示组边框
   * - 默认值为 undefined
   * - 父容器默认开启 bordered，因此实际上还是默认有边框的
   */
  bordered?: boolean
  /**
   * 是否隐藏组标题
   */
  hideTitle?: boolean
  /**
   * 是否可折叠
   * @desc 打开后组渲染为可折叠面板，默认全部展开
   */
  collapsible?: BoolConfig<Partial<CollapsePanelProps>>
  /**
   * 卡片式面板的全量配置
   */
  extraCardProps?: Partial<CardProps>
  /**
   * 组是否开启只读模式
   * - 开启后组内所有字段均开启只读模式
   * - 目前仅在表单中生效
   */
  readonly?: boolean
}
