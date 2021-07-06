---
to: <%= h.hooksDir(`${name}/package.json`) %>
---
{
  "name": "@hi-ui/<%= name %>",
  "version": "1.0.0",
  "description": "A sub-package for @hi-ui/hooks.",
  "keywords": [],
  "author": "HIUI <mi-hiui@xiaomi.com>",
  "homepage": "https://github.com/XiaoMi/hiui/tree/master/packages/hooks/<%= name %>#readme",
  "license": "MIT",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "main": "lib/cjs/index.js",
  "module": "lib/esm/index.js",
  "types": "lib/types/index.d.ts",
  "typings": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "require": "./lib/cjs/index.js",
      "default": "./lib/esm/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/XiaoMi/hiui.git"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1",
    "clean": "rimraf lib",
    "prebuild": "yarn clean",
    "build:esm": "hi-build ./src/index.ts --format esm -d ./lib/esm",
    "build:cjs": "hi-build ./src/index.ts --format cjs -d ./lib/cjs",
    "build:types": "tsc --emitDeclarationOnly --declaration --declarationDir lib/types",
    "build": "concurrently yarn:build:*"
  },
  "bugs": {
    "url": "https://github.com/XiaoMi/hiui/issues"
  },
  "devDependencies": {
    "@hi-ui/hi-build": "^1.0.0"
  }
}
