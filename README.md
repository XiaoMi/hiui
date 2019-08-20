<div align="center">

[![HIUI Logo](https://raw.githubusercontent.com/XiaoMi/hiui/master/site/static/img/logo.png)](https://xiaomi.github.io/hiui/)

<h1 align="center">HIUI</h1>

[![JavaScript Style Guide](https://camo.githubusercontent.com/58fbab8bb63d069c1e4fb3fa37c2899c38ffcd18/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64655f7374796c652d7374616e646172642d627269676874677265656e2e737667)](https://github.com/standard/standard)

[English](https://github.com/XiaoMi/hiui/blob/master/README.md) | [中文](https://github.com/XiaoMi/hiui/blob/master/README-zh.md)

</div>

---

HIUI is a solution that is adequate for the fomulation and implementation of interaction and UI design standard for front, middle and backend .

## Features

- Highly minimize user perception of interaction costs and predictability of interactions
- Build outstanding vitual style and get vitual design and interface specification for typical scenario
- Highly refined design experience in OA, warehousing and after-sales systems, BI systems, and corporate mid-station projects

## Install

```sh
npm install @hi-ui/hiui
```

For components usage, see more at [HIUI Documents](https://xiaomi.github.io/hiui/zh-CN/docs/quick-start).

## Contribute

### Structure

```
.
├── build                   # build command
├── components              # component source
├── docs                    # markdown docs
│   ├── en-US
│   └── zh-CN
├── libs                    # third-party libraries
├── locales                 # i18n config
├── site                    # doc site source
├── CHANGELOG.md
├── commitlint.config.js
├── gulpfile.js
├── LICENSE
├── README-zh.md
├── README.md
├── package.json
└── postcss.config.js
```

### Setup

```sh
# install dependencies
$ npm i

# serve in dev mode, with hot reload at localhost:4200
$ npm start
```

Open http://localhost:4200

### Style Guide

- [BEM](https://en.bem.info/)
- [git-flow (AVH Edition)](https://github.com/petervanderdoes/gitflow-avh)
- [JavaScript Standard Style](https://github.com/standard/standard)

## License

MIT

-- EOF --
