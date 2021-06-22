interface TimeProps extends CommonProps {
  type?: 'default' | 'timerange'
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  style?: CSSProperties
  className?: string
}
declare const TimePicker: React.ComponentType<TimeProps>
export default TimePicker
