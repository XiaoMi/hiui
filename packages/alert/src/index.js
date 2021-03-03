import Alert from "./Alert.tsx"
import "./style/index.scss"
import { depreactedPropsCompat } from "@hi-ui/hiui/es/_util"
import Provider from "@hi-ui/hiui/es/context"

export default depreactedPropsCompat([
  ["content", "message"],
  ["duration", "autoCloseTime"]
])(Provider(Alert))
