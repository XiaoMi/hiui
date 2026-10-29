import { ProCheckSelect as o } from "@hi-ui/schema-fields/bundle";
import { resolveTypicalPageOverlayContainer as i } from "../typical-page-host/index.js";
function n() {
  if (typeof document > "u")
    return null;
  return i() ?? document.body;
}
function l(t) {
  const e = t.overlay ?? {};
  return e.container ? t : {
    ...t,
    overlay: {
      ...e,
      container: n
    }
  };
}
class P extends o {
  getSelfFieldProps(t) {
    const e = super.getSelfFieldProps(t), r = l(e.fieldProps ?? {}), s = r.tagInputProps ?? {};
    return {
      ...e,
      fieldProps: {
        ...r,
        tagInputProps: { wrap: !0, ...s }
      }
    };
  }
}
export {
  P as StableProCheckSelect
};
