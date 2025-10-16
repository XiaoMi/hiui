# @hi-ui/patch-for-react

一个为 React 19 项目提供向后兼容性的补丁包

### 安装

```bash
npm install @hi-ui/patch-for-react
```

### 使用

在项目入口文件直接导入即可：

```typescript
// 在你的 index.tsx 或 main.tsx 顶部添加
import '@hi-ui/patch-for-react'

// 之后就可以正常使用 ReactDOM.render 了
import ReactDOM from 'react-dom'
import App from './App'

// do something
```
