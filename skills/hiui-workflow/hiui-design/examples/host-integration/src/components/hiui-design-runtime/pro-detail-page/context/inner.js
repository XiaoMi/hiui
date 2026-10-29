import { jsx as r } from "react/jsx-runtime";
import n from "react";
const t = n.createContext(null);
function c(e) {
  return /* @__PURE__ */ r(t.Provider, { value: e.value, children: e.children });
}
export {
  c as InnerProvider
};
