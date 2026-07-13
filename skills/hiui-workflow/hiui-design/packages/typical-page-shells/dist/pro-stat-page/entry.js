import { jsx as t, jsxs as C } from "react/jsx-runtime";
import { useRef as P, useState as S, useLayoutEffect as T, useEffect as L } from "react";
import x from "@hi-ui/ellipsis-tooltip";
import { PageHeader as H } from "@hi-ui/hiui";
import { ProListPage as $ } from "../pro-list-page/ProListPage.js";
import { useProListPageContext as B } from "../pro-list-page/context/entry.js";
import { TypicalPageHeaderPortal as O } from "../typical-page-host/index.js";
import i from "./index.module.scss.js";
import { QueryFilter as E } from "../pro-list-page/bridge/query-filter.js";
import { Table as M } from "../pro-list-page/bridge/table.js";
function I(r) {
  const a = r != null && r !== "" ? String(r) : "—";
  return /* @__PURE__ */ t("div", { className: i.tableCellTextEllipsis, children: /* @__PURE__ */ t(x, { numberOfLines: 1, children: a }) });
}
function z(r, a, c) {
  return r <= 0 ? 0 : r * a + (r - 1) * c;
}
function J({
  request: r,
  minCardWidth: a = 100,
  cardGap: c = 12,
  renderCard: p,
  getKey: g
}) {
  const [l, v] = S([]), [d, N] = S(0), u = P(null);
  L(() => {
    r().then((e) => v(e.list)).catch(() => v([]));
  }, [r]), T(() => {
    const e = u.current;
    if (!e) return;
    const s = () => N(Math.round(e.getBoundingClientRect().width));
    s();
    const y = new ResizeObserver(s);
    return y.observe(e), () => y.disconnect();
  }, [l.length]);
  const n = l.length, b = z(n, a, c), o = d === 0 || b <= d, f = o ? n : Math.ceil(n / 2), h = o ? 0 : f * 2 - n, m = {
    gridTemplateColumns: `repeat(${f}, minmax(${a}px, 1fr))`
  };
  return n === 0 ? null : /* @__PURE__ */ C("div", { ref: u, className: i.statCards, style: m, children: [
    l.map(
      (e, s) => p ? /* @__PURE__ */ t("div", { children: p(e) }, g?.(e, s) ?? `${e.title}-${s}`) : /* @__PURE__ */ C("div", { className: i.statCard, children: [
        /* @__PURE__ */ t(x, { className: i.statCardTitle, numberOfLines: 1, children: e.title }),
        /* @__PURE__ */ t("div", { className: i.statCardValue, children: typeof e.value == "number" ? e.value.toLocaleString("zh-CN") : e.value ?? "—" })
      ] }, g?.(e, s) ?? `${e.title}-${s}`)
    ),
    h > 0 && Array.from({ length: h }, (e, s) => /* @__PURE__ */ t("div", { className: i.statCardPlaceholder, "aria-hidden": !0 }, `stat-grid-slot-${s}`))
  ] });
}
function U({
  title: r,
  extra: a,
  queryFields: c,
  tableFields: p,
  searchPlaceholder: g,
  statSection: l,
  tableProps: v
}) {
  const { listData: d, isListDataLoading: N } = B(), u = P(null), [n, b] = S(void 0);
  return T(() => {
    const o = u.current;
    if (!o) return;
    const f = () => {
      const m = o.clientHeight;
      if (m <= 0) return;
      const e = o.querySelector(".hi-v5-table");
      if (!e) {
        b(Math.max(120, m - 80));
        return;
      }
      const s = e.querySelector(".hi-v5-table-footer"), y = e.querySelector(".hi-v5-table__wrapper");
      let R = 0;
      const w = y?.firstElementChild;
      w && (R += w.offsetHeight), s && (R += s.offsetHeight), b(Math.max(80, m - R));
    };
    f();
    const h = new ResizeObserver(f);
    return h.observe(o), () => h.disconnect();
  }, [d.list.length, d.total, N]), /* @__PURE__ */ t("div", { className: `pro-stat-page ${i.statPageRoot}`, children: /* @__PURE__ */ C($, { queryFields: c, tableFields: p, children: [
    /* @__PURE__ */ t(O, { children: /* @__PURE__ */ t(H, { className: i.pageHeader, title: r, extra: a }) }),
    /* @__PURE__ */ C("div", { className: i.whiteBody, children: [
      l ? /* @__PURE__ */ t("div", { className: i.statRow, children: l }) : null,
      /* @__PURE__ */ t("div", { className: i.filterContainer, children: /* @__PURE__ */ t(E, { searchPlaceholder: g }) }),
      /* @__PURE__ */ t("div", { ref: u, className: i.tableContainer, children: /* @__PURE__ */ t(
        M,
        {
          ...n != null ? { maxHeight: n } : {},
          stickyTop: 0,
          size: "md",
          striped: !1,
          ...v
        }
      ) })
    ] })
  ] }) });
}
export {
  U as StatListPageFrame,
  J as StatOverviewGrid,
  i as proStatPageStyles,
  I as renderStatTableTextEllipsis
};
