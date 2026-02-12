import React from 'react'
import { set } from 'lodash-es'
import { mergeProps } from '@hi-ui/schema-utils'
import type { TableColumnItem } from '@hi-ui/table'
import type { PipeGetter } from '@hi-ui/schema-utils'
import { setPayload } from './utils'
import type {
  FormItemProps,
  CustomLabelFn,
  CustomLabelUsedBy,
  ProFieldsProps,
  EnhancedRenderersType,
  ProLinkProps,
  ProImageProps,
  ProTagProps,
} from '../interface'
import type {
  // abstract
  FieldRendererType,
  ProFieldRenderEditCellCtx,
} from './abstract'
import type {
  ExtractGetter,
  FieldConfigType,
  ValueType,
  ValueTypePresets,
  DependencyFieldsFn,
  DependencyValueFn,
  DependencyFieldPropsFn,
  DependencyWrapperPropsFn,
  DependencyFormItemPropsFn,
  FieldControlType,
} from './type'

export class FieldCreator<FieldProps = AnyObject, WrapperProps = AnyObject> {
  private _val: FieldConfigType<FieldProps, WrapperProps>

  private _setVal<K extends keyof FieldConfigType<FieldProps, WrapperProps>>(
    field: K,
    value: FieldConfigType<FieldProps, WrapperProps>[K]
  ) {
    this._val[field] = value
    return this
  }

  protected _mergeVal(val: Partial<FieldConfigType<FieldProps, WrapperProps>>) {
    this._val = mergeProps(this._val, val as FieldConfigType<FieldProps, WrapperProps>)
    return this
  }

  protected _setPipeGetter<
    Field extends 'fieldProps' | 'formItemProps',
    Getter extends FieldConfigType<FieldProps, WrapperProps>[Field]
  >(field: Field, getter?: Getter) {
    if (!getter) return this

    // 对象式的
    if (typeof getter === 'object') {
      this._mergeVal({ [field]: getter })
    }
    // 函数式的
    else if (typeof getter === 'function') {
      // 把之前的值塞上去
      // TODO 不确定会不会有这么复杂的场景，先塞上去吧
      set(getter, '_payload', this._val[field])
      this._setVal(field, getter as AnyType)
    }

    return this
  }

  constructor(title: string | React.ReactElement, dataIndex: string, titleText?: string) {
    this._val = {
      title,
      _titleText: titleText ?? (typeof title === 'string' ? title : ''),
      dataIndex,
      key: dataIndex,
      valueType: 'text',
      renderer: {},
      fieldProps: {} as FieldProps,
      formItemProps: {},
    }
  }

  /** 设置字段类型 */
  VT(type: ValueType) {
    this._setVal('valueType', type)
    return this
  }

  /**
   * 设置嵌套字段列表
   * - 如何呈现取决于渲染器的具体实现
   */
  Children(fields: FieldConfigType[]) {
    return this._mergeVal({ children: fields })
  }

  /**
   * 设置依赖字段
   * @param deps 依赖的字段
   * @param depFn 依赖函数，返回新的字段清单
   * @desc 使用 DependencyFields 时，其他功能将会失效，将仅会渲染新生成的依赖字段
   */
  DependencyFields<Key extends string>(deps: Key[], depFn: DependencyFieldsFn<AnyObject, Key>) {
    this._setVal('dependency', { deps, fields: depFn })
    return this
  }

  /**
   * 设置子依赖字段
   * @param deps 依赖的字段
   * @param depFn 依赖函数，返回新的字段清单
   * - 仅在 FormObject 中可用
   * - 使用 ChildDependencyFields 时，其他功能仍然可用
   */
  ChildDependencyFields<Key extends string>(
    deps: Key[],
    depFn: DependencyFieldsFn<AnyObject, Key>
  ) {
    this._setVal('dependency', { deps, childFields: depFn })
    return this
  }

  /**
   * 设置依赖值
   * @param deps 依赖的字段
   * @param depFn 依赖函数，返回新的当前字段的值
   */
  DependencyValue<Key extends string>(deps: Key[], depFn: DependencyValueFn<AnyObject, Key>) {
    this._mergeVal({ dependency: { deps, value: depFn } })
    return this
  }

  /**
   * 标记字段需要更新
   * @desc 例如使用 Dependency 时，可通过此方法标记字段需要更新
   */
  Update() {
    setPayload(this._val as FieldConfigType, { shouldUpdate: true })
    return this
  }

  /** 设置字段组件的 props */
  // @ts-expect-error 忽略类型检查
  MFP<ValueType extends ValueTypePresets = 'text'>(
    type: ValueType,
    props?: ExtractGetter<ValueType, FieldConfigType<ProFieldsProps[ValueType]>['fieldProps']>
  ) {
    this.VT(type) // props是否存在，都设置字段类型

    if (!props) return this
    return this._setPipeGetter('fieldProps', props as PipeGetter<FieldProps>)
  }

  /** 根据依赖字段，设置字段组件的 props */
  // @ts-expect-error 忽略类型检查
  DependencyMFP<Key extends string, ValueType extends ValueTypePresets = 'text'>(
    type: ValueType,
    deps: Key[],
    depFn: DependencyFieldPropsFn<
      AnyObject,
      Key,
      ExtractGetter<ValueType, FieldConfigType<ProFieldsProps[ValueType]>['fieldProps']>
    >
  ) {
    this.VT(type)
    this._mergeVal({ dependency: { deps, props: { fieldProps: depFn } } })
    return this
  }

