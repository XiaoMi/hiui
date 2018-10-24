import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'hiui/es/icon'
import 'hiui/es/icon/style/index.css'
import Layout, {Login, BreadCrumb } from '@hi-ui/genuine-theme'

import Home from './views/Home'
import Other from './views/Other'

class App extends Component {
  render () {
    return (
      <div>
        <Layout
          sider={{
            items: [
              {key: 1, title: '首页', to: '/', icon: <Icon name='user' />},
              {
                key: 2,
                title: '表单',
                to: '',
                icon: <Icon name='usergroup' />,
                children: [
                  {key: 21, title: '首页', to: '/home'},
                  {key: 22, title: '其它', to: '/other'}
                ]
              }
            ],
            top: <a href='#'>HIUI</a>
          }}
          header={(
            <React.Fragment>
              <BreadCrumb
                style={{float: 'left'}}
                {...{
                  items: [
                    {title: '首页', to: '/'},
                    {title: '其他页面s', to: ''}
                  ],
                  sign: '/'
                }}
              />
              <Login {...{
                headUrl: 'your_image_linking',
                name: '叶静静',
                children: <div style={{width: '100px'}}>这里是登录信息</div>
              }} />

            </React.Fragment>
          )}
          theme={{
            type: 'inner',
            color: 'dark'
          }}
          routes={[
            {
              path: '/home',
              exact: true,
              component: Home
            },
            {
              path: '/other',
              exact: true,
              component: Other
            }
          ]}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
