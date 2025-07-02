import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { JwtAuthServiceModule } from '../auth/jwt.service.module'
import { UserSchema, User } from './schemas/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtAuthServiceModule,
  ],
  providers: [UsersService, JwtAuthServiceModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
