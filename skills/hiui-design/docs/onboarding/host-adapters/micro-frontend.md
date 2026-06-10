# 微前端宿主适配片段

## 适用范围

- `qiankun`
- `micro-app`
- `single-spa`

## 默认策略

- 默认使用 `rules-only`
- 保留原有主子应用容器结构
- 优先解决宿主高度链、portal 槽位和包单例

## 最小接法

1. 确保子应用运行时只加载一份 `@hiui-design/typical-page-shells`
2. 在子应用自己的 layout 中提供 header / footer slot
3. 保证容器高度链满足 `flex: 1 1 0%` + `min-height: 0`
4. 再接入真实业务页

## 高风险点

- 包被装出多份导致 host context 分裂
- 子应用容器额外滚动导致双滚动
- 全局样式隔离导致 `styles.css` 不生效

## 推荐 smoke

- 优先先跑全页编辑页
- 如果全页编辑和数据统计页同时异常，先查容器和包单例，不要继续生成业务页
