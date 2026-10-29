import { useRequest as p } from "ahooks";
import { useSubscribe as g } from "@hi-ui/use-subscription";
const u = { list: [], total: 0, pageSize: 0, current: 0 };
function h(t) {
  const { subscription: e, request: r } = t, { allDepValues: n } = g(e, ["filters", "sorters", "pagination"]), { filters: i, sorters: s, pagination: a } = n, { data: c, loading: l, runAsync: f, refreshAsync: d } = p(
    async function() {
      const o = r;
      return o ? o({
        pagination: a ?? { current: 1, pageSize: 20 },
        filters: i,
        sorters: s
      }) : u;
    },
    {
      refreshDeps: [i, s, a],
      debounceWait: 200
    }
  );
  return {
    listData: c ?? u,
    isListDataLoading: l,
    getListData: f,
    refreshListData: d
  };
}
function v(t) {
  return Object.entries(t).map(([e, r]) => ({ id: e, value: r }));
}
function m(t) {
  return Array.isArray(t) ? Object.fromEntries(t.map((e) => [e.id, e?.value])) : {};
}
function y(t) {
  const e = String(t.valueType ?? "").toLowerCase();
  if (e.includes("date") || e.includes("time"))
    return null;
  if (e.includes("check") && (e.includes("select") || e.includes("tree")))
    return [];
}
function z(t, e) {
  const r = {};
  e.includeKeyword !== !1 && (r.keyword = "");
  for (const n of t ?? []) {
    const i = n.dataIndex;
    i == null || i === "" || (r[String(i)] = y(n));
  }
  return r;
}
function A(t) {
  const { pagination: e, filters: r, sorters: n } = t;
  return {
    current: e?.current,
    pageSize: e?.pageSize,
    ...r ? m(r) : {},
    sorters: n
    // TODO 待更新
  };
}
export {
  z as buildEmptyFilterFormValues,
  v as toFilters,
  A as toLegacyQueryParams,
  m as toValues,
  h as useFetchList
};
