import {
  UnauthorizedException,
  BadRequestException,
  Controller,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { UsernameAlreadyInUseError } from './errors/users.errors'
import { CreateUserRequestDto } from './dto/create-user.dto'
import { JwtAuthService } from '../auth/jwt.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { UsersService } from './users.service'
import { LoginRequestDto } from './dto/login'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtAuthService,
  ) { }
  @ApiOperation({
    description:
      'Creates new user, password must have at least 1 uppercase, ' +
      '1 symbol, 1 number, and the minimum length is 6 characters',
  })
  @ApiTags('Users')
  @Post()
  async create(@Body() createUserDto: CreateUserRequestDto) {
    try {
      return await this.usersService.create(createUserDto)
    } catch (error) {
      if (error instanceof UsernameAlreadyInUseError) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  @ApiTags('Users')
  @Post('login')
  async login(@Body() credentials: LoginRequestDto) {
    try {
      const isAuthorized = await this.jwt.validateUser(
        credentials.username,
        credentials.password,
      )
      if (!isAuthorized) {
        throw new UnauthorizedException()
      }
      return {
        token: await this.jwt.getTokenForUser(credentials.username),
      }
    } catch (error) {
      if (error instanceof UsernameAlreadyInUseError) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }
}
