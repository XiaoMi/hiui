import { jsx as r } from "react/jsx-runtime";
import { Loading as t } from "@hi-ui/loading";
import { useProps as n } from "./hooks/use-props.js";
import a from "./index.module.scss.js";
import { useProDetailPageContext as l } from "./context/entry.js";
import { InnerProvider as m } from "./context/inner.js";
function h(e) {
  const { propsRef: o } = n(e), { loading: i } = l();
  return /* @__PURE__ */ r(m, { value: { propsRef: o }, children: /* @__PURE__ */ r("div", { className: `pro-detail-page ${a.pageContainer}`, children: /* @__PURE__ */ r(t, { visible: i, style: { height: "100%" }, children: e.children }) }) });
}
export {
  h as ProDetailPage
};
