import type React from 'react'
import type { ColProps } from '@hi-ui/grid'
import type { TabPaneProps } from '@hi-ui/tabs'
import { mergeProps } from '@hi-ui/schema-utils'
import { F } from '../field/editable'
import type { FieldConfigType } from '../field/type'
import {
  // type
  GroupType,
  GroupRendererConfigType,
  GroupConfigType,
  GroupControlType,
} from './type'

export class GroupCreator<T extends GroupType> {
  private _val: GroupConfigType<T>

  protected _mergeVal(val: Partial<GroupConfigType<T>>) {
    this._val = mergeProps(this._val, val as GroupConfigType<T>)
    return this
  }

  /** 合并任意配置 */
  Merge(val: Partial<GroupConfigType<T>>) {
    return this._mergeVal(val)
  }

  constructor(title: string | React.ReactElement, dataIndex?: string, titleText?: string) {
    this._val = {
      title,
      dataIndex,
      _titleText: titleText ?? (typeof title === 'string' ? title : ''),
    } as GroupConfigType<T>
  }

  Type<Type extends GroupType>(type: Type) {
    return (this._mergeVal({
      type: (type as unknown) as T,
    }) as unknown) as GroupCreator<Type>
  }

  Config(type: T, config: GroupRendererConfigType[T]) {
    return this._mergeVal({
      type,
      config,
    } as Partial<GroupConfigType<T>>)
  }

  /** 设置唯一ID */
  ID(id: string) {
    return this._mergeVal({ id })
  }

  /**
   * 设置副标题
   * @desc 折叠面板暂不支持副标题
   */
  SubTitle(subTitle: string | React.ReactElement, subTitleText?: string) {
    return this._mergeVal({
      subTitle,
      _subTitleText: subTitleText ?? (typeof subTitle === 'string' ? subTitle : ''),
    })
  }

  /** 设置组的字段 */
  Fields(fields: FieldConfigType[]) {
    return this._mergeVal({ config: { fields } } as Partial<GroupConfigType<T>>)
  }

  /**
   * 表单中的可编辑表格
   * - config 中的 field 字段不传时，会自动根据组的信息生成一个字段
   * - 因此至少需要确保组的 title 和 dataIndex 字段有效
   */
  FormEditTable(config: GroupRendererConfigType['edit-table']) {
    // field 存在，可以正确生成表单字段
    if (config.field) return this.EditTable(config)

    const title = this._val._titleText || ''
    const dataIndex = this._val.dataIndex
    if (!dataIndex) {
      console.warn('GroupCreator.FormEditTable: 未找到有效的 dataIndex 值，可编辑表配置无效\n')
      return this
    }

    const field = F(title, dataIndex).EditTable({
      fields: config.fields,
      ...config.props,
      ...config.formExtra,
    })

    return this.EditTable({ ...config, field: field.val })
  }

  Form(config: GroupRendererConfigType['form']) {
    return this._mergeVal({
      type: 'form',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'form'>
  }

  Table(config: GroupRendererConfigType['table']) {
    return this._mergeVal({
      type: 'table',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'table'>
  }

  Descriptions(config: GroupRendererConfigType['descriptions']) {
    return this._mergeVal({
      type: 'descriptions',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'descriptions'>
  }

  EditTable(config: GroupRendererConfigType['edit-table']) {
    return this._mergeVal({
      type: 'edit-table',
      config,
    } as Partial<GroupConfigType<T>>)
  }

  /**
   * 将组设置为【简单】类型
   * - 一般用于表单的子组中，不渲染为复杂组件
   */
  Simple(config: Partial<GroupRendererConfigType['simple']> = {}) {
    return this._mergeVal({
      type: 'simple',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'simple'>
  }

  Custom(config: GroupRendererConfigType['custom']) {
    return this._mergeVal({
      type: 'custom',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'custom'>
  }

  /** 将组设置为【标签页】类型 */
  Tabs(config: GroupRendererConfigType['tabs']) {
    return this._mergeVal({
      type: 'tabs',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'tabs'>
  }

  /** 设置单个标签的属性 */
  TabProps(props: Partial<TabPaneProps>) {
    // wrapperProps 只在 ChildGroupConfigType 上存在
    // 因此下面的位置如果不强制写类型断言，就会报错
    return this._mergeVal({
      wrapperProps: props,
    } as Partial<GroupConfigType<T>>)
  }

  /** 将组设置为【网格】类型 */
  Grid(config: GroupRendererConfigType['grid']) {
    return this._mergeVal({
      type: 'grid',
      config,
    } as Partial<GroupConfigType<T>>) as GroupCreator<'grid'>
  }

  /**
   * 设置子组
   * - 不可单独使用，需先明确组类型
   */
  Children<Type extends GroupType>(children: GroupConfigType<Type>[]) {
    if (this.val.type === 'grid') {
      return this.Grid({
        children: children as GroupConfigType<'grid'>['config']['children'],
      })
    }

    if (this.val.type === 'tabs') {
      return this.Tabs({
        children: children as GroupConfigType<'tabs'>['config']['children'],
      })
    }

    return this
  }

  /**
   * 设置网格元素的列属性
   * @desc 仅在 Grid 中使用
   */
  ColProps(props: Partial<ColProps>) {
    return this._mergeVal({
      wrapperProps: props,
    } as Partial<GroupConfigType<T>>)
  }

  /**
   * 设置网格元素的跨列数
   * @desc 仅在 Grid 中使用
   */
  Span(span: number) {
    return this.ColProps({ span })
  }

  /**
   * 设置嵌套子组的二次嵌套组
   * @desc 用来在单个嵌套组（例如 Tab、Grid.Col）中渲染多个子组
   */
  ChildGroups(groups: GroupConfigType<GroupType>[]) {
    return this._mergeVal(({
      type: 'child-groups',
      groups,
      config: {},
    } as Partial<GroupConfigType<'child-groups'>>) as GroupConfigType<T>) as GroupCreator<
      'child-groups'
    >
  }

  /**
   * 设置组是否可折叠
   * @desc 打开后组渲染为可折叠面板，默认全部展开
   * @desc 也可用来设置折叠面板的控制属性
   */
  Collapsible(enable: GroupControlType['collapsible'] = true) {
    return this._mergeVal({
      control: {
        collapsible: enable,
      },
    })
  }

  /**
   * 设置组边框
   */
  Bordered(bordered = true) {
    return this._mergeVal({ control: { bordered } })
  }

  /**
   * 设置组是否只读
   * - 一般用在表单中，用来控制组内所有字段是否只读
   * - 传入布尔值时，由组自身决定是否只读
   * - 传入 undefined 字符串时，不设置只读状态
   */
  RO(readonly: boolean | 'undefined' = true) {
    if (readonly === 'undefined') return this
    return this._mergeVal({ control: { readonly } })
  }

  /**
   * 设置是否展示组标题
   */
  HideTitle(hide = true) {
    return this._mergeVal({
      control: {
        hideTitle: hide,
      },
    })
  }

  /**
   * 设置卡片式面板的属性
   */
  CardProps(props: GroupControlType['extraCardProps']) {
    return this._mergeVal({
      control: {
        extraCardProps: props,
      },
    })
  }

  Actions(actions: GroupRendererConfigType['custom']['actions']) {
    return this._mergeVal({
      config: { actions },
    } as Partial<GroupConfigType<T>>)
  }

  get val() {
    return this._val
  }
}
