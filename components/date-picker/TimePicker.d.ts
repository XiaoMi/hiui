import { DateRange } from './index';

export interface TimeProps extends CommonProps {
  type?: 'default' | 'timerange'
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  placement?: string
  clearable?: boolean
  value?: Date | string | number | object,
  defaultValue?: Date | string | number | object,
  format?: string,
  disabled?: boolean,
  placeholder?: string,
  onChange?: (date: Date | DateRange, dataStr: string) => void,
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  style?: React.CSSProperties
  className?: string
}
declare const TimePicker: React.ComponentType<TimeProps>
export default TimePicker
