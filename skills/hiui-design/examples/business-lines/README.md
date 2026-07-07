# Business-Line Examples

这里用于存放业务线专属示例页。

## 约定

- `examples/host-integration/`
  仍然是通用模板的参考示例。
- `examples/business-lines/<line-id>/`
  只放该业务线相对通用示例的差异页，不要复制整个通用示例目录。

## 推荐结构

```text
examples/business-lines/
  <line-id>/
    host-integration/
      src/pages/
```

## 使用原则

- 先从通用示例起步
- 只有当业务线在布局、交互、信息结构上存在稳定差异时，才新增业务线示例
- 如果差异只是字段、文案、枚举、接口，不要单独建业务线示例页

## 当前业务线

- `after-sales/`
  售后业务线 overlay，包含工单工作台与售卖管理示例。
- `hr/`
  人力业务线 overlay，包含招聘概览、待招详情、在途详情示例。
