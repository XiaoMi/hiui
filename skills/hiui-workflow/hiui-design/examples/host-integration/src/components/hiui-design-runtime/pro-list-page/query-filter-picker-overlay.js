import { resolveTypicalPageOverlayContainer as n } from "../typical-page-host/index.js";
function o() {
  if (typeof document > "u")
    return null;
  return n() ?? document.body;
}
const e = {
  matchWidth: !1,
  container: o
}, t = {
  zIndex: 1200,
  container: o
};
export {
  t as queryFilterDatePickerOverlay,
  e as queryFilterPickerOverlay
};
