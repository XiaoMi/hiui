import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef
} from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'
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
  // 渲染Form表单schema内容
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
  // const renderSchemaFormChild = useCallback(() => {
  //   return React.Children.map(childrenProps, child => {
  //     const {
  //       props: { children }
  //     } = child
  //     return Array.isArray(children) || !React.isValidElement(children)
  //       ? children
  //       : React.createElement(FormItem, {
  //           type: 'SchemaForm',
  //           children
  //         })
  //   })
  // }, [childrenProps])
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
