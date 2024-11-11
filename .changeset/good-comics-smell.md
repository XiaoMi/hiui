---
"@hi-ui/scrollbar": patch
"@hi-ui/hiui": patch
---

fix(scrollbar): Scrollbar 组件中去掉 perfect-scrollbar 依赖,因为通过 patch-package 修改了这个库的源码,所以必现将依赖去掉,这样才能将修改的源码打包到 Scrollbar 组件的 lib 中
