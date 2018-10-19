import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './view'
import store from './redux/store'
import './style/index.scss'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
