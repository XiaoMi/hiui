import { jsxs as B, jsx as u, Fragment as S } from "react/jsx-runtime";
import Q, { useState as y, useMemo as C } from "react";
import { useMemoizedFn as V } from "ahooks";
import { Button as q } from "@hi-ui/hiui";
import { ClearOutlined as Y } from "@hi-ui/icons";
import { QueryFilterProvider as E, QueryFilter as j, FilterDrawer as L, FilterButton as z, SearchInput as O } from "@hi-ui/query-filter";
import { useSubscribe as K } from "@hi-ui/use-subscription";
import { matchFieldRenderFn as T } from "@hi-ui/schema-fields";
import { toValues as h, toFilters as g, buildEmptyFilterFormValues as _ } from "../hooks/use-fetch-list.js";
import { useProListPageContext as w } from "../context/entry.js";
import { useInnerContext as P } from "../context/inner.js";
import { useTypicalPageFieldMap as G } from "../../schema-field-map/field-map.js";
function H(e, r) {
  return e.map((t) => {
    const n = t.title, l = t.dataIndex, p = !t.control?.hidden;
    return {
      field: l,
      // 保留 label 给 FilterDrawer 和显式 showLabel 场景复用；典型列表页行内筛选默认隐藏该标签。
      label: n,
      visible: p,
      component: Q.createElement(J, { field: t, fieldMap: r })
    };
  });
}
function J(e) {
  const { field: r, fieldMap: o, ...t } = e, n = r, l = n.renderer?.renderFormItem ?? T({
    name: "QueryFilter",
    field: n,
    fieldMap: o,
    renderKey: "renderFormItem"
  });
  return l ? /* @__PURE__ */ u(S, { children: l(null, {
    field: n,
    // @ts-expect-error 无法获取正确的 formBinding 类型
    formBinding: t,
    rawData: {},
    // @ts-expect-error 此处没有定义 formRef
    formRef: null
  }) }) : null;
}
const N = (e) => e === void 0 || e === "" || e === null || Array.isArray(e) && e.length === 0;
function U() {
  const { subscription: e } = w(), { allDepValues: r } = K(e, ["filters"]), o = r.filters, t = h(o ?? []), n = Object.values(t).filter((l) => !N(l)).length;
  return { formData: t, filteredCount: n };
}
function W() {
  const { propsRef: e } = P(), r = e.current.queryFields, o = G(), t = C(
    () => H(r ?? [], o),
    [r, o]
  ), [n, l] = y({}), { allFields: p, showedFields: f } = C(() => {
    const s = [], m = [];
    for (const i of t) {
      const a = n[i.field] ?? i.visible;
      s.push({ ...i, visible: a }), a && m.push(i);
    }
    return { allFields: s, showedFields: m };
  }, [t, n]), F = V((s) => {
    l((m) => {
      const i = { ...m };
      return s.forEach((a) => {
        i[a.field] = a.visible ?? !0;
      }), i;
    });
  });
  return { allFields: p, showedFields: f, setAllFields: F };
}
function X(e) {
  const { subscription: r } = w(), { allDepValues: o } = K(r, ["filters"]), t = h(o.filters ?? []), n = t.keyword != null && t.keyword !== "" ? String(t.keyword) : "", l = V(
    (p, f) => {
      const F = h(r.getValue().filters ?? []);
      r.mergeValue({
        filters: g({ ...F, keyword: f }),
        pagination: { current: 1 }
      });
    }
  );
  return /* @__PURE__ */ u(O, { placeholder: e.placeholder, value: n, onChange: l });
}
function ue(e) {
  const { subscription: r } = w(), { propsRef: o } = P(), {
    // 典型表格页默认回到 HiUI5 QueryFilter 官方行为：showLabel=false + appearance=contained。
    // 这里需要显式给 contained，避免把 `appearance={undefined}` 传下去时冲掉 QueryFilter 内部默认值。
    appearance: t = "contained",
    showKeywordSearch: n = !0,
    showLabel: l = !1,
    searchPlaceholder: p = "关键词",
    prepend: f,
    ...F
  } = e, { formData: s, filteredCount: m } = U(), { allFields: i, showedFields: a, setAllFields: R } = W(), [x, b] = y(!1), [D, k] = y(0), I = (d) => {
    const v = { ...h(r.getValue().filters ?? []), ...d };
    r.mergeValue({
      filters: g(v),
      pagination: { current: 1 }
    }), e.onChange?.(d);
  }, M = (d, c) => {
    R(c);
    const A = { ...h(r.getValue().filters ?? []), ...d };
    r.mergeValue({
      filters: g(A),
      pagination: { current: 1 }
    });
  };
  return /* @__PURE__ */ B(E, { children: [
    /* @__PURE__ */ u(
      j,
      {
        prepend: f ?? (n ? /* @__PURE__ */ u(X, { placeholder: p }) : void 0),
        append: [
          /* @__PURE__ */ u(z, { count: m, onClick: () => b(!0), children: "全部筛选" }, "all-filter"),
          m > 0 ? /* @__PURE__ */ u(q, { icon: /* @__PURE__ */ u(Y, {}), onClick: () => {
            const d = _(o.current.queryFields, {
              includeKeyword: n && f == null
            });
            r.setValue((c) => ({
              ...c,
              filters: g(d),
              pagination: { ...c.pagination, current: 1 }
            })), k((c) => c + 1), e.onChange?.(d);
          }, children: "清空" }, "clear-filter") : null
        ],
        appearance: t,
        showLabel: l,
        ...F,
        onChange: I,
        formData: s,
        filterFields: a
      }
    ),
    /* @__PURE__ */ u(
      L,
      {
        width: 360,
        visible: x,
        title: "全部筛选",
        formData: s,
        onChange: M,
        filterFields: i,
        onClose: () => b(!1)
      }
    )
  ] }, D);
}
export {
  ue as QueryFilter,
  H as mapFields
};
