import { jsx as e, jsxs as b } from "react/jsx-runtime";
import { useRef as C, useState as N, useLayoutEffect as B } from "react";
import E from "@hi-ui/ellipsis-tooltip";
import { PageHeader as L } from "@hi-ui/hiui";
import { ProListPage as S } from "../pro-list-page/ProListPage.js";
import { useProListPageContext as R } from "../pro-list-page/context/entry.js";
import { TypicalPageHeaderPortal as w } from "../typical-page-host/index.js";
import r from "./index.module.scss.js";
import { QueryFilter as M } from "../pro-list-page/bridge/query-filter.js";
import { Table as q } from "../pro-list-page/bridge/table.js";
function F(t) {
  const o = t != null && t !== "" ? String(t) : "—";
  return /* @__PURE__ */ e("div", { className: r.tableCellTextEllipsis, children: /* @__PURE__ */ e(E, { numberOfLines: 1, children: o }) });
}
function I(t) {
  return /* @__PURE__ */ e("div", { className: r.treeTableCellText, children: F(t) });
}
function J({
  title: t,
  extra: o,
  queryFields: g,
  tableFields: T,
  searchPlaceholder: v,
  tableProps: x,
  children: y
}) {
  const { listData: n, isListDataLoading: H } = R(), c = C(null), [m, d] = N(void 0);
  return B(() => {
    const i = c.current;
    if (!i) return;
    const f = () => {
      const a = i.clientHeight;
      if (a <= 0) return;
      const s = i.querySelector(".hi-v5-table");
      if (!s) {
        d(Math.max(120, a - 80));
        return;
      }
      const h = s.querySelector(".hi-v5-table-footer"), P = s.querySelector(".hi-v5-table__wrapper");
      let l = 0;
      const u = P?.firstElementChild;
      u && (l += u.offsetHeight), h && (l += h.offsetHeight), d(Math.max(80, a - l));
    };
    f();
    const p = new ResizeObserver(f);
    return p.observe(i), () => p.disconnect();
  }, [n.list.length, n.total, H]), /* @__PURE__ */ e("div", { className: `pro-table-page ${r.pageRoot}`, children: /* @__PURE__ */ b(S, { queryFields: g, tableFields: T, children: [
    /* @__PURE__ */ e(w, { children: /* @__PURE__ */ e(L, { className: r.pageHeader, title: t, extra: o }) }),
    /* @__PURE__ */ b("div", { className: r.whiteBody, children: [
      /* @__PURE__ */ e("div", { className: r.filterContainer, children: /* @__PURE__ */ e(M, { searchPlaceholder: v }) }),
      /* @__PURE__ */ e("div", { ref: c, className: r.tableContainer, children: /* @__PURE__ */ e(
        q,
        {
          ...m != null ? { maxHeight: m } : {},
          stickyTop: 0,
          size: "md",
          striped: !1,
          ...x
        }
      ) })
    ] }),
    y
  ] }) });
}
export {
  J as TablePageFrame,
  r as proTablePageStyles,
  F as renderTableTextEllipsis,
  I as renderTreeTableTextEllipsis
};
