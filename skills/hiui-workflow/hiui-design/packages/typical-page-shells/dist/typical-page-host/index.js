import { jsx as r, Fragment as l } from "react/jsx-runtime";
import { useMemo as s, useContext as P, createContext as i } from "react";
function e({ children: t }) {
  return /* @__PURE__ */ r(l, { children: t });
}
const p = {
  HeaderPortal: e,
  FooterPortal: e
}, n = i(p);
function g({
  children: t,
  headerPortal: o,
  footerPortal: a
}) {
  const c = s(
    () => ({
      HeaderPortal: o ?? e,
      FooterPortal: a ?? e
    }),
    [a, o]
  );
  return /* @__PURE__ */ r(n.Provider, { value: c, children: t });
}
function u() {
  return P(n);
}
function d({ children: t }) {
  const { HeaderPortal: o } = u();
  return /* @__PURE__ */ r(o, { children: t });
}
function m({ children: t }) {
  const { FooterPortal: o } = u();
  return /* @__PURE__ */ r(o, { children: t });
}
export {
  m as TypicalPageFooterPortal,
  d as TypicalPageHeaderPortal,
  g as TypicalPageHostProvider,
  u as useTypicalPageHost
};
