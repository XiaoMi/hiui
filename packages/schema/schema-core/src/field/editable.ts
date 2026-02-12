// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import type React from 'react' // 勿删
import type { PipeGetter } from '@hi-ui/schema-utils'
import { FieldCreator } from './base'
import { genRequiredMsg } from './utils'
import type {
  ProCascaderProps,
  ProCheckboxProps,
  ProCheckCascaderProps,
  ProCheckSelectProps,
  ProCheckTreeSelectProps,
  ProCounterProps,
  ProDateProps,
  ImageUploadProps,
  ProNumberProps,
  ProRadioProps,
  ProRatingProps,
  ProSelectProps,
  ProSliderProps,
  ProSwitchProps,
  ProTextAreaProps,
  ProTextProps,
  ProTimePickerProps,
  ProTreeSelectProps,
  ProUploadProps,
  ProEditTableProps,
  ProNumberRangeProps,
  FormObjectConfigType,
  FormListConfigType,
  InterruptConfigType,
  FormItemWrapperProps,
  FormRule,
} from '../interface'
import type { FieldConfigType } from './type'

export class EditableFieldCreator<
  FieldProps = AnyObject,
  WrapperProps = AnyObject
> extends FieldCreator<FieldProps, WrapperProps> {
  /**
   * 设置为必填项
   * @param msg 必填项的提示信息
   */
  Required(msg?: string) {
    const message = msg ?? genRequiredMsg(this.val as FieldConfigType)
    // mergeVal 给其他非表单的可编辑项，MFIP 给表单项
    return this._mergeVal({ control: { required: true } }).MFIP({
      required: true,
      rules: [
        // 不允许为 undefined 或者 null
        { required: true, message },
        {
          // 也不允许为空串或者空数组
          // @ts-expect-error 忽略类型检查
          validator(rule, value, callback) {
            if (value === '') callback(new Error(message))
            else if (Array.isArray(value) && value.length === 0) callback(new Error(message))
            else callback()
          },
        },
      ],
    })
  }

  /**
   * 根据参数动态设置是否必填
   */
  DynamicRequired(required = true, extra?: { msg?: string }) {
    if (required) {
      return this.Required(extra?.msg)
    }

    return this.MFIP({ required: false })
  }

  /**
   * 设置表单校验规则
   * @param ruleOrRules 表单校验规则
   * @desc 请注意，需在 Required 后调用，否则规则会被 Required 覆盖
   */
  Rules(ruleOrRules: FormRule | FormRule[]) {
    // 外部传入的
    const rules = Array.isArray(ruleOrRules) ? ruleOrRules : [ruleOrRules]
    // 内部已有的
    const prevRules =
      typeof this.val.formItemProps === 'function'
        ? []
        : // @ts-expect-error 忽略类型检查
          this.val.formItemProps?.rules ?? []

    return this.MFIP({ rules: [...prevRules, ...rules] })
  }

  /**
   * 设置字段为禁用状态
   */
  Disabled(disabled = true) {
    // @ts-expect-error 忽略类型检查
    this.MFP(this.val.valueType as 'text', { disabled })
    this._mergeVal({ control: { disabled } })
    return this
  }

  /** 设置只读属性 */
  RO(readonly: boolean | 'undefined' = true) {
    if (readonly === 'undefined') return this
    return this._mergeVal({ control: { readonly } })
  }

  /** 设置字段的占位符 */
  Placeholder(placeholder: string) {
    const type = this.val.valueType
    // @ts-expect-error 忽略类型检查
    return this.MFP((type || 'text') as 'text', { placeholder })
  }

  /**
   * 设置字段在网格中的占位
   * - 网格列数为24
   * - 字段占据网格的宽度为 span / 24
   * - 仅在表单中有效
   */
  Span(span: number) {
    this.MWP(({ span } as FormItemWrapperProps) as WrapperProps)
    return this
  }

  /**
   * 设置标签位置
   * - 在表单组件中生效
   */
  LabelPlacement(placement: 'top' | 'left' | 'right') {
    return this.MFIP({ labelPlacement: placement })
  }

  /**
   * 隐藏标签
   * - 在表单组件中生效
   */
  HideLabel(hideLabel = true) {
    return this.Control({ hideLabel }) // 不显示label的文字
  }

  /**
   * 设置字段边框
   * - 在表单组件中生效
   */
  Bordered(bordered = true) {
    return this.Control({ bordered })
  }

  /**
   * 设置字段为表单对象字段类型
   * - 默认占据24列
   */
  FormObject(config: Partial<FormObjectConfigType> = {} as FormObjectConfigType) {
    return this.Span(24)._mergeVal({
      valueType: 'form-object-field',
      fieldProps: config as FieldProps,
    })
  }

  /**
   * 设置字段为表单列表字段类型
   * - 默认占据24列
   */
  FormList(config: Partial<FormListConfigType> = {} as FormListConfigType) {
    return this.Span(24)._mergeVal({
      valueType: 'form-list-field',
      fieldProps: config as FieldProps,
    })
  }

  /**
   * 设置复杂字段的字段清单
   * - 仅在表单组件中生效
   * - 目前仅被 FormObject 和 FormList 消费，因此调用者需明确了解这两种字段的特性
   * - FormObject 仅支持配置对象数组，传入对象会在内部自动转换为【单个长度的对象数组】
   * - FormList 则两种都支持，区别在于传入数组时，绑定的 dataIndex 中会包含子字段的 dataIndex
   * - 例如，当前字段为 parent，子字段为 child，数组索引为 index
   * @example
   * // 传入对象
   * const fullIndex = [parent, index]
   * // 传入数组
   * const fullIndex = [parent, index, child]
   */
  Fields(fields: FieldConfigType | FieldConfigType[]) {
    return this.Span(24)._mergeVal({
      fieldProps: ({ fields } as FormObjectConfigType | FormListConfigType) as FieldProps,
    })
  }

  /**
   * 设置字段的层次背景色
   * - 在表单的 FormList 组件中生效
   */
  TieredBg(tieredBg = true) {
    return this.Control({ tieredBg })
  }

  /**
   * 设置字段的中断配置
   * - 目前仅支持Select/Radio/Switch/Cascader
   * - 如需在其他组件中使用，请联系研发支持
   */
  Interrupt(config: InterruptConfigType) {
    return this.Control({ interrupt: config })
  }

  Cascader(opts?: PipeGetter<ProCascaderProps>) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('cascader', {
      expandTrigger: 'hover',
      ...opts,
    })
  }

  CheckCascader(opts?: ProCheckCascaderProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('check-cascader', {
      expandTrigger: 'hover',
      ...opts,
    })
  }

  CheckSelect(opts?: ProCheckSelectProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('check-select', opts)
  }

  CheckTreeSelect(opts?: ProCheckTreeSelectProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('check-tree-select', opts)
  }

  Checkbox(opts?: ProCheckboxProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('checkbox', opts)
  }

  Counter(opts?: ProCounterProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('counter', opts)
  }

  Date(opts?: ProDateProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('date', opts)
  }

  Number(opts?: ProNumberProps) {
    this.Align('right')
    // @ts-expect-error 忽略类型检查
    return this.MFP('number', opts)
  }

  Radio(opts?: ProRadioProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('radio', opts)
  }

  Rating(opts?: ProRatingProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('rating', opts)
  }

  Select(opts?: ProSelectProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('select', opts)
  }

  Slider(opts?: ProSliderProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('slider', opts)
  }

  Switch(opts?: ProSwitchProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('switch', opts)
  }

  Textarea(opts?: ProTextAreaProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('textarea', opts)
  }

  Text(opts?: ProTextProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('text', opts)
  }

  TimePicker(opts?: ProTimePickerProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('time-picker', opts)
  }

  TreeSelect(opts?: ProTreeSelectProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('tree-select', opts)
  }

  Upload(opts?: ProUploadProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('upload', opts)
  }

  ImageUpload(opts?: ImageUploadProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('image', { ...opts })
  }

  NumberRange(opts?: ProNumberRangeProps) {
    // @ts-expect-error 忽略类型检查
    return this.MFP('number-range', { ...opts })
  }

  EditTable(opts?: ProEditTableProps) {
    // @ts-expect-error 忽略类型检查
    this.MFP('edit-table', opts)
    this.MWP(({ span: 24 } as FormItemWrapperProps) as WrapperProps)
    this._mergeVal({
      extra: { mustInGroup: true },
    })

    return this
  }

  /**
   * TODO: 用户选择
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  User(opts?: AnyType) {
    return this
  }

  /**
   * TODO: 用户选择
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UserSelect(opts?: AnyType) {
    return this
  }

  /**
   * TODO: 用户选择
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UserCheckSelect(opts?: AnyType) {
    return this
  }
}

type EditableFieldCreatorParams = ConstructorParameters<typeof EditableFieldCreator>

export const F = (...params: EditableFieldCreatorParams) =>
  new EditableFieldCreator<AnyObject, FormItemWrapperProps>(...params)
