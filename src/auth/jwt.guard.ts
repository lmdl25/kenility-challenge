import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common'

import { JwtAuthService } from './jwt.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization: string }
    }>()

    await this.jwtService.validateToken(request.headers.authorization)
    return true
  }
}
