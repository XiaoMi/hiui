export interface Props {
  duration?: number
  showDots?: boolean
  showArrows?: boolean
  defaultActive?: number
  showPages?: boolean
  children: JSX.Element[]
  style?: CSSProperties
  className?: string
}
declare const Carousel: React.ComponentType<Props>
export default Carousel
