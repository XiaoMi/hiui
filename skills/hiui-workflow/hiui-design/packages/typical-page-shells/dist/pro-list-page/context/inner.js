import { jsx as r } from "react/jsx-runtime";
import n from "react";
const t = n.createContext(null);
function i(e) {
  return /* @__PURE__ */ r(t.Provider, { value: e.value, children: e.children });
}
function c() {
  const e = n.useContext(t);
  if (!e)
    throw new Error("useInnerContext must be used within a ProListPage.useInnerContext");
  return e;
}
export {
  i as InnerProvider,
  c as useInnerContext
};
