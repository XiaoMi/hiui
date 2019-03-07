# 快速上手

HIUI 是一套适用于前中后台的交互界面设计标准与前端解决方案，致力于提供给程序员更加简洁的开发体验。

## 使用方法

> HIUI 不光是面向前端工程师的组件库，更是面向后端工程师的解决方案。
>
> 如果你是「HIUI Template 用户」：官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的基本知识，并对组件化、模板有一定了解；
> 如果你是「前端工程师」：在开始之前，假定你已掌握 React 全家桶的开发方式，并已正确安装和配置了 Node.js v6.5 或以上版本。

### 1.新项目

> 我们推荐使用 [create-react-app](https://www.npmjs.com/package/create-react-app) React 官方脚手架进行快速项目搭建
#### 1.1 安装create-react-app

```shell
npm install -g create-react-app
```

#### 1.2 创建 react 应用

> 在终端顺序执行以下命令：

```bash
  create-react-app projectName
  ce projectName
  yarn start
```

![](./static/img/docs/create-react-app.gif)

完毕后，将会自动打开新的标签页 [localhost:3000](localhost:3000)，至此React项目初始化完成

***目录结构***

```html
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── App.css
│   ├── App.js        //主模块
│   ├── App.test.js
│   ├── index.css     //主样式文件
│   ├── index.js      //程序主入口
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```

#### 1.3 安装 HIUI

```sh
cd yourProjectName
npm install @hi-ui/hiui --save
```

```json
// package.json  
"dependencies": {
+   "@hi-ui/hiui": "^1.3.2",
    "react": "^16.8.3",
    "react-dom": "^16.8.3",
    "react-scripts": "2.1.5"
  },
```

修改 src/App.js

```javascript
import React, { Component } from 'react';
import {Button} from '@hi-ui/hiui' //引入所需组件
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        
          {/* 使用组件 */}
          <Button type="primary"  size="large">HIUI 按钮</Button>

          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          
        </header>
      </div>
    );
  }
}

export default App;
```

浏览器将自动刷新，效果如下：

<img src="./static/img/docs/effect.jpg" width="40%"/>

### 2. 在现有项目中使用

**同1.3**

