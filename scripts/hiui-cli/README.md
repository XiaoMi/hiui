# `@hi-ui/hiui-cli`

面向 AI Agent 的 HiUI 命令行工具，用于查询组件文档与 Props API。设计参考 [@ant-design/cli](https://github.com/ant-design/ant-design-cli)，数据从 HiUI 官方 [llms](https://xiaomi.github.io/hiui/llms/alert.md) 端点拉取。

## 安装

```bash
npm install -g @hi-ui/hiui-cli
# 或在 monorepo 根目录
yarn --cwd scripts/hiui-cli install
```

## 命令

| 命令 | 说明 |
| --- | --- |
| `hiui version` | 查询当前 CLI 版本号（亦支持 `hiui -V` / `hiui --version`） |
| `hiui list` | 列出所有可用组件（来自 [llms.txt](https://xiaomi.github.io/hiui/llms.txt)） |
| `hiui doc <component>` | 获取组件完整 Markdown 文档 |
| `hiui info <component>` | 获取组件 Props 表格（解析自文档） |
| `hiui url <component>` | 输出组件 llms 文档 URL |
| `hiui migrate <from> <to>` | 跨主版本迁移（如 `hiui migrate 4 5`） |

### 全局选项

| 选项 | 说明 | 默认值 |
| --- | --- | --- |
| `--base-url <url>` | 文档站点根地址 | `https://xiaomi.github.io/hiui` |
| `--format text\|json` | 输出格式（Agent 推荐 `json`） | `text` |
| `--timeout <ms>` | HTTP 超时 | `30000` |

也可通过环境变量 `HIUI_DOCS_BASE_URL` 设置文档根地址。

## 使用示例

```bash
# 查询 CLI 版本
hiui version
hiui version --format json
hiui --version

# 列出组件
hiui list
hiui list --format json

# 获取 Alert 完整文档（对应 https://xiaomi.github.io/hiui/llms/alert.md）
hiui doc alert
hiui doc Alert --format json

# 仅获取 Props
hiui info button --format json

# 获取文档 URL
hiui url cascader
```

### V4 升级到 V5

`hiui migrate 4 5` 会在指定目录（默认当前目录）内：

1. 将所有 `package.json` 中的 `@hi-ui/*` 依赖版本更新为 `^5.0.0`（工具包 `@hi-ui/hi-build` 等除外）
2. 将项目文件中的 `.hi-v4` 替换为 `.hi-v5`，并将 `hi-v4-` 类名前缀替换为 `hi-v5-`（覆盖 `[class^='hi-v4-']` 等写法）

```bash
# 预览变更（不写入文件）
hiui migrate 4 5 --dry-run

# 升级当前项目
hiui migrate 4 5

# 升级指定目录
hiui migrate 4 5 --path ./apps/web

# 仅升级 package.json
hiui migrate 4 5 --deps-only

# 仅替换样式类名
hiui migrate 4 5 --class-only
```

升级完成后请执行 `npm install` 或 `yarn` 安装依赖，并参考 [从 V4 升级至 V5](https://xiaomi.github.io/hiui/docs/practices/migration4-5) 处理 API 变更。

### JSON 输出示例

```bash
hiui info alert --format json
```

```json
{
  "component": "alert",
  "url": "https://xiaomi.github.io/hiui/llms/alert.md",
  "description": "作用于页面的内容区域的提示，非触发类信息",
  "props": [
    {
      "name": "Alert",
      "props": [
        {
          "name": "type",
          "description": "警告提示类型",
          "type": "AlertTypeEnum",
          "enum": "\"primary\" | \"warning\"",
          "default": "\"primary\"",
          "required": false
        }
      ]
    }
  ]
}
```

## 程序化调用

```js
const { resolveComponentDoc } = require('@hi-ui/hiui-cli/lib/docs')
const { parsePropsFromMarkdown } = require('@hi-ui/hiui-cli/lib/parse')

async function main() {
  const { markdown } = await resolveComponentDoc('alert')
  const props = parsePropsFromMarkdown(markdown)
  console.log(props)
}
```

## 开发

```bash
cd scripts/hiui-cli
yarn install
node bin/index.js doc alert
node __tests__/parse.test.js
node __tests__/utils.test.js
```

## 与 Ant Design CLI 的对比

| 能力 | `@ant-design/cli` | `@hi-ui/hiui-cli` |
| --- | --- | --- |
| 数据来源 | 内置离线数据 | 在线 llms 端点 |
| `list` / `doc` / `info` | ✅ | ✅ |
| `migrate` (V4→V5) | — | ✅ |
| MCP Server | ✅ (`antd mcp`) | 规划中 |
| `--format json` | ✅ | ✅ |

## 相关链接

- [HiUI LLMs 文档](https://xiaomi.github.io/hiui/llms/alert.md)
- [HiUI llms.txt 索引](https://xiaomi.github.io/hiui/llms.txt)
- [Ant Design CLI 文档](https://ant.design/docs/react/cli)
