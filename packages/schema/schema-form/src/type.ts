// import React from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import type { FormItemProps as HiUIFormItemProps } from '@hi-ui/form'
import type { ColProps } from '@hi-ui/grid'

export type FormItemProps = Omit<
  HiUIFormItemProps,
  | keyof HiBaseHTMLProps<'div'>
  // 这些字段不需要从 FormItemProps 传入
  | 'label'
  | 'field'
  | 'render'
  | 'valuePropName'
  | 'valueChangeFuncPropName'
>

export type FormRule = NonNullable<FormItemProps['rules']>[0]

// // 这种定义方式会导致 FieldCreator 的泛型过长
// export type FormItemWrapperProps = Omit<ColProps, keyof HiBaseHTMLProps<'div'>> & {
//   // FormItemWrapperProps
// }

export type FormItemWrapperProps = Pick<ColProps, 'span' | 'offset' | 'justify' | 'order'> & {
  // FormItemWrapperProps
}
