interface TimeProps extends CommonProps {
  type?: 'default' | 'timerange'
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  style?: CSSProperties
  className?: string
}
declare const TimePicker: React.ComponentType<TimeProps>
export default TimePicker
