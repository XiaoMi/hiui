# hiui-v4

---

## 开发流程

### 安装依赖

```sh
yarn
```
### 为每个包安装依赖

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

## 常用方法

### 受控非受控模式处理

> packages/hooks/use-uncontrolled-state

### 合并 ref 指向处理

> packages/hooks/use-merge-refs
