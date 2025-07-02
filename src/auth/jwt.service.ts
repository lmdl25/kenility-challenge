import { UnauthorizedException, Injectable, Inject } from '@nestjs/common'
import { TokenExpiredError, JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UsersService } from '../users/users.service'

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username)
    if (user?.password) {
      const checkPassword = await bcrypt.compare(password, user.password)
      return checkPassword
    }
    return false
  }

  async validateToken(token: string): Promise<{
    token: string
    userId: number
    consumerId: number
    isSuperAdmin: boolean
  }> {
    try {
      await this.jwtService.verifyAsync(token)
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Expired token')
      throw new UnauthorizedException()
    }
    return this.jwtService.decode(token)
  }

  async getTokenForUser(username: string): Promise<string> {
    const payload = { username }
    const token = this.jwtService.sign(payload)
    await this.usersService.updateToken(username, token)
    return token
  }
}
