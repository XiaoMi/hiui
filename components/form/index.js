import React, { forwardRef } from 'react'

import FormWrapperLegacy, { Item as ItemLegacy } from './form-legacy/form-v2'

import Form from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import List from './List'
import SchemaForm from './SchemaForm'
import useForm from './hooks/useForm'

import Provider from '../context'
import './style/index'

const VForm = Provider(Form)

const FormWrapper = forwardRef((props, ref) => {
  const { legacy } = props
  const WrapperComponent = legacy ? FormWrapperLegacy : VForm
  return <WrapperComponent {...props} ref={ref} />
})

const VItem = forwardRef((props, ref) => {
  const { legacy } = props
  const WrapperComponent = legacy ? ItemLegacy : Item
  return <WrapperComponent {...props} ref={ref} />
})

FormWrapper.Item = VItem
FormWrapper.Submit = Submit
FormWrapper.Reset = Reset
FormWrapper.List = List
FormWrapper.SchemaForm = SchemaForm
FormWrapper.useForm = useForm

export default FormWrapper
