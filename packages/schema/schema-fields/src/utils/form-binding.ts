import type { FormBindingProps } from '@hi-ui/schema-core'

type AnyFormBindingProps = Partial<
  Omit<FormBindingProps, 'onChange'> & {
    onChange: (...args: AnyType[]) => void
  }
>

// TODO 待完善类型定义

export function wrapFormBinding<T extends Partial<AnyFormBindingProps>>(
  formBinding: FormBindingProps,
  fieldProps: T
) {
  return {
    ...formBinding,
    value: formBinding.value as AnyType,
    onChange: (...args: AnyType[]) => {
      type Params = Parameters<NonNullable<FormBindingProps['onChange']>>

      formBinding.onChange(...(args as Params))
      fieldProps.onChange?.(...(args as Params))
    },
    onBlur: (...args: AnyType[]) => {
      type Params = Parameters<NonNullable<FormBindingProps['onBlur']>>

      formBinding.onBlur(...(args as Params))
      fieldProps.onBlur?.(...(args as Params))
    },
  }
}
