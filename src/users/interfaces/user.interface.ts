export interface IUser {
  readonly username: string
  readonly password: string
  readonly token?: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}
