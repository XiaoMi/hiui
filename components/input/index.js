import React from 'react'

import Input from './Input'
import './style/index'
import InputLegacy from './input-legacy'
import Provider from '../context'

const InputWrapper = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? InputLegacy : Provider(Input)
  return <WrapperComponent {...props} />
}

export default InputWrapper

export { Input }
