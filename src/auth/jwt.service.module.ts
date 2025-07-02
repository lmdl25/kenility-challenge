import { ConfigService, ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserSchema, User } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import { JwtAuthService } from './jwt.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number.parseInt(
            configService.getOrThrow<string>(
              'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
            ),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthService, UsersService],
  exports: [JwtAuthService],
})
export class JwtAuthServiceModule {}
