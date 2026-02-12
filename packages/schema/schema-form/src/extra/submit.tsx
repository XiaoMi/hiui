import React from 'react'
import Button, { ButtonProps } from '@hi-ui/button'
import { EnhancedFormRefType } from '../ref'

export type SchemaFormSubmitProps<TData extends AnyObject = AnyObject> = Omit<
  ButtonProps,
  'onClick'
> & {
  onClick?: (result: TData, error: unknown) => void
  formRef: EnhancedFormRefType<TData>
}

export function SchemaFormSubmit<TData extends AnyObject = AnyObject>(
  props: SchemaFormSubmitProps<TData>
) {
  const { formRef, onClick, type = 'primary', ...rest } = props

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    formRef.current
      ?.validate()
      .then((result) => {
        onClick?.(result, null)
      })
      .catch((error) => {
        onClick?.(null as unknown as TData, error)
      })
  }

  return (
    <Button role="form-submit" {...rest} type={type} onClick={handleClick}>
      {props.children ?? '提交'}
    </Button>
  )
}
