# Public Runtime Release Checklist

这份清单只覆盖一件事：当 `@hiui-design/typical-page-shells` 版本发生变化时，维护者如何按固定顺序完成开源分发与公开 npm 发布前检查。

唯一规则来源仍然是：

- `rules/runtime-delivery-policy.json`
- `vendor/typical-page-shells-package.json`
- `scripts/check-public-runtime-publish-readiness.mjs`
- `scripts/verify-public-runtime-release.mjs`
- `docs/onboarding/distribution-governance.md`

## 适用场景

只在以下情况执行这份清单：

- `vendor/typical-page-shells-package.json` 的 `version` 变化
- `vendor/typical-page-shells-package.json.runtimeDelivery.vendoredTarball` 指向的新 tgz 已更新
- `packages/typical-page-shells/package.json` 的公开版本准备对外发布
- `sync-open-source-package.mjs` 生成的开源包 diff 涉及 `packages/typical-page-shells/**`

若只是普通规则、模板、文档或脚本变更，而 `typical-page-shells` 版本没有变化，不需要额外走这条清单。

## 固定顺序

1. 在 maintainer source 确认壳包 snapshot 已刷新。

```bash
node scripts/sync-shell-package-snapshot.mjs
```

成功信号：

- `vendor/typical-page-shells-package.json` 已更新到目标版本
- `vendor/hiui-design-typical-page-shells-<version>.tgz` 已刷新

2. 生成或刷新开源分发表达。

```bash
node scripts/sync-open-source-package.mjs --target <open-source-package-root>
```

成功信号：

- 开源仓已生成 `packages/typical-page-shells/package.json`
- 开源仓已同步 vendored `*.tgz` 与 `vendor/typical-page-shells-package.json`

3. 在真正执行 `npm publish` 前，先执行公开包发布前就绪检查。

```bash
node scripts/check-public-runtime-publish-readiness.mjs \
  --source-root <maintainer-or-global-root> \
  --public-root <open-source-package-root>
```

这一步必须同时验证：

- vendor snapshot 存在
- vendored tgz 存在
- 开源仓 `packages/typical-page-shells/package.json` 存在
- snapshot 版本与公开包版本一致
- `npm pack --dry-run` 通过
- `npm publish --dry-run --access public` 通过

4. 确认当前机器已经登录公开 npm。

```bash
npm_config_registry=https://registry.npmjs.org npm whoami
```

若返回 `ENEEDAUTH`，先执行：

```bash
npm adduser --registry https://registry.npmjs.org
```

5. 执行真正的公开 npm 发布。

```bash
cd packages/typical-page-shells
npm_config_registry=https://registry.npmjs.org npm publish --access public
```

6. 发布完成后，再执行公开运行时发布后验证。

```bash
node scripts/verify-public-runtime-release.mjs \
  --source-root <maintainer-or-global-root> \
  --public-root <open-source-package-root>
```

这一步必须同时验证：

- vendor snapshot 存在
- vendored tgz 存在
- 开源仓 `packages/typical-page-shells/package.json` 存在
- snapshot 版本与公开包版本一致
- npm registry 已存在 exact version
- `npm pack --dry-run` 通过

7. 只有第 6 步通过后，才允许把开源 bootstrap / doctor 默认依赖理解成“公开 npm 可安装”。

禁止做法：

- 不要因为开源仓已经生成了 `packages/typical-page-shells/**`，就默认认为 npm 上一定可安装
- 不要在 team / project / runtime-mirror 链路里删掉 vendored tgz 后继续依赖 registry 兜底
- 不要跳过 `check-public-runtime-publish-readiness.mjs` 就直接执行真实 `npm publish`
- 不要跳过 `verify-public-runtime-release.mjs` 就把“开源仓说明”写成“公开 npm 已可安装”

8. 若还需要更新维护者对外发布物，再继续走既有 release 链。

```bash
node scripts/release-skill-archive.mjs
```

## 失败处理

若第 3 步失败，优先按下面顺序处理：

1. 先看 `vendor/typical-page-shells-package.json` 和 `packages/typical-page-shells/package.json` 的版本是否一致。
2. 再看 vendored tgz 是否真的刷新到了同一版本。
3. 若 `npm pack --dry-run` 或 `npm publish --dry-run` 失败，先修公开包结构，再重新执行门禁。

若第 4 步失败，说明这台机器还没有登录公开 npm，先完成 `npm adduser` 或配置可用 token。

若第 6 步失败，优先按下面顺序处理：

1. 先确认第 5 步是否真的把 exact version 发布到了 `https://registry.npmjs.org`。
2. 再看 `vendor/typical-page-shells-package.json` 和 `packages/typical-page-shells/package.json` 的版本是否一致。
3. 再确认 npm registry 返回的是 exact version，而不是近似版本或旧版本缓存。

在第 6 步通过前，不要把依赖声明切到 registry，也不要把“公开可安装”写进文档或发布说明。
