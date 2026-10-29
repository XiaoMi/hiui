import { jsx as f } from "react/jsx-runtime";
import e, { useRef as l } from "react";
import { useLoadDetail as g } from "../hooks/use-detail-load.js";
import { useSubmitAction as x } from "../hooks/use-submit-action.js";
import { useStashAction as h } from "../hooks/use-stash-action.js";
const r = e.createContext(
  null
);
function v(t) {
  const o = l(null), { children: i, submitRequest: s, stashRequest: n, detailRequest: u } = t, { submitAsync: a, submitLoading: c } = x({ submitRequest: s }), { stashAsync: d, stashLoading: m } = h({ stashRequest: n }), { detailLoading: P } = g({ detailRequest: u, formRef: o });
  return /* @__PURE__ */ f(
    r.Provider,
    {
      value: {
        formRef: o,
        loading: {
          submitLoading: c,
          stashLoading: m,
          detailLoading: P
        },
        submitAsync: a,
        stashAsync: d
      },
      children: i
    }
  );
}
function A() {
  const t = e.useContext(r);
  if (!t)
    throw new Error("useProEditPageContext must be used within a ProEditPageProvider");
  return t;
}
export {
  v as ProEditPageProvider,
  A as useProEditPageContext
};
