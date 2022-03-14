export enum SizeEnum {
  Small = 'small',
  Normal = 'normal',
  Large = 'large',
}

export type SizeType =
  | SizeEnum.Small
  | SizeEnum.Normal
  | SizeEnum.Large
  | number
  | number[]
  | string
  | string[]
