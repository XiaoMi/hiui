# Manifest Layers

当前团队版只保留通用页型事实源：

- `../docs/generation/page-types.manifest.json`

`manifests/` 目录保留为后续扩展入口，但当前公开主包不内置业务线 overlay。若后续确实需要项目或业务线私有扩展，建议在本地维护最小覆盖层，不要把差异规则重新堆回通用 manifest。
