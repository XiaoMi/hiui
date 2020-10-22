import React from 'react'
import Counter from './Counter'
import './style/index'
import CounterLegacy from './counter-legacy'

const CounterWrapper = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? CounterLegacy : Counter
  return <WrapperComponent {...props} />
}
CounterWrapper.displayName = 'Counter'
export default CounterWrapper
