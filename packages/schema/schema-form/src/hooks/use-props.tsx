import { useLatest } from 'ahooks'
import { useFieldMap } from '@hi-ui/schema-fields'
import { mergeProps } from '@hi-ui/schema-utils'
import type { ProFieldMapType } from '@hi-ui/schema-fields'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { SchemaFormProps } from '../form'

// 标准化后的 props 类型
export type NormalizedProps<TData extends AnyObject> = Omit<
  ReturnType<typeof getNormalizedProps<TData>>,
  'fieldMap'
> & {
  fieldMap: ProFieldMapType
}

export function getNormalizedProps<TData extends AnyObject>(props: SchemaFormProps<TData>) {
  const { initialValues = {} } = props

  return {
    ...props,
    initialValues: initialValues as Partial<TData>,
  }
}

export function usePropsRef<TData extends AnyObject>(props: SchemaFormProps<TData>) {
  const _nextProps = getNormalizedProps(props)

  const fieldMap = useFieldMap({ fieldMap: props.fieldMap })

  const formProps = mergeProps(
    {
      labelWidth: 120,
      labelPlacement: 'right',
      showColon: false,
      initialValues: _nextProps.initialValues,
      onSubmit: _nextProps.onSubmit,
    },
    props.formProps
  )

  const gridProps = mergeProps(
    {
      columnCount: props.column,
      layoutShiftSensitive: true,
    },
    props.gridProps
  )

  const nextProps: NormalizedProps<TData> = {
    ..._nextProps,
    fieldMap,
    formProps,
    gridProps,
    // 不要通过 mergeProps 合并 ref
    gridWrapperElRef: _nextProps.gridProps?.wrapperElRef || _nextProps.gridWrapperElRef,
  }

  const propsRef = useLatest(nextProps) as ReadonlyRefObject<NormalizedProps<TData>>

  return { propsRef }
}
