import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'

import useFormInstance from './hooks/useFormInstance'
import * as HIUI from '../'
const Group = {
  ['Radio.Group']: HIUI['Radio'].Group,
  ['Checkbox.Group']: HIUI['Checkbox'].Group
}
const prefixCls = 'hi-form-schema'

const SchemaForm = props => {
  const { FormWrapper, FormItem, FormReset, FormSubmit } = useFormInstance(
    props,
    'SchemaForm'
  )
  const {
    schema: schemaProps,
    children: childrenProps,
    submit,
    reset,
    schemaformValue
  } = props
  const [schema, setSchema] = useState(schemaProps)
  useEffect(() => {
    setSchema(schemaProps)
  }, [schemaProps])
  const renderSchemaFormItem = useCallback(() => {
    if (Array.isArray(schema)) {
      return schema.map((schemaItem, index) => {
        const { component, componentProps } = schemaItem
        let child = null
        if (HIUI[component] || Group[component]) {
          const ChildComponent = HIUI[component] || Group[component]
          child = <ChildComponent {...componentProps} />
        } else {
          child = <p>{'not found ' + component}</p>
        }
        return React.createElement(FormItem, {
          ..._.omit(schemaItem, 'component', 'componentProps'),
          key: component + index,
          children: child,
          schemaformValue: schemaformValue
        })
      })
    }
  }, [schema])
  return (
    <div className={`${prefixCls}`}>
      <FormWrapper {..._.omit(props, 'schema')} _type='SchemaForm'>
        {renderSchemaFormItem()}
        {childrenProps}
        {(submit || reset) && (
          <FormItem>
            {submit && <FormSubmit {...submit} />}
            {reset && <FormReset {...reset} />}
          </FormItem>
        )}
      </FormWrapper>
    </div>
  )
}
export default SchemaForm
