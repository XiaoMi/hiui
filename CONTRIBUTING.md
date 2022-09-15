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

### 特性分支

> 特性版本分支，用于当前最新版本特性的开发管理，bugfix 和 feature 都会率先合并到此分支，同时会定期 PR 到 master 完成归档。

- develop

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

- lerna 启动

```sh
yarn bootstrap
```

- 预编译

```sh
yarn build
```

- 开始开发

```sh
yarn storybook
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
yarn lerna add @hi-ui/button --scope=@hi-ui/date-picker
```

- 对指定包执行 npm scripts 相关命令

```sh
yarn lerna run build --scope=@hi-ui/date-picker

yarn lerna run test --scope=@hi-ui/date-picker
```

### 文档生成

```sh
yarn run generate-docs
```

## 发布流程
1. 保证所有修改的分支已合并到 develop 分支
2. 切换到 release 分支，然后 rebase develop 分支
3. 打包组件，执行命令：
```sh
yarn run build
```
4. 执行下面命令进行发布：
```sh
# 步骤1：
yarn run version

# 步骤2：
yarn run publish
```
5. 发布完成后 lerna 会在 release 分支生成版本更新的 commit，需要走一次 PR 将修改合并到 develop 分支
