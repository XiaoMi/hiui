import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Doc from './Doc'
import Home from './Home'
import HomeEn from './Home/en-US'

class Index extends React.Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route strict path='/zh-CN/' component={Doc} />
          <Route strict path='/en-US/' component={Doc} />
          <Route path='/zh-CN' component={Home} />
          <Route path='/en-US' component={HomeEn} />
          <Route component={Home} />
        </Switch>
      </HashRouter>
    )
  }
}

export default Index
