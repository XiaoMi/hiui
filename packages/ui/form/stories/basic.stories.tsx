import React from 'react'
import Form, { FormField } from '../src'
import Input from '@hi-ui/input'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="form-basic__wrap">
        <Form initialValues={{ testInput: 'testInput' }}>
          <FormField field="testInput">
            <Input />
          </FormField>

          <FormField field="testInput">
            <Input />
          </FormField>
        </Form>
      </div>
    </>
  )
}
