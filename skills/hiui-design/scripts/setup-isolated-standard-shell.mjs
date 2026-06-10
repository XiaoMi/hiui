#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

const root = process.cwd()
const force = process.argv.includes('--force')

const shellTgzPath = path.join(
  root,
  '.local-context',
  'hiui-design',
  'vendor',
  'hiui-design-typical-page-shells-0.1.1.tgz'
)
const outputDocPath = path.join(
  root,
  '.local-context',
  'hiui-design',
  'outputs',
  'CURRENT_PROJECT_ISOLATED_STANDARD_SHELL.md'
)
const subappDir = path.join(root, 'subapps', 'typical-page-shell-runtime')

const peerDeps = {
  '@hi-ui/classname': '5.0.0-experimental.0',
  '@hi-ui/ellipsis-tooltip': '5.0.0-experimental.1',
  '@hi-ui/empty-state': '5.0.0-experimental.1',
  '@hi-ui/hiui': '5.0.0-experimental.6',
  '@hi-ui/loading': '5.0.0-experimental.1',
  '@hi-ui/query-filter': '5.0.0-experimental.2',
  '@hi-ui/schema-core': '4.0.0-experimental.10',
  '@hi-ui/schema-fields': '4.0.0-experimental.12',
  '@hi-ui/schema-form': '4.0.0-experimental.4',
  '@hi-ui/schema-group': '4.0.0-experimental.7',
  '@hi-ui/schema-table': '4.0.0-experimental.4',
  '@hi-ui/textarea': '5.0.0-experimental.3',
  '@hi-ui/use-ref-state': '4.0.0-experimental.2',
  '@hi-ui/use-subscription': '4.0.0-experimental.2',
  ahooks: '3.9.7',
  react: '18.3.1',
  'react-dom': '18.3.1',
}

const files = {
  'package.json': JSON.stringify(
    {
      name: 'typical-page-shell-runtime',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        '@hiui-design/typical-page-shells':
          'file:../../.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.1.tgz',
        ...peerDeps,
      },
      devDependencies: {
        '@vitejs/plugin-react': '4.2.1',
        vite: '4.5.14',
      },
    },
    null,
    2
  ) + '\n',
  '.gitignore': ['node_modules', 'dist'].join('\n') + '\n',
  'index.html': `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Typical Page Shell Runtime</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
  'vite.config.mjs': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
})
`,
  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import '@hiui-design/typical-page-shells/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`,
  'src/App.jsx': `export default function App() {
  return <main className="runtime-root" data-runtime="typical-page-shell" />
}
`,
  'src/styles.css': `html,
body,
#root {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  background: #f5f8fc;
}

.runtime-root {
  min-height: 100%;
  overflow: hidden;
}
`,
  'README.md': `# Typical Page Shell Runtime

这个子应用是当前仓库里**唯一允许直接引入** \`@hiui-design/typical-page-shells\` 的位置。

用途：

- 在 legacy 宿主仓库中，承载需要直接照搬示例页标准壳组件实现的新页面
- 与主仓 \`src/**\` 隔离运行时，避免把 React 18 / ahooks 3 / standard shell 依赖回灌到 legacy remote

约束：

- 不要把 \`@hiui-design/typical-page-shells\` 导回主仓 \`src/**\`
- legacy 宿主只负责跳转到这个子应用 URL、iframe 或新标签页
- 新页面优先按 hiui-design 的 \`table-stat\` / \`table-basic\` / \`full-page-edit\` 等示例页直接生成到本子应用

启动：

\`\`\`bash
cd subapps/typical-page-shell-runtime
pnpm install
pnpm dev
\`\`\`

如果需要在工作台里接入，请先确认接入方式是 URL/iframe/new-tab，而不是把子应用组件直接渲染进当前 legacy React 16 页面树。
`,
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function writeFileIfNeeded(relativePath, content) {
  const absolutePath = path.join(subappDir, relativePath)
  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  const alreadyExists = await exists(absolutePath)
  if (alreadyExists && !force) {
    return { relativePath, status: 'kept' }
  }
  await fs.writeFile(absolutePath, content, 'utf8')
  return { relativePath, status: alreadyExists ? 'overwritten' : 'created' }
}

async function main() {
  if (!(await exists(shellTgzPath))) {
    console.error(`Missing vendored shell package: ${shellTgzPath}`)
    process.exit(1)
  }

  await fs.mkdir(subappDir, { recursive: true })

  const results = []
  for (const [relativePath, content] of Object.entries(files)) {
    results.push(await writeFileIfNeeded(relativePath, content))
  }

  const summary = `# Current Project Isolated Standard Shell

- project root: ${root}
- legacy host mode: legacy-host-compatible
- page delivery strategy: isolated-standard-shell
- subapp dir: ${subappDir}
- vendored shell package: ${shellTgzPath}
- force: ${force ? 'true' : 'false'}

## File results
${results.map((item) => `- ${item.relativePath}: ${item.status}`).join('\n')}

## Next steps
- 在 \`${path.relative(root, subappDir)}\` 内独立安装 React 18 / standard shell 依赖
- 后续需要直接照搬示例页标准壳组件实现的新页面，统一生成到该子应用
- legacy 主仓按钮只负责跳转到独立 URL，不要把标准壳组件导回 \`src/**\`
`

  await fs.mkdir(path.dirname(outputDocPath), { recursive: true })
  await fs.writeFile(outputDocPath, summary, 'utf8')

  console.log(`Isolated standard shell scaffold ready.`)
  console.log(`Subapp dir : ${subappDir}`)
  console.log(`Vendor tgz : ${shellTgzPath}`)
  console.log(`Summary    : ${outputDocPath}`)
  console.log(
    `Files      : ${results.map((item) => `${item.relativePath}=${item.status}`).join(', ')}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