  /** 设置表单项的 props */
  MFIP(props: PipeGetter<FormItemProps>) {
    this._setPipeGetter('formItemProps', props)
    return this
  }

  /** 根据依赖字段，设置表单项的 props */
  DependencyMFIP<Key extends string>(
    deps: Key[],
    depFn: DependencyFormItemPropsFn<AnyObject, Key>
  ) {
    this._mergeVal({ dependency: { deps, props: { formItemProps: depFn } } })
    return this
  }

  /** 设置包裹组件的 props */
  MWP(props: WrapperProps) {
    this._mergeVal({ wrapperProps: props })
    return this
  }

  /** 根据依赖字段，设置包裹组件的 props */
  DependencyMWP<Key extends string>(
    deps: Key[],
    depFn: DependencyWrapperPropsFn<AnyObject, Key, WrapperProps>
  ) {
    this._mergeVal({
      dependency: { deps, props: { wrapperProps: depFn as DependencyWrapperPropsFn } },
    })
    return this
  }

  /** 设置字段的额外配置 */
  Extra(extra: Partial<FieldConfigType['extra']>) {
    this._mergeVal({ extra })
    return this
  }

  renderReadonly(render: FieldRendererType['render']) {
    this._mergeVal({ renderer: { render } })
    return this
  }

  renderCell(renderCell: FieldRendererType['renderCell']) {
    this._mergeVal({ renderer: { renderCell } })
    return this
  }

  renderFormItem(renderFormItem: FieldRendererType['renderFormItem']) {
    // @ts-expect-error valueType上没有 custom 类型，因此此处会报错
    this.MFP('custom', {}) // 有传入 renderFormItem 时，自动设置 valueType 为 custom

    this._mergeVal({ renderer: { renderFormItem } })
    return this
  }

  /**
   * 表格单元格可编辑状态的语法别名
   * - 本质仍是 renderFormItem 逻辑
   * - 额外增加了单元格中的特有字段的类型定义
   * - 字段数据请使用 ctx.formBinding.value 获取
   */
  renderEditCell(renderEditCell: (data: null, ctx: ProFieldRenderEditCellCtx) => React.ReactNode) {
    this._mergeVal({ renderer: { renderFormItem: renderEditCell } })
    return this
  }

  renderEditable(renderEditable: FieldRendererType['renderEditable']) {
    this._mergeVal({ renderer: { renderEditable } })
    return this
  }

  /** 设置字段控制选项 */
  Control(control: FieldControlType) {
    this._mergeVal({ control })
    return this
  }

  /** 设置字段的增强渲染函数 */
  EnhancedRenderers(enhancedRenderers: EnhancedRenderersType) {
    this.Extra({ enhancedRenderers })
    return this
  }

  get val() {
    return this._val
  }

  Number() {
    this.VT('number')
    this.Align('right')
    return this
  }

  Link(key?: string, opts?: ProLinkProps) {
    this.VT('link')
    // @ts-expect-error 忽略类型检查
    this.MFP('link', { isHref: false, linkField: key, ...opts })
    return this
  }

  Image(opts?: ProImageProps) {
    // @ts-expect-error 忽略类型检查
    this.MFP('image', { ...opts })
    this.MWP({ className: 'image-preview-cell' } as TableColumnItem as WrapperProps)
    return this
  }

  IPDTag(opts?: ProTagProps) {
    // @ts-expect-error 忽略类型检查
    this.MFP('tag', { bordered: true, ...opts })
    return this
  }

  /** 设置包裹组件的宽度 */
  W(width: number) {
    this._mergeVal({ wrapperProps: { width } as WrapperProps })
    return this
  }

  /** 设置字段的文本对齐方式 */
  Align(align: 'left' | 'center' | 'right') {
    // 可编辑表依赖的字段
    this._mergeVal({ control: { align } })
    // HiUI Table 的列对齐方式
    this.MWP({ align } as TableColumnItem as WrapperProps) // 表格渲染时右对齐
    return this
  }

  /** 设置字段是否隐藏 */
  Hidden(hidden = true) {
    return this._mergeVal({ control: { hidden } })
  }

  /** 设置自定义 Label */
  // @ts-expect-error 忽略类型检查
  CustomLabel<T extends CustomLabelUsedBy = undefined>(fn: CustomLabelFn<T>) {
    return this._mergeVal({
      extra: { customLabel: fn },
    })
  }

  /**
   * TODO: 搜索助手
   * @param args
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SearchHelper(args: AnyType) {
    return this
  }
}

export class FieldCreatorHelper<TCustomClass extends typeof FieldCreator = typeof FieldCreator> {
  readonly instance: InstanceType<TCustomClass>

  constructor(CustomClass: TCustomClass = FieldCreator as TCustomClass) {
    this.instance = new CustomClass('', '') as InstanceType<TCustomClass>
  }

  setInstance(field: FieldConfigType) {
    // @ts-expect-error 私有属性
    return this.instance._mergeVal(field)
  }

  public mergeVal(val: Partial<FieldConfigType>) {
    // @ts-expect-error 私有属性
    return this.instance._mergeVal(val)
  }

  public mergeControl(val: Partial<FieldControlType>) {
    // @ts-expect-error 私有属性
    return this.instance._mergeVal({ control: val })
  }

  public setPipeGetter<
    Field extends 'fieldProps' | 'formItemProps',
    Getter extends FieldConfigType[Field]
  >(field: Field, getter?: Getter) {
    // @ts-expect-error 私有属性
    return this.instance._setPipeGetter(field, getter)
  }

  get val() {
    // @ts-expect-error 私有属性
    return this.instance._val as FieldConfigType
  }
}
