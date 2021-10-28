import React from 'react'
import Form, { FormField } from '../src'
import Input from '@hi-ui/input'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="form-basic__wrap">
        <Form
          initialValues={{ testInput: 'testInput', testInput2: 'testInput2' }}
          validateOnChange
          rules={{
            testInput: [
              {
                name: 'max',
                strategy: 10,
                message: 'max is 10',
              },
            ],
            testInput2: [
              {
                name: 'required',
                strategy: true,
                message: 'testInput2 is required',
              },
            ],
          }}
        >
          <FormField field="testInput">
            <Input />
          </FormField>
          <FormField field="testInput2">
            <Input />
          </FormField>
        </Form>
      </div>
    </>
  )
}
