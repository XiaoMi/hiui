import { jsx as o } from "react/jsx-runtime";
import r from "react";
import { FieldMapProvider as l } from "@hi-ui/schema-fields";
import { ProUpload as c, ProNumber as d, ProRadio as m, ProDate as n, ProSelect as p, ProText as P } from "@hi-ui/schema-fields/bundle";
import { StableProTextArea as f } from "../pro-edit-page/StableProTextArea.js";
import { StableProCheckSelect as u } from "./StableProCheckSelect.js";
const i = {
  text: P,
  select: p,
  date: n,
  radio: m,
  number: d,
  upload: c,
  textarea: f,
  "check-select": u
}, a = r.createContext(
  i
);
function T() {
  return r.useContext(a);
}
function b(e) {
  const t = r.useMemo(
    () => ({ ...i, ...e.fields }),
    [e.fields]
  );
  return /* @__PURE__ */ o(a.Provider, { value: t, children: /* @__PURE__ */ o(l, { fields: t, children: e.children }) });
}
export {
  b as TypicalPageFieldMapProvider,
  i as typicalPageFieldMap,
  T as useTypicalPageFieldMap
};
