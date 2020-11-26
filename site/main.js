import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './view'
import store from './redux/store'
import './style/index.scss'
import { LocaleContext } from '../components/context'
render(
  <Provider store={store}>
    <LocaleContext.Provider value="en-US">
      <App />
    </LocaleContext.Provider>
  </Provider>,
  document.getElementById('app')
)
