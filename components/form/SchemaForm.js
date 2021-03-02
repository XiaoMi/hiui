import React, { useState, useEffect, useCallback, forwardRef } from 'react'
import _ from 'lodash'
import * as HIUI from '../'
import Provider from '../context'
import Form from './Form'
import FormItem from './Item'
import FormReset from './Reset'
import FormSubmit from './Submit'

const Group = {
  'Radio.Group': HIUI.Radio.Group,
  'Checkbox.Group': HIUI.Checkbox.Group
}
const prefixCls = 'hi-form-schema'

const FormComponent = Provider(Form)

const InternalSchemaForm = (props) => {
  const { schema: schemaProps, children: childrenProps, submit, reset, innerRef } = props
  const [schema, setSchema] = useState(schemaProps)
  const [updateIndex, setUpdateIndex] = useState(0)
  const setUpdateIndexFn = useCallback(() => {
    setUpdateIndex(updateIndex + 1)
  }, [updateIndex])

  useEffect(() => {
    setSchema(schemaProps)
  }, [schemaProps, updateIndex])

  const renderSchemaFormItem = useCallback(() => {
    if (Array.isArray(schema)) {
      return schema.map((schemaItem, index) => {
        const { component, componentProps } = schemaItem
        let child = null
        if (HIUI[component] || Group[component]) {
          const ChildComponent = HIUI[component] || Group[component]
          child = <ChildComponent {...componentProps} />
        } else {
          child = component
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
      <FormComponent
        {..._.omit(props, 'schema', 'ref')}
        schemaFormforceUpdate={setUpdateIndexFn}
        ref={innerRef}
        _type="SchemaForm"
      >
        {renderSchemaFormItem()}
        {childrenProps}
        {(submit || reset) && (
          <FormItem>
            {submit && <FormSubmit {...submit} />}
            {reset && <FormReset {...reset} />}
          </FormItem>
        )}
      </FormComponent>
    </div>
  )
}

const SchemaForm = forwardRef((props, ref) => {
  return <InternalSchemaForm {...props} innerRef={ref} />
})
export default SchemaForm
