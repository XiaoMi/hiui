import { jsx as g } from "react/jsx-runtime";
import { SchemaTable as b } from "@hi-ui/schema-table";
import { useSubscribe as C } from "@hi-ui/use-subscription";
import { cx as P } from "@hi-ui/classname";
import x from "@hi-ui/empty-state";
import { useProListPageContext as z } from "../context/entry.js";
import { useInnerContext as S } from "../context/inner.js";
function N(t) {
  const { subscription: i, listData: o, isListDataLoading: m } = z(), { propsRef: c } = S(), { tableFields: n = [] } = c.current, { allDepValues: f } = C(i, ["filters", "pagination"]), s = f.pagination, p = (e, a, l) => {
    i.mergeValue({ pagination: { current: e, pageSize: l } }), t.paginationProps?.onChange?.(e, a, l);
  }, d = (e, a) => {
    i.mergeValue({ pagination: { current: a, pageSize: e } }), t.paginationProps?.onPageSizeChange?.(e, a);
  }, u = P("pro-list-page__table", t.className), r = o.total ?? 0, h = r > 0;
  return /* @__PURE__ */ g(
    b,
    {
      fields: n,
      dataSource: o.list,
      className: u,
      tableProps: {
        fieldKey: "id",
        setting: !0,
        loading: m,
        fixedToColumn: {
          // TODO 此处还有优化空间
          left: n.filter((e) => e.control?.fixed === "left").map((e) => e.dataIndex).slice(-1)[0],
          right: n.filter((e) => e.control?.fixed === "right").map((e) => e.dataIndex).slice(-1)[0]
        },
        sticky: !0,
        bordered: !1,
        ...t,
        /** 与典型页表格行高基线一致：列表默认中号 */
        size: t.size ?? "md",
        /** 默认 true；置于 `...props` 之后以便单页 `resizable={false}` 覆盖 */
        resizable: t.resizable !== !1,
        /**
         * 空数据：`@hi-ui/table` 用 `pagination={false}` 整块不渲染底部分页（见 `Table.js` · `hiddenPagination`）。
         * 总条数 0 时仍传对象会出现「共 0 条」等，与产品约定不符。
         */
        pagination: h ? {
          showTotal: !0,
          showJumper: !0,
          pageSizeOptions: [20, 50, 100, 200],
          ...t.paginationProps,
          total: r,
          current: s.current,
          pageSize: s.pageSize,
          onChange: p,
          onPageSizeChange: d
        } : !1,
        /**
         * 与 HiUI 文档「基础用法」一致：`<EmptyState />` 使用默认灰阶线稿资源（`icons/default`）。
         * **禁止**表格空状态使用 `@hi-ui/empty-state` 的 `*_COLORFUL` 插图（见 `empty-state.mdx` · 彩色图标）。
         */
        emptyContent: t.emptyContent ?? /* @__PURE__ */ g(x, {})
      }
    }
  );
}
export {
  N as Table
};
