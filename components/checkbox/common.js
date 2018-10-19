const CheckboxEvents = {}
const EventManager = {
  setEvent: (name, event) => {
    name && event && (CheckboxEvents[name] = event)
  },
  getEvent: (name) => {
    return CheckboxEvents[name] ? CheckboxEvents[name] : null
  }
}
export default EventManager
