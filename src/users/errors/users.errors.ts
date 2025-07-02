export class UsernameAlreadyInUseError extends Error {
  constructor(msg?: string) {
    super('UsernameAlreadyInUse Error')
    this.message = msg || 'UsernameAlreadyInUseError'
  }
}
