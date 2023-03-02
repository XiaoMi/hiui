# 贡献指南

很高兴您有兴趣为 HiUI 做出贡献。

在提交您的贡献之前，请务必花点时间阅读以下指南：

## 分支管理

### 稳定分支

> 正式版本分支。其中 master 为最新稳定发布版本，stable/xx 为最新历史大版本稳定分支。

- master
- stable/3.x
- stable/2.x
- stable/1.x

## Bug & feature

> 我们使用 [Github issues](https://github.com/XiaoMi/hiui/issues) 来追踪 bug 和 feature。

为了更快地反馈和解决问题，我们推荐您通过组件页面的 **Feedback 按钮**一键直达对应组件的 Issue 反馈入口；

同时也可以直接在 HiUI github 首页通过我们提供的 Issue 模板来编写。

## Pull Request

> HiUI 团队会认真对待每一个 PR，我们会 CR 您的代码，然后再决定合并。期间也有可能会同您进行一些代码上的探讨和优化。

要提交一个 PR，请遵循以下步骤：

1. Fork 并克隆 HiUI 仓库

```bash
git clone https://github.com/<github-username>/hiui.git
cd hiui
```

2. 新建开发分支

```bash
git checkout -b <BRANCH_NAME>
```

> 分支名建议是 hotfix/#<IssueId> 或者 feature/#<IssueId>

## 开发流程

> 安装环境前确保本地有 `yarn` 依赖的 NodeJS 环境，并且 Node 版本建议是 14.x。

- 安装依赖

```sh
yarn
```

- 预编译

```sh
yarn build
```

- 开始开发

```sh
yarn storybook
```

- 生成变更记录文件（有组件代码修改时，需要记录变更）

```sh
yarn cs
```

## 辅助工具

### 模板创建

- 创建组件

> 注意采用小写中划线命名规范

```sh
yarn create:pkg ui `component-name`
```

- 创建通用工具函数

> 注意采用小写中划线命名规范

```sh
yarn create:pkg util `util-name`
```

- 创建自定义 hooks

> 注意采用小写中划线命名规范

```sh
yarn create:pkg hook `hook-name`
```

## 通用方法

### hooks

> packages/hooks

### utils

> packages/utils

### 包管理

- 给指定包添加依赖包

```sh
yarn workspace @hi-ui/hiui add @hi-ui/button
```

- 对指定包执行 npm scripts 相关命令

```sh
yarn turbo run build --filter @hi-ui/date-picker

yarn turbo run test --filter @hi-ui/date-picker
```

### 文档生成

```sh
yarn run generate-docs
```

### 发布流程
基于 GitHub Action 自动完成 CI/CD <br>
1. 修改版本号和 changelog   
   操作：Actions -> Version -> Run workflow
2. 自动构建和发版  
   第1步操作完后会自动生成一个发版的 Pull Request，项目 owner 合并后会自动执行 Release 任务，进行代码构建和发布到 npm
