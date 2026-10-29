export class CliUsageError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CliUsageError'
  }
}

export function isCliUsageError(error) {
  return error instanceof CliUsageError
}
