import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import Provider from '../context'
import Form from './Form'
import FormItem from './Item'
import * as HIUI from '../'
const prefixCls = 'hi-form-schema'
const FormWrapper = Provider(Form)
const SchemaForm = props => {
  const { schema: schemaProps, children: childrenProps } = props
  const [schema, setSchema] = useState(schemaProps)
  useEffect(() => {
    setSchema(schemaProps)
  }, [schemaProps])
  const renderSchemaFormItem = useCallback(() => {
    if (Array.isArray(schema)) {
      return schema.map(schemaItem => {
        const { component, componentProps } = schemaItem
        let child = null
        if (HIUI[component]) {
          const ChildTag = HIUI[component]
          child = <ChildTag {...componentProps} />
        } else {
          throw new Error('not found ' + component)
        }
        return React.createElement(FormItem, {
          ..._.omit(schemaItem, 'component', 'componentProps'),
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
