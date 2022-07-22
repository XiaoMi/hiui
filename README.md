# hiui-v4

---

## 开发流程

### 安装依赖

```sh
yarn
```

### lerna bootstrap

```sh
yarn bootstrap
```

### 预编译

```sh
yarn build
```

### 开始开发

```sh
yarn storybook
```

## 发布

```sh
yarn run publish:pkg
```

### 创建模板

1. 创建组件

> 注意采用小写中划线命名规范

```sh
yarn create:pkg ui `component-name`
```

2. 创建通用工具函数

> 注意采用小写中划线命名规范

```sh
yarn create:pkg util `util-name`
```

3. 创建自定义 hooks

> 注意采用小写中划线命名规范

```sh
yarn create:pkg hook `hook-name`
```

---

## lerna 常用命令集

1. 给指定包添加依赖包

```sh
yarn lerna add @hi-ui/button --scope=@hi-ui/date-picker
```

2. 对指定包执行 build 等命令

```sh
yarn lerna run build --scope=@hi-ui/date-picker

yarn lerna run test --scope=@hi-ui/date-picker
```

---

## 通用方法

### hooks

> packages/hooks

### utils

> packages/utils

## 文档生成

```sh
yarn lerna run test --scope=@hi-ui/hi-docs
```
