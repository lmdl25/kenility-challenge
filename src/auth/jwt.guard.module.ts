import { Module } from '@nestjs/common'

import { JwtAuthServiceModule } from './jwt.service.module'
import { JwtAuthGuard } from './jwt.guard'

@Module({
  imports: [JwtAuthServiceModule],
  providers: [JwtAuthGuard, JwtAuthServiceModule],
  exports: [JwtAuthGuard, JwtAuthServiceModule],
})
export class AuthModule {}
