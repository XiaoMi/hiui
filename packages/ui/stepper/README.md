# `@hi-ui/stepper`

> TODO: description

## Usage

```
const Stepper = require('@hi-ui/stepper');

// TODO: DEMONSTRATE API
```

## Props

| 参数       | 说明                            | 类型                      | 可选值                     | 默认值       |
| ---------- | ------------------------------- | ------------------------- | -------------------------- | ------------ |
| type       | 步骤条项节点类型                    | string               | 'default' | 'dot'                        | 'default'            |
| data       | 步骤数据项源                    | StepperItem[]                | -                          | -            |
| current    | 当前步骤位置索引，从 0 开始计数 | number                    | -                          | -            |
| placement  | 水平或垂直展示步骤条            | string                    | 'vertical' \| 'horizontal' | 'horizontal' |
| itemLayout | 步骤项的布局方式                | string                    | 'vertical' \| 'horizontal' | 'horizontal'   |
| onChange   | 点击切换步骤时触发              | (current: number) => void | -                          | -            |

## Type

### StepperItem

| 参数    | 说明                                              | 类型                | 可选值 | 默认值 |
| ------- | ------------------------------------------------- | ------------------- | ------ | ------ |
| title   | 步骤项标题                                        |  ReactNode | -      | -      |
| content | 步骤项内容                                        |  ReactNode | -      | -      |
| icon    | 步骤项 icon |  ReactNode | -      | -      |

## CHANGELOG

| 参数         | 变更类型                        | 变更内容                                                                       | 解决的问题                   |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| type        | deprecated                          | 移除type字段，改为原子化引用 | 建议还是恢复为type形态，这个变更意义不是特别大           |
| icon        | update                          | icon 不再支持 string 模式 | Stepper 组件与 Icon 组件真正解耦          |
