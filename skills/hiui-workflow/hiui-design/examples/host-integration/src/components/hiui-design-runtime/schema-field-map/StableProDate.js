import { ProDate as o } from "@hi-ui/schema-fields/bundle";
import { resolveTypicalPageOverlayContainer as t } from "../typical-page-host/index.js";
function r() {
  if (typeof document > "u")
    return null;
  return t() ?? document.body;
}
function e(i) {
  const n = i.overlay ?? {};
  return n.container ? i : {
    ...i,
    overlay: {
      ...n,
      container: r
    }
  };
}
class c extends o {
  getFieldProps(i, n) {
    return super.getFieldProps(e(i ?? {}), n);
  }
}
export {
  c as StableProDate
};
