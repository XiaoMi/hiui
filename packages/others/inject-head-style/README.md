# `inject-head-style`

> TODO: description

## Usage

```
const injectHeadStyle = require('@hi-ui/inject-head-style');

// TODO: DEMONSTRATE API
```

### 背景介绍：
- 之间组件依赖的都是这个库，但是这个库没有配置 licence，不符合开源协议，该库也不在 hiui 工程中维护，所以也就无法修改和发布 npm，就导致无法继续使用
- 后来就在 hiui 工程中新开发了一个 @hi-ui/style-inject 库，问题是新版本的组件可以使用该库，但是老版本的组件中还是用的 inject-head-style 这个库
- 最后找到了之前发布 inject-head-style 库的作者，将 inject-head-style 库的代码拷贝过来，并修改了 licence，然后发布了一个新版本，也就将改库先维护在 hiui 工程中
