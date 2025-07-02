import { IsStrongPassword, IsNotEmpty, IsString } from 'class-validator'
import { PickType } from '@nestjs/swagger'

import { UserDocs } from '../documentation/create-user.request'

export class CreateUserRequestDto extends PickType(UserDocs, [
  'username',
  'password',
]) {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string
}
