import { jsx as r, jsxs as t } from "react/jsx-runtime";
import { useRef as d } from "react";
import { Loading as p } from "@hi-ui/loading";
import { useProps as n } from "./hooks/use-props.js";
import a from "./index.module.scss.js";
import { useProDetailPageContext as l } from "./context/entry.js";
import { InnerProvider as m } from "./context/inner.js";
function h(e) {
  const c = d(null), { propsRef: o } = n(e), { loading: i } = l();
  return /* @__PURE__ */ r(m, { value: { propsRef: o }, children: /* @__PURE__ */ r("div", { className: `pro-detail-page ${a.pageContainer}`, children: /* @__PURE__ */ t("div", { ref: c, style: { position: "relative", minHeight: "100%" }, children: [
    e.children,
    /* @__PURE__ */ r(p, { visible: i, part: !0, container: c.current, style: { height: "100%" } })
  ] }) }) });
}
export {
  h as ProDetailPage
};
