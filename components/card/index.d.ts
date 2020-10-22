interface Props {
  title?: string | JSX.Element
  size?: 'small' | 'default' | 'large'
  type?: 'simple' | 'default'
  hoverable?: boolean
  extra?: JSX.Element
  extraType?: 'default' | 'hover'
  coverUrl?: string
  content?: string | JSX.Element
}
declare class Card extends React.Component<Props, any> {
}
export default Card
