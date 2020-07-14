import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'

import useFormInstance from './hooks/useFormInstance'
import * as HIUI from '../'
const prefixCls = 'hi-form-schema'

const SchemaForm = props => {
  const { FormWrapper, FormItem } = useFormInstance(props, 'SchemaForm')
  const { schema: schemaProps, children: childrenProps } = props
  const [schema, setSchema] = useState(schemaProps)
  useEffect(() => {
    setSchema(schemaProps)
  }, [schemaProps])
  const renderSchemaFormItem = useCallback(() => {
    if (Array.isArray(schema)) {
      return schema.map((schemaItem,index) => {
        const { component, componentProps } = schemaItem
        let child = null
        if (HIUI[component]) {
          const ChildTag = HIUI[component]
          child = <ChildTag {...componentProps} />
        } else {
          child = <p>{'not found ' + component}</p>
        }
        return React.createElement(FormItem, {
          ..._.omit(schemaItem, 'component', 'componentProps'),
          key: component + index,
          children: child
        })
      })
    }
  }, [schema])
  return (
    <div className={`${prefixCls}`}>
      <FormWrapper {..._.omit(props, 'schema')} _type='SchemaForm'>
        {renderSchemaFormItem()}
        {childrenProps}
      </FormWrapper>
    </div>
  )
}
export default SchemaForm
