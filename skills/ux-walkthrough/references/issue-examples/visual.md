# 样式问题示例

> 按需读取 checklist 中 `related_examples` 指向的锚点，**禁止通读本文件**。

## info-hierarchy

### [P1] 信息层级混乱 — 标题与正文无主次

**checklist**：UX-1.2  
**报告分类**：样式问题

**位置**：截图 `order-detail.png` → 页面顶部

**问题描述**：标题「订单详情」与副标题「订单号：ORD-xxx」字号、颜色相同。

**设计理由**：视觉层级是信息架构的直接体现。

**改进方案**：
- 标题：20px/600/#1a1a1a；副标题：14px/400/#666，margin-top 8px

## table-too-many-columns

### [P1] 信息密度过高 — 表格列数过多

**checklist**：UX-1.2（边界见 ignore-list §1）  
**报告分类**：样式问题

**位置**：`src/components/DataTable.tsx` → 订单列表

**问题描述**：12 列平铺，横向滚动，关键信息难定位。

**设计理由**：米勒定律——应区分必展列与可展开列；>9 列仍视为问题。

**改进方案**：
- 核心 6 列 + 其余进详情展开

## color-semantics

### [P1] 色彩语义不一致 — 同色不同义

**checklist**：UX-2.5、UX-3.1  
**报告分类**：样式问题

**位置**：全局色彩系统

**问题描述**：蓝色分别表示进行中、可点击、已选中；红色既表错误又表删除。

**设计理由**：功能色语义应全局统一。

**改进方案**：
- Primary #1677ff；danger/error #ff4d4f；建立 Design Token

## tabular-nums

### [P2] 数字未使用等宽字体 — 列数据对不齐

**checklist**：UX-1.7  
**报告分类**：样式问题

**位置**：数据表格 / 统计卡片

**问题描述**：金额列用比例字体，纵向无法对齐比较。

**改进方案**：
- `font-variant-numeric: tabular-nums` 或等宽字体

## spacing-inconsistent

### [P2] 间距无规律 — 元素间距不统一

**checklist**：UX-3.1  
**报告分类**：样式问题

**位置**：`src/pages/dashboard/index.css`

**问题描述**：间距混用 10/12/15/16px，无体系。

**改进方案**：
- 统一 8px 倍数：gap 16px，padding 24px

## image-display

### [P2] 图片显示异常 — 变形 / 模糊 / 裂图

**checklist**：UX-3.1  
**报告分类**：样式问题

**位置**：列表卡片 / 详情页 / 头像

**问题描述**：图片拉伸变形；高分屏发虚；加载失败裂图。

**改进方案**：
- `aspect-ratio` + `object-fit: cover`；2x/SVG；`onerror` 占位图

## logo-usage

### [P2] Logo 使用不规范 — 未遵循品牌标准

**checklist**：UX-3.1  
**报告分类**：样式问题

**位置**：Header / Footer / 关于页等

**问题描述**：Logo 改色、拉伸、旋转、加阴影，或未留安全空间。

**改进方案**：
- 仅用品牌标准 SVG/PNG；禁止二次加工；保留安全留白
