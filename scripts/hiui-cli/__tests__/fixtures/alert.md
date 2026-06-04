# Alert 警告提示

作用于页面的内容区域的提示，非触发类信息

## 使用示例

### 基础用法

```tsx
<Alert type="primary" title="信息提示的文案" />
```

## Props

### Alert Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| type | 警告提示类型 | AlertTypeEnum | "primary" \| "warning" | "primary" |
| title *(required)* | 警告提示标题 | ReactNode | - | - |
| closeable | 是否可关闭 | boolean | true \| false | true |
