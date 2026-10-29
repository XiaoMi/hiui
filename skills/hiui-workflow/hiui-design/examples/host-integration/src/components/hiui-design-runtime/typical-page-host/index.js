import { jsx as r, Fragment as l } from "react/jsx-runtime";
import { PortalProvider as v } from "@hi-ui/core";
import { useMemo as s, useContext as P, createContext as i, useLayoutEffect as f } from "react";
function e({ children: t }) {
  return /* @__PURE__ */ r(l, { children: t });
}
function y() {
  return null;
}
const p = {
  HeaderPortal: e,
  FooterPortal: e,
  getOverlayContainer: y
}, n = i(p);
let h = [];
function H(t) {
  const o = { resolver: t };
  return h = [...h, o], () => {
    h = h.filter((a) => a !== o);
  };
}
function C() {
  for (let t = h.length - 1; t >= 0; t -= 1) {
    const o = h[t]?.resolver?.();
    if (o)
      return o;
  }
  return null;
}
function g({
  children: t,
  headerPortal: o,
  footerPortal: a,
  getOverlayContainer: c
}) {
  const u = s(() => c ?? y, [c]);
  f(() => H(u), [u]);
  const m = s(
    () => ({
      HeaderPortal: o ?? e,
      FooterPortal: a ?? e,
      getOverlayContainer: u
    }),
    [a, o, u]
  );
  const T = s(
    () => ({
      container: u
    }),
    [u]
  );
  return /* @__PURE__ */ r(v, { portal: T, children: /* @__PURE__ */ r(n.Provider, { value: m, children: t }) });
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
function O() {
  const { getOverlayContainer: t } = u();
  return t();
}
export {
  O as useTypicalPageOverlayContainer,
  m as TypicalPageFooterPortal,
  d as TypicalPageHeaderPortal,
  g as TypicalPageHostProvider,
  C as resolveTypicalPageOverlayContainer,
  u as useTypicalPageHost
};
