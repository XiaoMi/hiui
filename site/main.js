import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './view'
import store from './redux/store'
import './style/index.scss'
import { ThemeContext } from '../components'
render(
  <Provider store={store}>
    <ThemeContext.Provider value="orange">
      <App />
    </ThemeContext.Provider>
  </Provider>,
  document.getElementById('app')
)
