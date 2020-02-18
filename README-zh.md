<div align="center">

[![HIUI Logo](https://raw.githubusercontent.com/XiaoMi/hiui/master/site/static/img/logo.png)](https://xiaomi.github.io/hiui/)

<h1 align="center">HIUI</h1>

[![JavaScript Style Guide](https://camo.githubusercontent.com/58fbab8bb63d069c1e4fb3fa37c2899c38ffcd18/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64655f7374796c652d7374616e646172642d627269676874677265656e2e737667)](https://github.com/standard/standard)

[English](https://github.com/XiaoMi/hiui/blob/master/README.md) | [中文](https://github.com/XiaoMi/hiui/blob/master/README-zh.md)

</div>

---

HIUI 是一个面向中后台系统的前端组件库，可以帮助开发人员快速实现交互一致、界面美观的界面开发。

## 特性

- 精于中后台产品的交互与视觉设计
- 全面的流程、数据展示模板，从业务中来，模板、组件覆盖大多数中后台系统需求
- 数据结构分离的单组件设计，无需学习，升级方便，开箱即用

## 安装

```sh
npm install @hi-ui/hiui
```

组件使用详见[官方文档](https://xiaomi.github.io/hiui/zh-CN/docs/quick-start)。

## 贡献

### 项目结构

```
.
├── build                   # 构建命令
├── components              # 组件
├── docs                    # 使用文档
│   ├── en-US
│   └── zh-CN
├── libs                    # 第三方依赖
├── locales                 # 语言配置
├── site                    # 文档页模板
├── CHANGELOG.md
├── commitlint.config.js    # Commit 检查
├── gulpfile.js             # 构建配置项
├── LICENSE
├── README-zh.md
├── README.md
├── package.json
└── postcss.config.js
```

### 配置环境

```sh
# 安装依赖
$ npm i

# 开启本地开发环境 localhost:4200
$ npm start
```

打开 http://localhost:4200

### 单元测试

```sh
# require node version >= 10

$ npm run jest:coverage
```

#### 添加展示/文档模块

1. 在 `components/index.js` 下添加 `export { default as XXX } from './XXX'`
2. 在 `docs/${lang}/` 下分别添加中英文文档
3. 在 `locales/${lang}` 下添加组件对应的名字用于左侧导航显示
4. 在 `pages/` 添加对应的组件，在 `pages/index` 下面引入对应的组件

> 注：`pages/index`下组件的关键字必须与 `locales` 下组件的关键字一致，关键字命名与`components` 下面文件夹命名相同即可

### 开发流程

- 文件夹命名：所有**文件夹**均为**小写命名**，多个单词则中间加 `-`，例如 date-picker、page
- 文件命名：文件命名组件名每个首字母大写，例如 DatePicker、Page，非组件的功能性文件均使用小写，多个单词用 `-` 连接
- class 命名：组件所有的样式放在 `components/**/style` 下，class 命名使用 BEM 命名---`Block__Element--Modifier`
- 对外 API 命名：组件**对外暴露 API**使用驼峰命名

### 规范

- [BEM](https://en.bem.info/)
- [git-flow (AVH Edition)](https://github.com/petervanderdoes/gitflow-avh)
- [JavaScript Standard Style](https://github.com/standard/standard)

## License

MIT

-- EOF --
