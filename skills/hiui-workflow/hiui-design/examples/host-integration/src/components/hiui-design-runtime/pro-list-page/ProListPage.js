import { jsx as e } from "react/jsx-runtime";
import { useProps as i } from "./hooks/use-props.js";
import t from "./index.module.scss.js";
import { InnerProvider as n } from "./context/inner.js";
function l(r) {
  const { propsRef: o } = i(r);
  return /* @__PURE__ */ e(n, { value: { propsRef: o }, children: /* @__PURE__ */ e("div", { className: `pro-list-page ${t.pageContainer}`, children: r.children }) });
}
export {
  l as ProListPage
};
