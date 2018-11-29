# 快速上手

HIUI 是一套适用于前中后台的交互界面设计标准与前端解决方案，致力于提供给程序员更加简洁的开发体验。

## 使用方法

> HIUI 不光是面向前端工程师的组件库，更是面向后端工程师的解决方案。
>
> 如果你是「HIUI Template 用户」：官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的基本知识，并对组件化、模板有一定了解；
> 如果你是「前端工程师」：在开始之前，假定你已掌握 React 全家桶的开发方式，并已正确安装和配置了 Node.js v6.5 或以上版本。

### 在项目中配置 HIUI（适用于熟悉 React 开发的工程师）

### 1. 将HIUI添加到项目中

```sh
$ npm install @hi-ui/hiui --save
```

### 2. 使用组件

所有组件均在 `hiui/es` 文件夹下。在需要使用组件的文件中分别引入 `hiui/es` 下对应组件的 css 和 js 文件即可，例如使用 table 组件：

```js
import Table from '@hi-ui/hiui/es/table'
import '@hi-ui/hiui/es/table/style/index.css'
```
