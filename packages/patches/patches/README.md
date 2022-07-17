# @hi-ui/patches

## v4

提供 v3 适配 v4 UI 视觉的样式补丁方案。

### 安装

```bash
npm install @hi-ui/patches
```

### 使用

在项目入口文件 App.js 导入即可。

```js
import "@hi-ui/patches/lib/v4/index.scss";
```

如果需要指定补丁作用域，可以采用 scss 提供的 `@include` 进行混入。

```scss
// app.scss
@import '@hi-ui/patches/lib/v4/mixin.scss';

// 因为弹出层默认会挂载到 body 下，不建议指定其它容器下
// 这里建议自行设置 body 类名进行作用域注入
body {
  @include patch-v4();
}
```

最终在 App.js 中引入该样式文件即可。

```js
import "./app.scss";
```
