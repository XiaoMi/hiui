import { jsx as e, jsxs as S } from "react/jsx-runtime";
import { useRef as R, useState as w, useMemo as F, useLayoutEffect as q } from "react";
import { PageHeader as X } from "@hi-ui/hiui";
import { ProListPage as j } from "../pro-list-page/ProListPage.js";
import { useProListPageContext as z } from "../pro-list-page/context/entry.js";
import { TypicalPageHeaderPortal as I } from "../typical-page-host/index.js";
import t from "./index.module.scss.js";
import { QueryFilter as Q } from "../pro-list-page/bridge/query-filter.js";
import { Table as _ } from "../pro-list-page/bridge/table.js";
function $(m, a, f, v) {
  if (!m) return a;
  try {
    const u = localStorage.getItem(m), d = u ? Number(u) : Number.NaN;
    return Number.isFinite(d) ? Math.min(v, Math.max(f, d)) : a;
  } catch {
    return a;
  }
}
function Z({
  title: m,
  extra: a,
  queryFields: f,
  tableFields: v,
  searchPlaceholder: u,
  leftPane: d,
  defaultLeftWidth: C = 200,
  minLeftWidth: g = 120,
  maxLeftWidth: b = 560,
  storageKey: h,
  tableProps: T,
  children: B
}) {
  const { listData: y, isListDataLoading: E } = z(), M = R(null), [x, H] = w(void 0), [n, L] = w(
    () => $(h, C, g, b)
  ), D = F(
    () => (r) => {
      r.preventDefault();
      const p = r.clientX, s = n;
      let o = s;
      const i = (N) => {
        const c = N.clientX - p;
        o = Math.min(b, Math.max(g, s + c)), L(o);
      }, l = () => {
        if (document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", l), !!h)
          try {
            localStorage.setItem(h, String(o));
          } catch {
          }
      };
      document.addEventListener("mousemove", i), document.addEventListener("mouseup", l);
    },
    [n, b, g, h]
  );
  return q(() => {
    const r = M.current;
    if (!r) return;
    const p = () => {
      const o = r.clientHeight;
      if (o <= 0) return;
      const i = r.querySelector(".hi-v5-table");
      if (!i) {
        H(Math.max(120, o - 80));
        return;
      }
      const l = i.querySelector(".hi-v5-table-footer"), N = i.querySelector(".hi-v5-table__wrapper");
      let c = 0;
      const P = N?.firstElementChild;
      P && (c += P.offsetHeight), l && (c += l.offsetHeight), H(Math.max(80, o - c));
    };
    p();
    const s = new ResizeObserver(p);
    return s.observe(r), () => s.disconnect();
  }, [n, y.list.length, y.total, E]), /* @__PURE__ */ e("div", { className: `pro-tree-split-page ${t.pageRoot}`, children: /* @__PURE__ */ S(j, { queryFields: f, tableFields: v, children: [
    /* @__PURE__ */ e(I, { children: /* @__PURE__ */ e(X, { className: t.pageHeader, title: m, extra: a }) }),
    /* @__PURE__ */ e("div", { className: t.whiteBody, children: /* @__PURE__ */ S("div", { className: t.mainSplit, children: [
      /* @__PURE__ */ e("div", { className: t.leftColumn, style: { flex: `0 0 ${n}px`, width: n }, children: d }),
      /* @__PURE__ */ e(
        "div",
        {
          className: t.splitter,
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "拖动调节左侧宽度",
          onMouseDown: D
        }
      ),
      /* @__PURE__ */ S("div", { className: t.rightColumn, children: [
        /* @__PURE__ */ e("div", { className: t.filterContainer, children: /* @__PURE__ */ e(Q, { searchPlaceholder: u }) }),
        /* @__PURE__ */ e("div", { ref: M, className: t.tableContainer, children: /* @__PURE__ */ e(
          _,
          {
            ...x != null ? { maxHeight: x } : {},
            stickyTop: 0,
            size: "md",
            striped: !1,
            ...T
          }
        ) })
      ] })
    ] }) }),
    B
  ] }) });
}
export {
  Z as TreeSplitPageFrame,
  t as proTreeSplitPageStyles
};
