<div align="center">

[![HiUI Logo](https://raw.githubusercontent.com/XiaoMi/hiui/stable/3.x/site/static/img/logo.png)](https://xiaomi.github.io/hiui/)

<h1 align="center">HiUI</h1>

![JavaScript Style Guide](https://avatars.githubusercontent.com/u/29208316?s=48&v=4)

</div>

---
|简体中文|[ENGLISH](README.EN.md)|
---

HiUI 是一个面向中后台系统的前端组件库，可以帮助开发人员快速实现交互一致、界面美观的界面开发。

## 特性

- 精于中后台产品的交互与视觉设计
- 全面的流程、数据展示模板，从业务中来，模板、组件覆盖大多数中后台系统需求
- 数据结构分离的单组件设计，无需学习，升级方便，开箱即用

## 安装

现在从 `npm` 安装并引入 `HiUI`。

### 全量安装

```bash
npm config set registry https://registry.npmjs.org

npm install @hi-ui/core @hi-ui/hiui
```

### 按需安装

```bash
npm config set registry https://registry.npmjs.org

npm install @hi-ui/core @hi-ui/组件名
```

> 注意：组件名请全部小写，并使用中横线连接。

## 使用

组件使用详见[官方文档](https://xiaomi.github.io/hiui/docs/quick-start)。

## 贡献

HiUI 贡献详见[贡献指南](https://github.com/XiaoMi/hiui/blob/master/CONTRIBUTING.md)。

## License

MIT

-- EOF --


“每次代码变更都有可能影响到其他模块，造成潜在的风险”，如何更好的表述这句话：
1. 每次修改都可能会对别的地方产生风险
2. 任何一次改动，都会有可能导致其它部分出现问题
3. 一个小小的变动，就可能导致整个项目崩溃
4. 一丁点的小错误，就会让全局陷入混乱
5. 一点微不足道的变化，就能引发一场灾难
6. 一个小问题，就可以使一切变得一团糟
7. 一点点改变，足以颠覆所有
