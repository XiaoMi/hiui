# 为组件添加 classNames 和 styles 语义化功能

本指南基于 Alert 组件的实现，说明如何为其他组件快速添加 `classNames` 和 `styles` 语义化功能。

## 核心概念

语义化功能允许用户通过 `classNames` 和 `styles` 属性对组件的各个子元素进行细粒度的样式控制，支持：
- 对象形式：直接传入类名/样式对象
- 函数形式：根据组件 props 动态返回类名/样式对象
- 全局配置：通过 `GlobalContext` 统一配置所有组件实例

## 实现步骤

### 1. 定义语义化名称类型

在组件文件中，定义组件的语义化元素名称：

```typescript
export type YourComponentSemanticName = 'root' | 'element1' | 'element2' | ...
```

**命名建议**：
- `root`: 根元素
- 其他元素使用语义化名称，如 `icon`、`title`、`content`、`close`、`item` 等
- 参考 Alert 组件：`'root' | 'icon' | 'message' | 'title' | 'content' | 'close'`

### 2. 定义语义化类型

使用 `SemanticClassNamesType` 和 `SemanticStylesType` 定义类型：

```typescript
import type { ComponentSemantic } from '@hi-ui/use-merge-semantic'

export type YourComponentSemantic = ComponentSemantic<YourComponentProps, YourComponentSemanticName>
```

**注意**：
- 将 YourComponentSemantic 添加到第1步代码的下面，不要加空行。

### 3. 在 Props 接口中继承 ComponentSemantic

在组件的 Props 接口中添加：

```typescript
export interface YourComponentProps extends HiBaseHTMLProps<'div'>, YourComponentSemantic {
  // ... 其他 props
}
```

### 4. 在组件中使用 useMergeSemantic

#### 4.1 导入必要的依赖

```typescript
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type { SemanticClassNamesType, SemanticStylesType } from '@hi-ui/use-merge-semantic'
import { useGlobalContext } from '@hi-ui/core'
```

#### 4.2 在组件内部使用

```typescript
export const YourComponent = forwardRef<HTMLDivElement | null, YourComponentProps>(
  (
    {
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      // ... 其他 props
      ...rest
    },
    ref
  ) => {
    // 获取全局配置
    const { yourComponent: yourComponentConfig } = useGlobalContext()
    
    // 合并语义化类名和样式
    const { classNames, styles } = useMergeSemantic<
      YourComponentSemanticClassNames,
      YourComponentSemanticStyles,
      YourComponentProps
    >({
      classNamesList: [yourComponentConfig?.classNames, classNamesProp],
      stylesList: [yourComponentConfig?.styles, stylesProp],
      info: { props: { ...rest, /* 其他需要传递给函数的 props */ } },
    })
    
    // 在元素上应用
    return (
      <div
        ref={ref}
        className={cx(prefixCls, className, classNames?.root)}
        style={{ ...style, ...styles?.root }}
        {...rest}
      >
        {/* 子元素 */}
        <span className={cx(`${prefixCls}__element1`, classNames?.element1)} style={styles?.element1}>
          {/* ... */}
        </span>
      </div>
    )
  }
)
```

**注意事项**：
- `classNamesList` 和 `stylesList` 的顺序：全局配置在前，组件 props 在后，这样组件 props 可以覆盖全局配置
- `info.props` 中应包含函数形式可能需要的所有 props（如 `type`、`size` 等）
- 使用 `cx` 合并类名，使用对象展开合并样式

### 5. 在 GlobalContext 中添加组件配置

```typescript
export type YourComponentComponentConfig = ComponentStyleConfig

export interface ConfigComponentProps {
  // ... 其他组件配置
  yourComponent?: YourComponentComponentConfig
}
```

**注意事项**：

#### 5.2 在组件中使用全局配置

```typescript
const { yourComponent: yourComponentConfig } = useGlobalContext()
```

### 6. 创建示例 Story

参考 `packages/ui/alert/stories/semantic.stories.tsx`，创建一个展示语义化功能的 Story：

```typescript
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import YourComponent from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<YourComponentSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="your-component-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
      <YourComponent
        classNames={{
          root: 'my-component__root',
          element1: 'my-component__element1',
        }}
        styles={{
          [selected as string]: {
            outline: '1px solid #ffbe0a',
          },
        }}
      />
          </Col>
          <Col span={6}>
            <List
              data={[
                {
                  title: 'root',
                  description: '根元素',
                },
                {
                  title: 'element1',
                  description: '元素1',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as any)
                    }}
                    onMouseLeave={() => {
                      setSelected(undefined)
                    }}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
```

## 完整示例参考

### Alert 组件实现要点

1. **类型定义**（第 138-141 行）：
```typescript
export type AlertSemanticName = 'root' | 'icon' | 'message' | 'title' | 'content' | 'close'
export type AlertSemanticClassNames = SemanticClassNamesType<AlertProps, AlertSemanticName>
export type AlertSemanticStyles = SemanticStylesType<AlertProps, AlertSemanticName>
export type AlertSemantic = ComponentSemantic<AlertSemanticClassNames, AlertSemanticStyles>
```

1. **Props 接口继承**（第 143 行）：
```typescript
export interface AlertProps extends HiBaseHTMLProps<'div'>, AlertSemantic {
  // ... 其他 props
}
```

1. **使用 useMergeSemantic**（第 76-84 行）：
```typescript
const { classNames, styles } = useMergeSemantic<
  AlertSemanticClassNames,
  AlertSemanticStyles,
  AlertProps
>({
  classNamesList: [alertConfig?.classNames, classNamesProp],
  stylesList: [alertConfig?.styles, stylesProp],
  info: { props: { ...rest, title, content, type, size } },
})
```

1. **应用在元素上**（第 86-132 行）：
```typescript
<div className={cx(prefixCls, className, classNames?.root)} style={{ ...style, ...styles?.root }}>
  <span className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
    {/* ... */}
  </span>
</div>
```

## 常见问题

### Q: 如何确定需要哪些语义化名称？

A: 分析组件的 DOM 结构，为每个需要独立控制样式的元素定义一个语义化名称。通常包括：
- `root`: 根元素（必需）
- 其他有独立样式需求的子元素

### Q: info.props 中应该包含哪些 props？

A: 包含函数形式可能用到的所有 props，如 `type`、`size`、`disabled` 等状态相关的 props。

### Q: 全局配置和组件 props 的优先级？

A: 组件 props 优先级更高，因为它在 `classNamesList` 和 `stylesList` 中排在后面。

### Q: 函数形式的使用场景？

A: 当需要根据组件的 props（如 `type`、`size`、`disabled` 等）动态返回不同的类名或样式时使用。

## 检查清单

- [ ] 定义了 `YourComponentSemanticName` 类型
- [ ] 定义了 `YourComponentSemanticClassNames` 和 `YourComponentSemanticStyles` 类型
- [ ] 在 Props 接口中继承了 `YourComponentSemantic`
- [ ] 导入了 `useMergeSemantic` 和相关类型
- [ ] 在组件中使用了 `useMergeSemantic` 合并配置
- [ ] 在所有需要控制的元素上应用了 `classNames` 和 `styles`
- [ ] 创建了语义化功能的 Story 示例
